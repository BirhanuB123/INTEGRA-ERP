import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import useLanguage from '@/locale/useLanguage';

export const fields = {
    name: {
        required: true,
    },
    code: {
        required: true,
    },
    type: {
        type: 'select',
        options: [
            { value: 'Asset', label: 'Asset' },
            { value: 'Liability', label: 'Liability' },
            { value: 'Equity', label: 'Equity' },
            { value: 'Revenue', label: 'Revenue' },
            { value: 'Expense', label: 'Expense' },
        ],
        required: true,
    },
    description: {
        type: 'textarea',
    },
};

export default function Account() {
    const translate = useLanguage();
    const entity = 'account';
    const searchConfig = {
        displayLabels: ['name', 'code'],
        searchFields: 'name,code',
    };
    const deleteModalLabels = ['name'];

    const Labels = {
        PANEL_TITLE: translate('chart_of_accounts'),
        DATATABLE_TITLE: translate('account_list'),
        ADD_NEW_ENTITY: translate('add_new_account'),
        ENTITY_NAME: translate('chart_of_accounts'),
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
