const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'on_leave'],
        default: 'present',
    },
    overtimeHours: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

attendanceSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Attendance', attendanceSchema);
