import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Batch() {
    const translate = useLanguage();
    const entity = 'batch';
    const searchConfig = {
        displayLabels: ['batchNumber'],
        searchFields: 'batchNumber',
    };
    const deleteModalLabels = ['batchNumber'];

    const Labels = {
        PANEL_TITLE: translate('batch'),
        DATATABLE_TITLE: translate('batch_list'),
        ADD_NEW_ENTITY: translate('add_new_batch'),
        ENTITY_NAME: translate('batch'),
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
