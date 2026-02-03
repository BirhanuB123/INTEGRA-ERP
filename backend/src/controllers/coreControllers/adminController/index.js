const mongoose = require('mongoose');
const { generate: uniqueId } = require('shortid');
const createUserController = require('@/controllers/middlewaresControllers/createUserController');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const methods = createUserController('Admin');
const crudMethods = createCRUDController('Admin');

// Override create to handle password generation
const originalCreate = crudMethods.create;
crudMethods.create = async (req, res) => {
    try {
        const Admin = mongoose.model('Admin');
        const AdminPassword = mongoose.model('AdminPassword');

        // Check if admin with same email exists
        const { email } = req.body;
        const existingAdmin = await Admin.findOne({ email, removed: false });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this email already exists',
            });
        }

        // Generate salt and password hash
        const salt = uniqueId();
        const password = req.body.password || 'admin123'; // Default password if none provided
        const newAdminPasswordModel = new AdminPassword();
        const passwordHash = newAdminPasswordModel.generateHash(salt, password);

        // Create the admin
        const adminData = { ...req.body };
        delete adminData.password; // Remove password from admin data
        const admin = await new Admin(adminData).save();

        // Create the admin password
        await new AdminPassword({
            user: admin._id,
            password: passwordHash,
            salt: salt,
            emailVerified: true,
        }).save();

        return res.status(200).json({
            success: true,
            result: admin,
            message: `Staff member created successfully. Default password is: ${password}`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    ...methods,
    ...crudMethods,
};
