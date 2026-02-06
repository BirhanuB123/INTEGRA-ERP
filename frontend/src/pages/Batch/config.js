export const fields = {
    batchNumber: {
        type: 'string',
        required: true,
    },
    product: {
        type: 'selectAsync',
        label: 'Product',
        entity: 'product',
        displayLabels: ['name'],
        outputValue: '_id',
        required: true,
    },
    quantity: {
        type: 'number',
        default: 0,
    },
    warehouse: {
        type: 'selectAsync',
        label: 'Warehouse',
        entity: 'warehouse',
        displayLabels: ['name'],
        outputValue: '_id',
    },
    manufacturingDate: {
        type: 'date',
    },
    expiryDate: {
        type: 'date',
    },
};
