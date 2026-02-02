export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    // productCategory: {
    //     type: 'async',
    //     label: 'Product Category',
    //     displayLabels: ['productCategory', 'name'],
    //     outputValue: '_id',
    //     entity: 'productCategory',
    // },
    price: {
        type: 'number',
        required: true,
    },
    quantity: {
        type: 'number',
        required: true,
    },
    description: {
        type: 'textarea',
    },
};
