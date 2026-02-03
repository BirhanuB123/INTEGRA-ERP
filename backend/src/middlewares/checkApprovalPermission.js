const checkApprovalPermission = (req, res, next) => {
    const userRole = req.admin.role;
    const { approvalType } = req.body;

    // Owner can approve anything
    if (userRole === 'owner') {
        return next();
    }

    // HR Head can only approve HR-related requests
    if (userRole === 'hr_head' && approvalType === 'hr_approval') {
        return next();
    }

    // Finance Head can only approve finance-related requests
    if (userRole === 'finance_head' && approvalType === 'finance_approval') {
        return next();
    }

    // If none of the above conditions are met, deny access
    return res.status(403).json({
        success: false,
        message: 'You do not have permission to approve this type of request',
    });
};

module.exports = checkApprovalPermission;
