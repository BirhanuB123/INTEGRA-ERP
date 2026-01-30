const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Employee');

methods.summary = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const Model = mongoose.model('Employee');

        const totalEmployees = await Model.countDocuments({ removed: false });
        const activeEmployees = await Model.countDocuments({ removed: false, enabled: true });

        return res.status(200).json({
            success: true,
            result: {
                new: 0,
                active: totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0,
            },
            message: 'Successfully get summary of employees',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: error.message,
        });
    }
};

module.exports = methods;
