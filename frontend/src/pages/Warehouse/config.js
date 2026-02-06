export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    location: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'textarea',
    },
    enabled: {
        type: 'boolean',
        default: true,
    },
};
