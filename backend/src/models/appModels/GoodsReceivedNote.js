const mongoose = require('mongoose');

const goodsReceivedNoteSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    number: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    purchaseOrder: {
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseOrder',
        required: true,
        autopopulate: true,
    },
    warehouse: {
        type: mongoose.Schema.ObjectId,
        ref: 'Warehouse',
        required: true,
        autopopulate: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true,
                autopopulate: true,
            },
            quantityReceived: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

goodsReceivedNoteSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('GoodsReceivedNote', goodsReceivedNoteSchema);
