export const fields = {
    product: {
        type: 'selectAsync',
        label: 'Product',
        entity: 'product',
        displayLabels: ['name'],
        outputValue: '_id',
        required: true,
    },
    warehouse: {
        type: 'selectAsync',
        label: 'Warehouse',
        entity: 'warehouse',
        displayLabels: ['name'],
        outputValue: '_id',
        required: true,
    },
    type: {
        type: 'select',
        label: 'Movement Type',
        options: [
            { value: 'in', label: 'Stock In', color: 'green' },
            { value: 'out', label: 'Stock Out', color: 'red' },
            { value: 'transfer', label: 'Transfer', color: 'blue' },
            { value: 'adjustment', label: 'Adjustment', color: 'orange' },
        ],
        required: true,
    },
    quantity: {
        type: 'number',
        required: true,
    },
    reference: {
        type: 'string',
        label: 'Reference (e.g. PO#, INV#)',
    },
    description: {
        type: 'textarea',
    },
};
