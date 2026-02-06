const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'],
    },
    description: {
        type: String,
        trim: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Account', accountSchema);
