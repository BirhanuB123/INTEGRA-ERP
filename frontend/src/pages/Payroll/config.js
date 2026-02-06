export const fields = {
    month: {
        type: 'select',
        label: 'Month',
        options: [
            { value: 1, label: 'January' },
            { value: 2, label: 'February' },
            { value: 3, label: 'March' },
            { value: 4, label: 'April' },
            { value: 5, label: 'May' },
            { value: 6, label: 'June' },
            { value: 7, label: 'July' },
            { value: 8, label: 'August' },
            { value: 9, label: 'September' },
            { value: 10, label: 'October' },
            { value: 11, label: 'November' },
            { value: 12, label: 'December' },
        ],
        required: true,
    },
    year: {
        type: 'number',
        required: true,
    },
    status: {
        type: 'select',
        label: 'Status',
        options: [
            { value: 'draft', label: 'Draft', color: 'default' },
            { value: 'processed', label: 'Processed', color: 'blue' },
            { value: 'paid', label: 'Paid', color: 'green' },
        ],
    },
};
