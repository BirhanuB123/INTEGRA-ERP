const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
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
        unique: true,
    },
    description: {
        type: String,
    },
    parentCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'ProductCategory',
        autopopulate: true,
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

productCategorySchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('ProductCategory', productCategorySchema);
