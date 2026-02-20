const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function customController() {
    const methods = createCRUDController('Attendance');
    const Approval = mongoose.model('Approval');

    // Handle manual attendance adjustments that might need approval
    methods.update = async (req, res) => {
        try {
            const Model = mongoose.model('Attendance');
            const { id } = req.params;

            req.body.removed = false;
            const result = await Model.findOneAndUpdate(
                { _id: id, removed: false },
                req.body,
                { new: true, runValidators: true }
            );
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Attendance record not found.',
                });
            }

            // If status changed to 'late' or 'absent' manually, or overtime adjusted, notify HR
            if (req.body.overtimeHours > 0 || req.body.status === 'absent') {
                await new Approval({
                    entityType: 'Attendance',
                    entityId: result._id,
                    requestedBy: req.admin._id,
                    approvalType: 'hr_approval',
                    status: 'pending',
                    priority: 'low',
                    comments: `Attendance adjustment for ${result.date.toDateString()}. Status: ${result.status}, Overtime: ${result.overtimeHours}h.`,
                }).save();
            }

            return res.status(200).json({
                success: true,
                result,
                message: 'Attendance updated successfully.',
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };

    // Handle manual attendance creation
    methods.create = async (req, res) => {
        try {
            const Model = mongoose.model('Attendance');

            req.body.removed = false;
            const result = await new Model(req.body).save();

            // If status is 'late' or 'absent' or has overtime, log it for HR (optional, but consistent with update)
            if (req.body.overtimeHours > 0 || req.body.status === 'absent') {
                await new Approval({
                    entityType: 'Attendance',
                    entityId: result._id,
                    requestedBy: req.admin._id,
                    approvalType: 'hr_approval',
                    status: 'pending',
                    priority: 'low',
                    comments: `New Attendance record: ${result.date.toDateString()}. Status: ${result.status}, Overtime: ${result.overtimeHours}h.`,
                }).save();
            }

            return res.status(200).json({
                success: true,
                result,
                message: 'Attendance created successfully.',
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };

    return methods;
}

module.exports = customController();
