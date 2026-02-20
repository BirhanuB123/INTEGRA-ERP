export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'textarea',
    },
    parentCategory: {
        type: 'async',
        label: 'Parent Category',
        entity: 'productcategory',
        displayLabels: ['name'],
        outputValue: '_id',
        dataIndex: ['parentCategory', 'name'],
        allowEmptyOption: true,
        emptyOptionLabel: 'No parent (top-level category)',
        placeholder: 'No parent (top-level category)',
    },
    enabled: {
        type: 'boolean',
        default: true,
    },
};
