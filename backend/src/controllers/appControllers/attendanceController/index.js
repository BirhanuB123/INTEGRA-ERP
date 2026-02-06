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

            // Update the record
            const result = await Model.findByIdAndUpdate(id, req.body, { new: true });

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

    return methods;
}

module.exports = customController();
