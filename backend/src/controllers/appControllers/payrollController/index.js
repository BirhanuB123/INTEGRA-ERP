const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { payrollEngine } = require('./payrollEngine');

function customController() {
    const methods = createCRUDController('Payroll');
    const Employee = mongoose.model('Employee');
    const Payslip = mongoose.model('Payslip');

    // Override create to generate all payslips
    methods.create = async (req, res) => {
        try {
            const { month, year } = req.body;

            // 1. Check if payroll for this month already exists
            const existingPayroll = await mongoose.model('Payroll').findOne({ month, year, removed: false });
            if (existingPayroll) {
                return res.status(400).json({
                    success: false,
                    message: 'Payroll for this period already exists',
                });
            }

            // 2. Create the Payroll Header
            const Model = mongoose.model('Payroll');
            const payroll = await new Model({
                ...req.body,
                createdBy: req.admin._id,
            }).save();

            // 3. Get all active employees
            const employees = await Employee.find({ removed: false, enabled: true });

            let totalGross = 0;
            let totalNet = 0;
            let totalTax = 0;
            let totalPensionComp = 0;
            let totalPensionEmp = 0;

            // 4. Generate Payslips
            for (const emp of employees) {
                const salaryInfo = payrollEngine({
                    basicSalary: emp.salary || 0,
                    taxableAllowance: emp.taxableAllowance || 0,
                    nonTaxableAllowance: emp.nonTaxableAllowance || 0,
                });

                const payslip = await new Payslip({
                    employee: emp._id,
                    payroll: payroll._id,
                    basicSalary: emp.salary,
                    taxableAllowance: emp.taxableAllowance,
                    nonTaxableAllowance: emp.nonTaxableAllowance,
                    ...salaryInfo,
                }).save();

                totalGross += salaryInfo.grossSalary;
                totalNet += salaryInfo.netPay;
                totalTax += salaryInfo.incomeTax;
                totalPensionComp += salaryInfo.pensionCompany;
                totalPensionEmp += salaryInfo.pensionEmployee;
            }

            // 5. Update Payroll Totals
            await mongoose.model('Payroll').findByIdAndUpdate(payroll._id, {
                totalGrossSalary: totalGross,
                totalNetPay: totalNet,
                totalTax: totalTax,
                totalPensionCompany: totalPensionComp,
                totalPensionEmployee: totalPensionEmp,
                status: 'processed',
            });

            return res.status(200).json({
                success: true,
                result: payroll,
                message: 'Payroll generated successfully',
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };

    return methods;
}

module.exports = customController();
