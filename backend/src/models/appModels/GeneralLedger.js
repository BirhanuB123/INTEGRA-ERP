const mongoose = require('mongoose');

const generalLedgerSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    account: {
        type: String,
        required: true,
        enum: ['inventory', 'sales', 'cogs', 'accounts_payable', 'accounts_receivable', 'cash', 'equity'],
    },
    description: {
        type: String,
        required: true,
    },
    debit: {
        type: Number,
        default: 0,
    },
    credit: {
        type: Number,
        default: 0,
    },
    referenceType: {
        type: String,
        enum: ['StockMovement', 'Invoice', 'Payment', 'PurchaseOrder', 'GRN'],
        required: true,
    },
    referenceId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        autopopulate: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

generalLedgerSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('GeneralLedger', generalLedgerSchema);
