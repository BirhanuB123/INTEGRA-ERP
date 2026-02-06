import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import useLanguage from '@/locale/useLanguage';

export const fields = {
    name: {
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
    isClosed: {
        type: 'boolean',
        label: 'Is Closed?',
    },
};

export default function FiscalPeriod() {
    const translate = useLanguage();
    const entity = 'fiscalperiod';
    const searchConfig = {
        displayLabels: ['name'],
        searchFields: 'name',
    };
    const deleteModalLabels = ['name'];

    const Labels = {
        PANEL_TITLE: translate('fiscal_period'),
        DATATABLE_TITLE: translate('fiscal_period_list'),
        ADD_NEW_ENTITY: translate('add_new_fiscal_period'),
        ENTITY_NAME: translate('fiscal_period'),
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
