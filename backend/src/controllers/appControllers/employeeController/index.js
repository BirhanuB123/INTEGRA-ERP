const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const mongoose = require('mongoose');
const methods = createCRUDController('Employee');

// Override create to require HR approval
const originalCreate = methods.create;
methods.create = async (req, res) => {
    try {
        const Employee = mongoose.model('Employee');
        const Approval = mongoose.model('Approval');

        // Set approval status to pending
        req.body.approvalStatus = 'pending';
        req.body.removed = false;

        // Create the employee
        const employee = await new Employee({
            ...req.body,
        }).save();

        // Create approval request
        await new Approval({
            entityType: 'Employee',
            entityId: employee._id,
            requestedBy: req.admin._id,
            approvalType: 'hr_approval',
            priority: 'medium',
            metadata: {
                employeeName: employee.name,
                position: employee.position,
                department: employee.department,
            },
            removed: false,
        }).save();

        return res.status(200).json({
            success: true,
            result: employee,
            message: 'Employee created successfully. Pending HR approval.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Override update to check for salary changes
const originalUpdate = methods.update;
methods.update = async (req, res) => {
    try {
        const Employee = mongoose.model('Employee');
        const Approval = mongoose.model('Approval');

        // Get the existing employee
        const existingEmployee = await Employee.findById(req.params.id);

        if (!existingEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found',
            });
        }

        // Check if salary is being changed
        const salaryChanged = req.body.salary && req.body.salary !== existingEmployee.salary;

        if (salaryChanged) {
            // Require finance approval for salary changes
            req.body.requiresFinanceApproval = true;
            req.body.approvalStatus = 'pending';

            // Create approval request
            await new Approval({
                entityType: 'Employee',
                entityId: existingEmployee._id,
                requestedBy: req.admin._id,
                approvalType: 'finance_approval',
                priority: 'high',
                metadata: {
                    employeeName: existingEmployee.name,
                    oldSalary: existingEmployee.salary,
                    newSalary: req.body.salary,
                    changeType: 'salary_update',
                },
                removed: false,
            }).save();
        }

        // Update the employee
        req.body.removed = false;
        const result = await Employee.findOneAndUpdate(
            {
                _id: req.params.id,
                removed: false,
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        const message = salaryChanged
            ? 'Employee updated. Salary change pending Finance approval.'
            : 'Employee updated successfully';

        return res.status(200).json({
            success: true,
            result,
            message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

methods.summary = async (req, res) => {
    try {
        const Employee = mongoose.model('Employee');

        const totalEmployees = await Employee.countDocuments({ removed: false });
        const activeEmployees = await Employee.countDocuments({ removed: false, enabled: true });
        const pendingApproval = await Employee.countDocuments({
            removed: false,
            approvalStatus: 'pending'
        });

        return res.status(200).json({
            success: true,
            result: {
                new: pendingApproval,
                active: totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0,
                total: totalEmployees,
                pendingApproval,
            },
            message: 'Successfully get summary of employees',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = methods;
