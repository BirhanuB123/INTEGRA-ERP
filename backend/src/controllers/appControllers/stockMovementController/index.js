const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function customController() {
    const methods = createCRUDController('StockMovement');
    const Product = mongoose.model('Product');

    methods.create = async (req, res) => {
        try {
            req.body.removed = false;
            const { product, warehouse, type, quantity } = req.body;

            if (!product || !type || quantity == null || quantity === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: product, type, quantity',
                });
            }
            if (!warehouse) {
                return res.status(400).json({
                    success: false,
                    message: 'Warehouse is required',
                });
            }

            // Fetch the product to get current quantity
            const currentProduct = await Product.findById(product);
            if (!currentProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            const qty = Number(quantity);
            if (isNaN(qty) || qty < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Quantity must be a positive number',
                });
            }
            const previousQuantity = currentProduct.quantity || 0;
            let newQuantity = previousQuantity;

            if (type === 'in') {
                newQuantity += qty;
            } else if (type === 'out') {
                newQuantity -= qty;
                if (newQuantity < 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock. Available: ${previousQuantity}`,
                    });
                }
            } else if (type === 'adjustment') {
                newQuantity = qty; // In adjustment, we set the new total
            } else if (type === 'transfer') {
                // Transfer: record the movement; full transfer logic (source/dest warehouses) can be added later
                newQuantity = previousQuantity;
            }

            // Add previous and new quantity to the movement record
            req.body.previousQuantity = previousQuantity;
            req.body.newQuantity = newQuantity;
            req.body.quantity = qty;
            req.body.user = req.admin._id;

            // Create the stock movement
            const Model = mongoose.model('StockMovement');
            const movementBody = { ...req.body, removed: false };
            const result = await new Model(movementBody).save();

            // Update the product quantity (skip for transfer - would need source/dest warehouse logic)
            if (type !== 'transfer') {
                await Product.findByIdAndUpdate(product, { quantity: newQuantity });
            }

            // Create General Ledger Entry (Finance Integration)
            const GeneralLedgerModel = mongoose.model('GeneralLedger');
            const productPrice = currentProduct.cost || currentProduct.price || 0;
            const movementValue = qty * productPrice;

            if (type === 'in' || (type === 'adjustment' && newQuantity > previousQuantity)) {
                // Debit Inventory, Credit Accounts Payable (or Cash)
                await new GeneralLedgerModel({
                    account: 'inventory',
                    description: `Stock increment for ${currentProduct.name} (Ref: ${req.body.reference || 'N/A'})`,
                    debit: movementValue,
                    referenceType: 'StockMovement',
                    referenceId: result._id,
                    user: req.admin._id,
                }).save();
            } else if (type === 'out' || (type === 'adjustment' && newQuantity < previousQuantity)) {
                // Debit COGS, Credit Inventory
                await new GeneralLedgerModel({
                    account: 'cogs',
                    description: `Stock decrement for ${currentProduct.name} (Ref: ${req.body.reference || 'N/A'})`,
                    debit: movementValue,
                    referenceType: 'StockMovement',
                    referenceId: result._id,
                    user: req.admin._id,
                }).save();
                await new GeneralLedgerModel({
                    account: 'inventory',
                    description: `Inventory reduction for ${currentProduct.name} (Ref: ${req.body.reference || 'N/A'})`,
                    credit: movementValue,
                    referenceType: 'StockMovement',
                    referenceId: result._id,
                    user: req.admin._id,
                }).save();
            }

            return res.status(200).json({
                success: true,
                result,
                message: 'Stock movement recorded, product quantity updated, and ledger entry created',
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
