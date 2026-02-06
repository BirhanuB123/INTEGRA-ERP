const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    batchNumber: {
        type: String,
        required: true,
        unique: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
        autopopulate: true,
    },
    expiryDate: {
        type: Date,
    },
    manufacturingDate: {
        type: Date,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        autopopulate: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

batchSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Batch', batchSchema);
