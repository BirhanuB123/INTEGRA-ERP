const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    employee: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee',
        required: true,
        autopopulate: true,
    },
    type: {
        type: String,
        enum: ['annual', 'sick', 'maternity', 'paternity', 'unpaid'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
    },
    daysCount: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

leaveSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Leave', leaveSchema);
