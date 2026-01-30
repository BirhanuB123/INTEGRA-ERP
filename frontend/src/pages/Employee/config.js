export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'email',
        required: true,
    },
    phone: {
        type: 'phone',
    },
    position: {
        type: 'string',
    },
    department: {
        type: 'string',
    },
    salary: {
        type: 'number',
    },
    address: {
        type: 'string',
    },
    gender: {
        type: 'select',
        options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
        ],
    },
    birthday: {
        type: 'date',
    },
    joinDate: {
        type: 'date',
    },
};
