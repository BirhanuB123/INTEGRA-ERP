require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { generate: uniqueId } = require('shortid');
const mongoose = require('mongoose');

async function createRoles() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('✅ Connected to MongoDB');

        const Admin = require('../models/coreModels/Admin');
        const AdminPassword = require('../models/coreModels/AdminPassword');

        const rolesToAdd = [
            {
                email: 'hr@admin.com',
                name: 'HR',
                surname: 'Head',
                role: 'hr_head',
                password: 'hr_password123'
            },
            {
                email: 'finance@admin.com',
                name: 'Finance',
                surname: 'Head',
                role: 'finance_head',
                password: 'finance_password123'
            }
        ];

        for (const roleData of rolesToAdd) {
            const existing = await Admin.findOne({ email: roleData.email });
            if (existing) {
                console.log(`⚠️ User ${roleData.email} already exists. Skipping.`);
                continue;
            }

            const salt = uniqueId();
            const newAdminPassword = new AdminPassword();
            const passwordHash = newAdminPassword.generateHash(salt, roleData.password);

            const newAdmin = new Admin({
                email: roleData.email,
                name: roleData.name,
                surname: roleData.surname,
                enabled: true,
                role: roleData.role,
            });

            const savedAdmin = await newAdmin.save();

            const AdminPasswordData = {
                password: passwordHash,
                emailVerified: true,
                salt: salt,
                user: savedAdmin._id,
            };

            await new AdminPassword(AdminPasswordData).save();
            console.log(`✅ Created ${roleData.role}: ${roleData.email} (Password: ${roleData.password})`);
        }

        console.log('\n🥳 Role creation completed!');
        process.exit();
    } catch (e) {
        console.error('\n🚫 Error!', e);
        process.exit(1);
    }
}

createRoles();
