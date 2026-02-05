export const fields = {
    name: {
        type: 'string',
        required: true,
    },
    surname: {
        type: 'string',
    },
    email: {
        type: 'email',
        required: true,
    },
    password: {
        type: 'password',
        renderAsTag: false,
        show: false, // Don't show in datatable
        tooltip: 'If left blank, default password will be admin123',
    },
    role: {
        type: 'select',
        required: true,
        options: [
            { value: 'admin', label: 'Regular Admin' },
            { value: 'hr_head', label: 'HR Head' },
            { value: 'finance_head', label: 'Finance Head' },
            { value: 'department_manager', label: 'Department Manager' },
            { value: 'employee', label: 'Employee' },
            { value: 'owner', label: 'Owner' },
        ],
    },
    department: {
        type: 'string',
    },
    enabled: {
        type: 'boolean',
        default: true,
    },
};
