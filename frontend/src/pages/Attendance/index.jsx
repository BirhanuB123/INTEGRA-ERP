import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import useLanguage from '@/locale/useLanguage';

export const fields = {
    employee: {
        type: 'async',
        entity: 'employee',
        displayLabels: ['name'],
        searchFields: 'name',
        dataIndex: ['employee', 'name'],
        outputValue: '_id',
        required: true,
        feedback: 'employee',
    },
    date: {
        type: 'date',
        required: true,
    },
    checkIn: {
        type: 'datetime',
    },
    checkOut: {
        type: 'datetime',
    },
    status: {
        type: 'select',
        options: [
            { value: 'present', label: 'Present' },
            { value: 'absent', label: 'Absent' },
            { value: 'late', label: 'Late' },
            { value: 'on_leave', label: 'On Leave' },
        ],
        required: true,
        default: 'present',
    },
    overtimeHours: {
        type: 'number',
        default: 0,
    },
};

export default function Attendance() {
    const translate = useLanguage();
    const entity = 'attendance';
    const searchConfig = {
        displayLabels: ['employee.name', 'date'],
        searchFields: 'employee.name,status',
    };
    const deleteModalLabels = ['employee.name'];

    const Labels = {
        PANEL_TITLE: translate('attendance'),
        DATATABLE_TITLE: translate('attendance_list'),
        ADD_NEW_ENTITY: translate('add_new_attendance'),
        ENTITY_NAME: translate('attendance'),
    };

    const configPage = {
        entity,
        ...Labels,
    };
    const config = {
        ...configPage,
        fields,
        searchConfig,
        deleteModalLabels,
    };
    return (
        <CrudModule
            createForm={<DynamicForm fields={fields} />}
            updateForm={<DynamicForm fields={fields} />}
            config={config}
        />
    );
}
