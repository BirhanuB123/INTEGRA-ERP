const mongoose = require('mongoose');

const Payroll = mongoose.model('Payroll');
const Payslip = mongoose.model('Payslip');
const Employee = mongoose.model('Employee');

/**
 * Import payroll from salary sheet data.
 * Body: { month, year, payslips: [ { employeeName | employeeId, basicSalary, taxableAllowance, nonTaxableAllowance, overtime, penalty, grossSalary, taxableIncome, pensionCompany, pensionEmployee, loan, incomeTax, totalDeduction, netPay } ] }
 * Employee can be matched by employeeName (full name) or employeeId (_id).
 */
const importFromSheet = async (req, res) => {
  try {
    const { month, year, payslips } = req.body;

    if (!month || !year || !Array.isArray(payslips) || payslips.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'month, year, and non-empty payslips array are required.',
      });
    }

    const existing = await Payroll.findOne({ month, year, removed: false });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Payroll for ${month}/${year} already exists. Delete or use a different period.`,
      });
    }

    const payroll = await new Payroll({
      month,
      year,
      status: 'processed',
      createdBy: req.admin?._id,
    }).save();

    let totalGross = 0;
    let totalNet = 0;
    let totalTax = 0;
    let totalPensionComp = 0;
    let totalPensionEmp = 0;
    const notFound = [];
    const created = [];

    for (let i = 0; i < payslips.length; i++) {
      const row = payslips[i];
      let employee = null;

      if (row.employeeId) {
        employee = await Employee.findOne({ _id: row.employeeId, removed: false });
      }
      if (!employee && row.employeeName) {
        const name = String(row.employeeName).trim();
        employee = await Employee.findOne({
          removed: false,
          name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });
      }
      if (!employee) {
        notFound.push(row.employeeName || row.employeeId || `Row ${i + 1}`);
        continue;
      }

      const basicSalary = Number(row.basicSalary) || 0;
      const taxableAllowance = Number(row.taxableAllowance) || 0;
      const nonTaxableAllowance = Number(row.nonTaxableAllowance) || 0;
      const overtime = Number(row.overtime) || 0;
      const penalty = Number(row.penalty) || 0;
      const grossSalary = Number(row.grossSalary) || basicSalary + taxableAllowance + nonTaxableAllowance + overtime - penalty;
      const taxableIncome = Number(row.taxableIncome) ?? grossSalary;
      const pensionCompany = Number(row.pensionCompany) || 0;
      const pensionEmployee = Number(row.pensionEmployee) || 0;
      const loan = Number(row.loan) || 0;
      const incomeTax = Number(row.incomeTax) || 0;
      const totalDeduction = Number(row.totalDeduction) || pensionEmployee + incomeTax + loan;
      const netPay = Number(row.netPay) || grossSalary - totalDeduction;

      await new Payslip({
        employee: employee._id,
        payroll: payroll._id,
        basicSalary,
        taxableAllowance,
        nonTaxableAllowance,
        overtime,
        penalty,
        grossSalary,
        taxableIncome,
        pensionCompany,
        pensionEmployee,
        loan,
        incomeTax,
        totalDeduction,
        netPay,
      }).save();

      totalGross += grossSalary;
      totalNet += netPay;
      totalTax += incomeTax;
      totalPensionComp += pensionCompany;
      totalPensionEmp += pensionEmployee;
      created.push(employee.name);
    }

    await Payroll.findByIdAndUpdate(payroll._id, {
      totalGrossSalary: totalGross,
      totalNetPay: totalNet,
      totalTax,
      totalPensionCompany: totalPensionComp,
      totalPensionEmployee: totalPensionEmp,
    });

    return res.status(200).json({
      success: true,
      result: {
        payroll,
        createdCount: created.length,
        notFoundCount: notFound.length,
        notFoundNames: notFound,
      },
      message:
        notFound.length > 0
          ? `Imported ${created.length} payslips. Employees not found: ${notFound.join(', ')}`
          : `Successfully imported ${created.length} payslips for ${month}/${year}.`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = importFromSheet;
