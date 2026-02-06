import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function GoodsReceivedNote() {
    const translate = useLanguage();
    const entity = 'goodsreceivednote';
    const searchConfig = {
        displayLabels: ['number'],
        searchFields: 'number',
    };
    const deleteModalLabels = ['number'];

    const Labels = {
        PANEL_TITLE: translate('goods_received_note'),
        DATATABLE_TITLE: translate('goods_received_note_list'),
        ADD_NEW_ENTITY: translate('add_new_grn'),
        ENTITY_NAME: translate('goods_received_note'),
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
