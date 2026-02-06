const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    number: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client', // Or a dedicated Supplier model if one exists
        required: true,
        autopopulate: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true,
                autopopulate: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
        },
    ],
    subTotal: {
        type: Number,
        default: 0,
    },
    taxTotal: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'sent', 'received', 'cancelled'],
        default: 'draft',
    },
    notes: {
        type: String,
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

purchaseOrderSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
