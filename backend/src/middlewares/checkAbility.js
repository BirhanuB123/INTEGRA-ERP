const checkAbility = (entity) => {
    return (req, res, next) => {
        const { role } = req.admin;

        // Define permissions map: entity -> allowed roles
        const permissions = {
            // Finance specific
            account: ['owner', 'admin', 'finance_head'],
            fiscalperiod: ['owner', 'admin', 'finance_head'],
            taxes: ['owner', 'admin', 'finance_head'],

            // HR specific
            payroll: ['owner', 'admin', 'hr_head', 'finance_head'],
            payslip: ['owner', 'admin', 'hr_head', 'finance_head'],
            employee: ['owner', 'admin', 'hr_head', 'department_manager'],
            attendance: ['owner', 'admin', 'hr_head', 'department_manager', 'employee'],
            leave: ['owner', 'admin', 'hr_head', 'department_manager', 'employee'],

            // General
            invoice: ['owner', 'admin', 'finance_head', 'department_manager'],
            quote: ['owner', 'admin', 'finance_head', 'department_manager'],
            payment: ['owner', 'admin', 'finance_head'],
            client: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager'],
            product: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager'],
            productcategory: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager'],
            warehouse: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager'],
            stockmovement: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager'],
            batch: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager'],
        };

        const allowedRoles = permissions[entity.toLowerCase()];

        if (allowedRoles && !allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: `Your role (${role}) does not have permission to access ${entity}.`,
            });
        }

        next();
    };
};

module.exports = checkAbility;
