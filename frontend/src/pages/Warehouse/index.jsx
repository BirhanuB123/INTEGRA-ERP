import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Warehouse() {
    const translate = useLanguage();
    const entity = 'warehouse';
    const searchConfig = {
        displayLabels: ['name'],
        searchFields: 'name',
    };
    const deleteModalLabels = ['name'];

    const Labels = {
        PANEL_TITLE: translate('warehouse'),
        DATATABLE_TITLE: translate('warehouse_list'),
        ADD_NEW_ENTITY: translate('add_new_warehouse'),
        ENTITY_NAME: translate('warehouse'),
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
