const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
    phone: String,
    email: String,
    position: String,
    department: String,
    salary: {
        type: Number,
    },
    taxableAllowance: {
        type: Number,
        default: 0,
    },
    nonTaxableAllowance: {
        type: Number,
        default: 0,
    },
    address: String,
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    birthday: {
        type: Date,
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    approvalStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected'],
    },
    approvedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
    },
    approvalDate: {
        type: Date,
    },
    employmentStatus: {
        type: String,
        default: 'active',
        enum: ['hired', 'probation', 'active', 'terminated'],
    },
    leaveBalance: {
        type: Number,
        default: 0,
    },
    overtimeRate: {
        type: Number,
        default: 1.25, // Standard overtime rate
    },
    rejectionReason: {
        type: String,
    },
    requiresFinanceApproval: {
        type: Boolean,
        default: false,
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

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Employee', schema);
