const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');

function customController() {
    const methods = createCRUDController('PurchaseOrder');
    methods.summary = summary;
    const Approval = mongoose.model('Approval');

    // Override create to handle spending thresholds
    methods.create = async (req, res) => {
        try {
            const { total } = req.body;
            const THRESHOLD = 50000; // ETB threshold for Finance Head approval

            // 1. Create the Purchase Order
            const Model = mongoose.model('PurchaseOrder');

            // If total > threshold, set status to pending by default (though it might already be)
            if (total > THRESHOLD) {
                req.body.status = 'pending';
            }

            const result = await new Model(req.body).save();

            // 2. If total exceeds threshold, trigger an automated Approval request
            if (total > THRESHOLD) {
                await new Approval({
                    entityType: 'PurchaseOrder', // Note: Need to check if 'PurchaseOrder' is in enum
                    entityId: result._id,
                    requestedBy: req.admin._id,
                    approvalType: 'finance_approval',
                    status: 'pending',
                    priority: 'high',
                    comments: `Purchase Order exceeds spending threshold of ${THRESHOLD} ETB. Requires Finance Head approval.`,
                }).save();
            }

            return res.status(200).json({
                success: true,
                result,
                message: total > THRESHOLD
                    ? 'Purchase Order created and sent for Finance Head approval due to spending threshold.'
                    : 'Purchase Order created successfully',
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
