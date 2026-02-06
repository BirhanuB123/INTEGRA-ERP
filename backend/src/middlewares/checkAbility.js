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
            employee: ['owner', 'admin', 'hr_head'],
            attendance: ['owner', 'admin', 'hr_head'],
            leave: ['owner', 'admin', 'hr_head'],

            // General
            invoice: ['owner', 'admin', 'finance_head', 'department_manager', 'employee'], // Employees might see their own or shared
            quote: ['owner', 'admin', 'finance_head', 'department_manager', 'employee'],
            payment: ['owner', 'admin', 'finance_head'],
            client: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager', 'employee'],
            product: ['owner', 'admin', 'hr_head', 'finance_head', 'department_manager', 'employee'],
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
