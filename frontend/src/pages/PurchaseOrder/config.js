export const fields = {
    number: {
        type: 'number',
        required: true,
    },
    year: {
        type: 'number',
        required: true,
    },
    date: {
        type: 'date',
        required: true,
    },
    supplier: {
        type: 'selectAsync',
        label: 'Supplier',
        entity: 'client',
        displayLabels: ['name'],
        outputValue: '_id',
        required: true,
    },
    status: {
        type: 'select',
        label: 'Status',
        options: [
            { value: 'draft', label: 'Draft', color: 'default' },
            { value: 'pending', label: 'Pending', color: 'orange' },
            { value: 'sent', label: 'Sent', color: 'blue' },
            { value: 'received', label: 'Received', color: 'green' },
            { value: 'cancelled', label: 'Cancelled', color: 'red' },
        ],
    },
    notes: {
        type: 'textarea',
    },
};
