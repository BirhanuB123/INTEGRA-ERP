const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function customController() {
    const methods = createCRUDController('Payment');
    const Approval = mongoose.model('Approval');

    // Override create to handle spending thresholds for Finance Head approval
    methods.create = async (req, res) => {
        try {
            const Model = mongoose.model('Payment');
            const { amount } = req.body;
            const THRESHOLD = 50000; // ETB threshold

            // For payments above threshold, we might want to flag them or require approval before processing
            // In this system, we'll create the record but marking it as "pending_finance" or similar would be better
            // For now, we'll create the approval request.

            const result = await new Model(req.body).save();

            if (amount > THRESHOLD) {
                await new Approval({
                    entityType: 'Payment',
                    entityId: result._id,
                    requestedBy: req.admin._id,
                    approvalType: 'finance_approval',
                    status: 'pending',
                    priority: 'high',
                    comments: `Payment of ${amount} ETB exceeds spending threshold. Requires Finance Head approval.`,
                }).save();
            }

            return res.status(200).json({
                success: true,
                result,
                message: amount > THRESHOLD
                    ? 'Payment recorded and sent for Finance Head approval due to amount threshold.'
                    : 'Payment recorded successfully',
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
