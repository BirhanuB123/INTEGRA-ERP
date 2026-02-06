const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    barcode: {
        type: String,
    },
    description: {
        type: String,
    },
    productCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductCategory',
        autopopulate: true,
    },
    uom: {
        type: String,
        enum: ['unit', 'kg', 'g', 'l', 'ml', 'm', 'cm', 'box', 'pack'],
        default: 'unit',
    },
    price: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    minStock: {
        type: Number,
        default: 0,
    },
    maxStock: {
        type: Number,
        default: 0,
    },
    reservedQuantity: {
        type: Number,
        default: 0,
    },
    attributes: [
        {
            name: String,
            value: String,
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
});

productSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Product', productSchema);
