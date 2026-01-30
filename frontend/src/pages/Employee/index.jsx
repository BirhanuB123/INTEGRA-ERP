import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Employee() {
    const translate = useLanguage();
    const entity = 'employee';
    const searchConfig = {
        displayLabels: ['name'],
        searchFields: 'name,email',
    };
    const deleteModalLabels = ['name'];

    const Labels = {
        PANEL_TITLE: translate('Employees'),
        DATATABLE_TITLE: translate('employee_list'),
        ADD_NEW_ENTITY: translate('add_new_employee'),
        ENTITY_NAME: translate('Employee'),
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
