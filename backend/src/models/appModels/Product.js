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
    description: {
        type: String,
    },
    // productCategory: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'ProductCategory',
    //     autopopulate: true,
    // },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
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
