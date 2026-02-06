export const fields = {
    number: {
        type: 'number',
        required: true,
    },
    date: {
        type: 'date',
        required: true,
    },
    purchaseOrder: {
        type: 'selectAsync',
        label: 'Purchase Order',
        entity: 'purchaseorder',
        displayLabels: ['number'],
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
    status: {
        type: 'select',
        label: 'Status',
        options: [
            { value: 'pending', label: 'Pending', color: 'orange' },
            { value: 'completed', label: 'Completed', color: 'green' },
        ],
    },
};
