const mongoose = require('mongoose');

const fiscalPeriodSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
    lockedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
    },
    lockDate: {
        type: Date,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('FiscalPeriod', fiscalPeriodSchema);
