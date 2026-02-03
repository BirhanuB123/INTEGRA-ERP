const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const DATABASE = process.env.DATABASE || 'mongodb://localhost:27017/integra-erp';

async function migrateApprovalFields() {
    try {
        await mongoose.connect(DATABASE);
        console.log('✅ Connected to MongoDB');

        // Load models
        require('../models/appModels/Employee');
        require('../models/appModels/Payment');
        require('../models/appModels/Invoice');

        const Employee = mongoose.model('Employee');
        const Payment = mongoose.model('Payment');
        const Invoice = mongoose.model('Invoice');

        // Update existing employees without approval status
        const employeeResult = await Employee.updateMany(
            { approvalStatus: { $exists: false } },
            {
                $set: {
                    approvalStatus: 'approved', // Mark existing employees as approved
                    approvalDate: new Date(),
                },
            }
        );
        console.log(`✅ Updated ${employeeResult.modifiedCount} employees with approval status`);

        // Update existing payments without approval status
        const paymentResult = await Payment.updateMany(
            { approvalStatus: { $exists: false } },
            {
                $set: {
                    approvalStatus: 'approved', // Mark existing payments as approved
                    approvalDate: new Date(),
                },
            }
        );
        console.log(`✅ Updated ${paymentResult.modifiedCount} payments with approval status`);

        // Update existing invoices without approval status
        const invoiceResult = await Invoice.updateMany(
            { approvalStatus: { $exists: false } },
            {
                $set: {
                    approvalStatus: 'approved',
                    approvalDate: new Date(),
                },
            }
        );
        console.log(`✅ Updated ${invoiceResult.modifiedCount} invoices with approval status`);

        console.log('\n✅ Migration completed successfully!');
        console.log('All existing records have been marked as approved.');

        await mongoose.connection.close();
        console.log('✅ Database connection closed');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateApprovalFields();
