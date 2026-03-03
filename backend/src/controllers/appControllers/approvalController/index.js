const mongoose = require('mongoose');

const Approval = mongoose.model('Approval');

// Attach Leave summary (days, dates) to approval records for display in dashboard
async function enrichApprovalsWithLeaveDetails(approvals) {
    const Leave = mongoose.model('Leave');
    const plain = approvals.map((a) => (a.toObject ? a.toObject() : { ...a }));
    for (const approval of plain) {
        if (approval.entityType === 'Leave' && approval.entityId) {
            try {
                const leave = await Leave.findById(approval.entityId).lean().exec();
                if (leave) {
                    approval.entityDetails = {
                        daysCount: leave.daysCount,
                        startDate: leave.startDate,
                        endDate: leave.endDate,
                        type: leave.type,
                    };
                }
            } catch (err) {
                // ignore per-row errors
            }
        }
    }
    return plain;
}

// Create a new approval request
const create = async (req, res) => {
    try {
        const { entityType, entityId, approvalType, priority, metadata } = req.body;
        const requestedBy = req.admin._id;

        // Check if approval already exists for this entity
        const existingApproval = await Approval.findOne({
            entityType,
            entityId,
            status: 'pending',
            removed: false,
        });

        if (existingApproval) {
            return res.status(400).json({
                success: false,
                message: 'An approval request already exists for this entity',
            });
        }

        const approval = await new Approval({
            entityType,
            entityId,
            requestedBy,
            approvalType,
            priority: priority || 'medium',
            metadata: metadata || {},
            removed: false,
        }).save();

        return res.status(200).json({
            success: true,
            result: approval,
            message: 'Approval request created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// List all approvals (filtered by user role)
const list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.items) || 10;
        const skip = (page - 1) * limit;

        const userRole = req.admin.role;
        let filter = { removed: false };

        // Filter based on user role
        if (userRole === 'hr_head') {
            filter.approvalType = 'hr_approval';
        } else if (userRole === 'finance_head') {
            filter.approvalType = 'finance_approval';
        } else if (userRole !== 'owner') {
            // Regular admins can only see their own requests
            filter.requestedBy = req.admin._id;
        }

        const total = await Approval.countDocuments(filter);
        const approvals = await Approval.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ created: -1 })
            .populate('requestedBy', 'name surname');

        const result = await enrichApprovalsWithLeaveDetails(approvals);

        return res.status(200).json({
            success: true,
            result,
            pagination: {
                page,
                pages: Math.ceil(total / limit),
                count: total,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get approvals pending for current user
const myApprovals = async (req, res) => {
    try {
        const userRole = req.admin.role;
        let filter = { removed: false, status: 'pending' };

        // Filter based on user role
        if (userRole === 'hr_head') {
            filter.approvalType = 'hr_approval';
        } else if (userRole === 'finance_head') {
            filter.approvalType = 'finance_approval';
        } else if (userRole !== 'owner') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to approve requests',
            });
        }

        const approvals = await Approval.find(filter)
            .sort({ created: -1 })
            .populate('requestedBy', 'name surname');

        const result = await enrichApprovalsWithLeaveDetails(approvals);

        return res.status(200).json({
            success: true,
            result,
            count: result.length,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Approve a request
const approve = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments, approvedDaysCount } = req.body;
        const approver = req.admin;

        const approval = await Approval.findById(id);

        if (!approval) {
            return res.status(404).json({
                success: false,
                message: 'Approval request not found',
            });
        }

        // Check if already processed
        if (approval.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `This request has already been ${approval.status}`,
            });
        }

        // Check if user can approve this type
        let canApprove = false;

        if (approval.approvalType === 'hr_approval') {
            canApprove = approver.role === 'hr_head';
        } else if (approval.approvalType === 'finance_approval') {
            canApprove = approver.role === 'finance_head';
        } else if (approval.approvalType === 'general_approval') {
            canApprove = approver.role === 'owner' || approver.role === 'admin';
        } else {
            // Default fallback (should not happen if types are enforced)
            canApprove = approver.role === 'owner';
        }

        if (!canApprove) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to approve this request',
            });
        }

        // Prevent self-approval
        if (approval.requestedBy.toString() === approver._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You cannot approve your own request',
            });
        }

        // Update approval
        approval.status = 'approved';
        approval.approvedBy = approver._id;
        approval.approvalDate = new Date();
        approval.comments = comments || '';
        await approval.save();

        // Update the entity
        const Model = mongoose.model(approval.entityType);
        const entity = await Model.findById(approval.entityId);

        if (entity) {
            entity.approvalStatus = 'approved';
            entity.approvedBy = approver._id;
            entity.approvalDate = new Date();

            // Leave model uses status, not approvalStatus
            if (approval.entityType === 'Leave') {
                entity.status = 'approved';
                // HR can approve with fewer days than requested
                const days = approvedDaysCount != null && !isNaN(Number(approvedDaysCount)) && Number(approvedDaysCount) >= 1
                    ? Math.min(Math.floor(Number(approvedDaysCount)), entity.daysCount)
                    : entity.daysCount;
                if (days !== entity.daysCount) {
                    entity.daysCount = days;
                    const end = new Date(entity.startDate);
                    end.setDate(end.getDate() + days - 1);
                    entity.endDate = end;
                }
            }

            if (approval.entityType === 'Invoice') {
                entity.approved = true;
            }

            // Handle Payment approval specific logic
            if (approval.entityType === 'Payment') {
                const Invoice = mongoose.model('Invoice');
                const invoice = await Invoice.findById(entity.invoice);

                if (invoice) {
                    const { calculate } = require('@/helpers');
                    const { amount } = entity;
                    const { total, discount, credit } = invoice;

                    let paymentStatus =
                        calculate.sub(total, discount) === calculate.add(credit, amount)
                            ? 'paid'
                            : calculate.add(credit, amount) > 0
                                ? 'partially'
                                : 'unpaid';

                    await Invoice.findOneAndUpdate(
                        { _id: entity.invoice },
                        {
                            $push: { payment: entity._id.toString() },
                            $inc: { credit: amount },
                            $set: { paymentStatus: paymentStatus },
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    ).exec();
                }
            }

            await entity.save();
        }

        return res.status(200).json({
            success: true,
            result: approval,
            message: 'Request approved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Reject a request
const reject = async (req, res) => {
    try {
        const { id } = req.params;
        const { comments } = req.body;
        const approver = req.admin;

        const approval = await Approval.findById(id);

        if (!approval) {
            return res.status(404).json({
                success: false,
                message: 'Approval request not found',
            });
        }

        // Check if already processed
        if (approval.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `This request has already been ${approval.status}`,
            });
        }

        // Check if user can reject this type
        // Check if user can reject this type
        let canReject = false;

        if (approval.approvalType === 'hr_approval') {
            canReject = approver.role === 'hr_head';
        } else if (approval.approvalType === 'finance_approval') {
            canReject = approver.role === 'finance_head';
        } else if (approval.approvalType === 'general_approval') {
            canReject = approver.role === 'owner' || approver.role === 'admin';
        } else {
            canReject = approver.role === 'owner';
        }

        if (!canReject) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to reject this request',
            });
        }

        // Update approval
        approval.status = 'rejected';
        approval.approvedBy = approver._id;
        approval.approvalDate = new Date();
        approval.comments = comments || '';
        await approval.save();

        // Update the entity
        const Model = mongoose.model(approval.entityType);
        const entity = await Model.findById(approval.entityId);

        if (entity) {
            entity.approvalStatus = 'rejected';
            if (approval.entityType === 'Leave') {
                entity.status = 'rejected';
            }
            entity.rejectionReason = comments || 'No reason provided';
            await entity.save();
        }

        return res.status(200).json({
            success: true,
            result: approval,
            message: 'Request rejected successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get approval history for an entity
const history = async (req, res) => {
    try {
        const { entityType, entityId } = req.query;

        if (!entityType || !entityId) {
            return res.status(400).json({
                success: false,
                message: 'entityType and entityId are required',
            });
        }

        const approvals = await Approval.find({
            entityType,
            entityId,
            removed: false,
        }).sort({ created: -1 });

        return res.status(200).json({
            success: true,
            result: approvals,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get approval summary/statistics
const summary = async (req, res) => {
    try {
        const userRole = req.admin.role;
        let filter = { removed: false };

        // Filter based on user role
        if (userRole === 'hr_head') {
            filter.approvalType = 'hr_approval';
        } else if (userRole === 'finance_head') {
            filter.approvalType = 'finance_approval';
        }

        const pending = await Approval.countDocuments({ ...filter, status: 'pending' });
        const approved = await Approval.countDocuments({ ...filter, status: 'approved' });
        const rejected = await Approval.countDocuments({ ...filter, status: 'rejected' });

        return res.status(200).json({
            success: true,
            result: {
                pending,
                approved,
                rejected,
                total: pending + approved + rejected,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Read a single approval
const read = async (req, res) => {
    try {
        const { id } = req.params;
        const approval = await Approval.findById(id);

        if (!approval || approval.removed) {
            return res.status(404).json({
                success: false,
                message: 'Approval not found',
            });
        }

        return res.status(200).json({
            success: true,
            result: approval,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    create,
    list,
    myApprovals,
    approve,
    reject,
    history,
    summary,
    read,
};
