const mongoose = require('mongoose');

const checkFiscalPeriod = async (req, res, next) => {
    try {
        const FiscalPeriod = mongoose.model('FiscalPeriod');

        // 1. Identify valid date for the transaction
        let transactionDate = req.body.date || new Date();

        // If it's an update, we might need to check the original date too
        // But usually checking the provided body date is sufficient for "moving" a transaction
        // into a closed period.

        // 2. Find if any closed period covers this date
        const closedPeriod = await FiscalPeriod.findOne({
            startDate: { $lte: transactionDate },
            endDate: { $gte: transactionDate },
            isClosed: true,
            removed: false,
        });

        if (closedPeriod) {
            return res.status(403).json({
                success: false,
                message: `Transaction date falls within a closed fiscal period (${closedPeriod.name}). Modifications are not allowed.`,
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = checkFiscalPeriod;
