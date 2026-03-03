const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const mongoose = require('mongoose');
const methods = createCRUDController('Employee');

// Override create to require HR approval
const originalCreate = methods.create;
methods.create = async (req, res) => {
    try {
        const Employee = mongoose.model('Employee');
        const Approval = mongoose.model('Approval');

        // Check if user has permission to create (only admin and owner)
        const { role } = req.admin;
        if (role !== 'admin' && role !== 'owner' && role !== 'hr_head') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to create employees. Restricted to HR Head and System Admin.',
            });
        }

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

// Override read to restrict employee access
methods.read = async (req, res) => {
    try {
        const Employee = mongoose.model('Employee');
        const { role, email: adminEmail } = req.admin;

        let query = { _id: req.params.id, removed: false };
        if (role === 'employee') {
            query.email = adminEmail;
        }

        const result = await Employee.findOne(query).exec();

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found or you do not have permission to view this record.',
            });
        }

        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully found employee',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Override list to restrict employee access
methods.list = async (req, res) => {
    try {
        const Model = mongoose.model('Employee');
        const { role, email: adminEmail } = req.admin;

        const page = req.query.page || 1;
        const limit = parseInt(req.query.items) || 10;
        const skip = page * limit - limit;

        const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

        let query = { removed: false };
        if (role === 'employee') {
            query.email = adminEmail;
        }

        if (filter && equal) {
            query[filter] = equal;
        }

        const resultsPromise = Model.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortValue })
            .populate()
            .exec();

        const countPromise = Model.countDocuments(query);
        const [result, count] = await Promise.all([resultsPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        const pagination = { page, pages, count };

        if (count > 0) {
            return res.status(200).json({
                success: true,
                result,
                pagination,
                message: 'Successfully found all documents',
            });
        } else {
            return res.status(203).json({
                success: true,
                result: [],
                pagination,
                message: 'Collection is Empty',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Override listAll to restrict employee access
methods.listAll = async (req, res) => {
    try {
        const Model = mongoose.model('Employee');
        const { role, email: adminEmail } = req.admin;

        let query = { removed: false };
        if (role === 'employee') {
            query.email = adminEmail;
        }

        const result = await Model.find(query)
            .sort({ enabled: -1 })
            .populate()
            .exec();

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        } else {
            return res.status(203).json({
                success: true,
                result: [],
                message: 'Collection is Empty',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Override search to restrict employee access
methods.search = async (req, res) => {
    try {
        const Model = mongoose.model('Employee');
        const { role, email: adminEmail } = req.admin;

        if (req.query.q === undefined || req.query.q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'The query parameter "q" is required.',
            });
        }

        let query = {
            removed: false,
            $or: [
                { name: { $regex: new RegExp(req.query.q, 'i') } },
                { email: { $regex: new RegExp(req.query.q, 'i') } },
            ],
        };

        if (role === 'employee') {
            // If employee, they can only search their own record
            query = {
                removed: false,
                email: adminEmail,
                $or: [
                    { name: { $regex: new RegExp(req.query.q, 'i') } },
                ],
            };
        }

        const result = await Model.find(query)
            .limit(10)
            .exec();

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        } else {
            return res.status(203).json({
                success: true,
                result: [],
                message: 'Collection is Empty',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get current employee's own profile (salary, etc.) - only for role 'employee'
methods.myProfile = async (req, res) => {
    try {
        const Employee = mongoose.model('Employee');
        const { role, email: adminEmail } = req.admin;

        if (role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Only employees can access their own profile.',
            });
        }

        const employee = await Employee.findOne({
            removed: false,
            email: adminEmail,
        })
            .select('name position department salary taxableAllowance nonTaxableAllowance leaveBalance')
            .lean()
            .exec();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee profile not found for your account.',
            });
        }

        return res.status(200).json({
            success: true,
            result: employee,
            message: 'Successfully found your profile',
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
        const { role, email: adminEmail } = req.admin;

        let query = { removed: false };
        if (role === 'employee') {
            query.email = adminEmail;
        }

        const totalEmployees = await Employee.countDocuments(query);
        const activeEmployees = await Employee.countDocuments({ ...query, enabled: true });
        const pendingApproval = await Employee.countDocuments({
            ...query,
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
