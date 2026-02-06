import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import useLanguage from '@/locale/useLanguage';

export const fields = {
    employee: {
        type: 'select',
        entity: 'employee',
        displayLabels: ['name'],
        required: true,
    },
    type: {
        type: 'select',
        options: [
            { value: 'annual', label: 'Annual' },
            { value: 'sick', label: 'Sick' },
            { value: 'maternity', label: 'Maternity' },
            { value: 'paternity', label: 'Paternity' },
            { value: 'unpaid', label: 'Unpaid' },
        ],
        required: true,
    },
    startDate: {
        type: 'date',
        required: true,
    },
    endDate: {
        type: 'date',
        required: true,
    },
    status: {
        type: 'select',
        options: [
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
        ],
    },
    daysCount: {
        type: 'number',
        required: true,
    },
    reason: {
        type: 'textarea',
    },
};

export default function Leave() {
    const translate = useLanguage();
    const entity = 'leave';
    const searchConfig = {
        displayLabels: ['employee.name', 'type'],
        searchFields: 'employee.name,type',
    };
    const deleteModalLabels = ['employee.name'];

    const Labels = {
        PANEL_TITLE: translate('leave'),
        DATATABLE_TITLE: translate('leave_list'),
        ADD_NEW_ENTITY: translate('add_new_leave'),
        ENTITY_NAME: translate('leave'),
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
