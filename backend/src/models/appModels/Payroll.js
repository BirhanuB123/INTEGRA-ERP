const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['draft', 'processed', 'paid'],
        default: 'draft',
    },
    totalGrossSalary: {
        type: Number,
        default: 0,
    },
    totalNetPay: {
        type: Number,
        default: 0,
    },
    totalTax: {
        type: Number,
        default: 0,
    },
    totalPensionCompany: {
        type: Number,
        default: 0,
    },
    totalPensionEmployee: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        autopopulate: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

payrollSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Payroll', payrollSchema);
