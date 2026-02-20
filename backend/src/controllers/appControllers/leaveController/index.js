const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function customController() {
    const methods = createCRUDController('Leave');
    const Approval = mongoose.model('Approval');

    // Override create to handle automated HR approval
    methods.create = async (req, res) => {
        try {
            const Model = mongoose.model('Leave');
            const { startDate, endDate, daysCount } = req.body;

            // Validation
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > end) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date cannot be after end date.',
                });
            }

            // Auto-calculate daysCount from start/end if not provided or invalid
            let days = daysCount;
            if (days == null || isNaN(Number(days)) || Number(days) < 1) {
                const diffTime = Math.abs(end - start);
                days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            }
            req.body.daysCount = Number(days);

            // 1. Create the Leave request
            req.body.status = 'pending';
            req.body.removed = false;
            const result = await new Model(req.body).save();

            // 2. Trigger an automated HR Approval request
            await new Approval({
                entityType: 'Leave',
                entityId: result._id,
                requestedBy: req.admin._id,
                approvalType: 'hr_approval',
                status: 'pending',
                priority: 'medium',
                comments: `Leave request for ${req.body.daysCount} days. Requires HR Head approval.`,
            }).save();

            return res.status(200).json({
                success: true,
                result,
                message: 'Leave request created and sent for HR Head approval.',
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
