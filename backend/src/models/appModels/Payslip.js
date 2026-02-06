const mongoose = require('mongoose');

const payslipSchema = new mongoose.Schema({
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
    payroll: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payroll',
        required: true,
    },
    basicSalary: {
        type: Number,
        default: 0,
    },
    taxableAllowance: {
        type: Number,
        default: 0,
    },
    nonTaxableAllowance: {
        type: Number,
        default: 0,
    },
    overtime: {
        type: Number,
        default: 0,
    },
    penalty: {
        type: Number,
        default: 0,
    },
    grossSalary: {
        type: Number,
        default: 0,
    },
    taxableIncome: {
        type: Number,
        default: 0,
    },
    pensionCompany: {
        type: Number,
        default: 0,
    },
    pensionEmployee: {
        type: Number,
        default: 0,
    },
    loan: {
        type: Number,
        default: 0,
    },
    incomeTax: {
        type: Number,
        default: 0,
    },
    totalDeduction: {
        type: Number,
        default: 0,
    },
    netPay: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

payslipSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Payslip', payslipSchema);
