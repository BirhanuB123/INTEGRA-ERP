import useLanguage from '@/locale/useLanguage';
import CustomerReadModule from '@/modules/CustomerModule/CustomerReadModule';

export default function CustomerRead() {
    const entity = 'client';
    const translate = useLanguage();
    const Labels = {
        PANEL_TITLE: translate('client'),
        DATATABLE_TITLE: translate('client_list'),
        ADD_NEW_ENTITY: translate('add_new_client'),
        ENTITY_NAME: translate('client'),
    };

    const configPage = {
        entity,
        ...Labels,
    };
    return <CustomerReadModule config={configPage} />;
}
