import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function StockMovement() {
    const translate = useLanguage();
    const entity = 'stockmovement';
    const searchConfig = {
        displayLabels: ['reference'],
        searchFields: 'reference',
    };
    const deleteModalLabels = ['reference'];

    const Labels = {
        PANEL_TITLE: translate('stock_movement'),
        DATATABLE_TITLE: translate('stock_movement_ledger'),
        ADD_NEW_ENTITY: translate('record_movement'),
        ENTITY_NAME: translate('stock_movement'),
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
