const checkApprovalPermission = (req, res, next) => {
    const userRole = req.admin.role;
    const { approvalType } = req.body;

    // Owner can approve anything
    if (userRole === 'owner') {
        return next();
    }

    if (userRole === 'hr_head') {
        if (approvalType === 'hr_approval') {
            return next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'HR Head can only approve employee-related cases.',
            });
        }
    }

    if (userRole === 'finance_head') {
        if (approvalType === 'finance_approval') {
            return next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Finance Head can only approve financial/payment cases.',
            });
        }
    }

    // If none of the above conditions are met, deny access
    return res.status(403).json({
        success: false,
        message: 'You do not have permission to approve this type of request',
    });
};

module.exports = checkApprovalPermission;
