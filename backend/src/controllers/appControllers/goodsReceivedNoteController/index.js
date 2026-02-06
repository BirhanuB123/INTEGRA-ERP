const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

function customController() {
    const methods = createCRUDController('GoodsReceivedNote');
    const Product = mongoose.model('Product');
    const StockMovement = mongoose.model('StockMovement');
    const GeneralLedger = mongoose.model('GeneralLedger');

    methods.create = async (req, res) => {
        try {
            const { items, warehouse, status } = req.body;

            // Create the GRN first
            const Model = mongoose.model('GoodsReceivedNote');
            const result = await new Model(req.body).save();

            // If GRN is completed immediately, update stock
            if (status === 'completed') {
                for (const item of items) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        const previousQuantity = product.quantity || 0;
                        const newQuantity = previousQuantity + item.quantityReceived;

                        // 1. Record Stock Movement
                        const movement = await new StockMovement({
                            product: product._id,
                            warehouse: warehouse,
                            type: 'in',
                            quantity: item.quantityReceived,
                            previousQuantity,
                            newQuantity,
                            reference: `GRN-${result.number}`,
                            description: `Stock received via GRN #${result.number}`,
                            user: req.admin._id,
                        }).save();

                        // 2. Update Product Quantity
                        await Product.findByIdAndUpdate(product._id, { quantity: newQuantity });

                        // 3. Create General Ledger Entry
                        const productPrice = product.cost || product.price || 0;
                        const movementValue = item.quantityReceived * productPrice;

                        await new GeneralLedger({
                            account: 'inventory',
                            description: `Stock receipt for ${product.name} (GRN #${result.number})`,
                            debit: movementValue,
                            referenceType: 'GRN',
                            referenceId: result._id,
                            user: req.admin._id,
                        }).save();
                    }
                }
            }

            return res.status(200).json({
                success: true,
                result,
                message: 'Goods Received Note created and stock updated',
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
