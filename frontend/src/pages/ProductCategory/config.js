export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'textarea',
    },
    parentCategory: {
        type: 'selectAsync',
        label: 'Parent Category',
        entity: 'productcategory',
        displayLabels: ['name'],
        outputValue: '_id',
    },
    enabled: {
        type: 'boolean',
        default: true,
    },
};
