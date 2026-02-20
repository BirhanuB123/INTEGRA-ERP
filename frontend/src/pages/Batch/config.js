export const fields = {
    batchNumber: {
        type: 'string',
        label: 'Batch Number',
        required: true,
    },
    product: {
        type: 'async',
        label: 'Product',
        entity: 'product',
        displayLabels: ['name'],
        outputValue: '_id',
        dataIndex: ['product', 'name'],
        required: true,
    },
    quantity: {
        type: 'number',
        label: 'Quantity',
        default: 0,
    },
    warehouse: {
        type: 'async',
        label: 'Warehouse',
        entity: 'warehouse',
        displayLabels: ['name'],
        outputValue: '_id',
        dataIndex: ['warehouse', 'name'],
        allowEmptyOption: true,
        emptyOptionLabel: 'No warehouse',
        placeholder: 'No warehouse (optional)',
    },
    manufacturingDate: {
        type: 'date',
        label: 'Manufacturing Date',
    },
    expiryDate: {
        type: 'date',
        label: 'Expiry Date',
    },
};
