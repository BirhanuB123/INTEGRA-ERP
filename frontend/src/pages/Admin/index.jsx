import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Admin() {
    const translate = useLanguage();
    const entity = 'admin';
    const searchConfig = {
        displayLabels: ['name', 'surname'],
        searchFields: 'name,surname,email',
    };
    const deleteModalLabels = ['name', 'surname'];

    const Labels = {
        PANEL_TITLE: translate('Staff Management'),
        DATATABLE_TITLE: translate('staff_list'),
        ADD_NEW_ENTITY: translate('add_new_staff'),
        ENTITY_NAME: translate('Staff'),
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
