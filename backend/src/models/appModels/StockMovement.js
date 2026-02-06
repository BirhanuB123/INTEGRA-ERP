const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
        autopopulate: true,
    },
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        required: true,
        autopopulate: true,
    },
    type: {
        type: String,
        enum: ['in', 'out', 'transfer', 'adjustment'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    previousQuantity: {
        type: Number,
        default: 0,
    },
    newQuantity: {
        type: Number,
        default: 0,
    },
    reference: {
        type: String, // PO Number, Invoice Number, Stock Take ID
    },
    description: {
        type: String,
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

stockMovementSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('StockMovement', stockMovementSchema);
