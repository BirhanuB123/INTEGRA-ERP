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
