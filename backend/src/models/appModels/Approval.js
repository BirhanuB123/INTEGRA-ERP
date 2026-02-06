const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },

    entityType: {
        type: String,
        required: true,
        enum: ['Employee', 'Payment', 'Invoice', 'Quote', 'Client', 'PurchaseOrder', 'Leave', 'Attendance'],
    },

    entityId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'entityType',
    },

    requestedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true,
        autopopulate: true,
    },

    approvalType: {
        type: String,
        required: true,
        enum: ['hr_approval', 'finance_approval', 'general_approval'],
    },

    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected'],
    },

    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        autopopulate: true,
    },

    approvalDate: {
        type: Date,
    },

    comments: {
        type: String,
    },

    priority: {
        type: String,
        default: 'medium',
        enum: ['low', 'medium', 'high', 'urgent'],
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    created: {
        type: Date,
        default: Date.now,
    },

    updated: {
        type: Date,
        default: Date.now,
    },
});

approvalSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Approval', approvalSchema);
