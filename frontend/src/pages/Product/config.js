export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    sku: {
        type: 'string',
        label: 'SKU',
        required: true,
    },
    barcode: {
        type: 'string',
        label: 'Barcode',
    },
    productCategory: {
        type: 'selectWithTranslation',
        label: 'Product Category',
        entity: 'productcategory',
        displayLabels: ['name'],
        outputValue: '_id',
    },
    uom: {
        type: 'select',
        label: 'Unit of Measure',
        options: [
            { value: 'unit', label: 'Unit' },
            { value: 'kg', label: 'Kg' },
            { value: 'g', label: 'Gram' },
            { value: 'l', label: 'Liter' },
            { value: 'ml', label: 'Milliliter' },
            { value: 'm', label: 'Meter' },
            { value: 'cm', label: 'Centimeter' },
            { value: 'box', label: 'Box' },
            { value: 'pack', label: 'Pack' },
        ],
    },
    price: {
        type: 'currency',
        required: true,
    },
    cost: {
        type: 'currency',
        required: true,
    },
    quantity: {
        type: 'number',
        required: true,
    },
    minStock: {
        type: 'number',
        label: 'Minimum Stock Level',
    },
    maxStock: {
        type: 'number',
        label: 'Maximum Stock Level',
    },
    description: {
        type: 'textarea',
    },
};
