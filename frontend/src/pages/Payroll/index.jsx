import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';

export default function Payroll() {
    const translate = useLanguage();
    const navigate = useNavigate();
    const entity = 'payroll';
    const searchConfig = {
        displayLabels: ['month', 'year'],
        searchFields: 'month,year',
    };
    const deleteModalLabels = ['month', 'year'];

    const Labels = {
        PANEL_TITLE: translate('payroll'),
        DATATABLE_TITLE: translate('payroll_list'),
        ADD_NEW_ENTITY: translate('add_new_payroll'),
        ENTITY_NAME: translate('payroll'),
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
        // Open full payroll view (payslip table) instead of side panel
        handleRead: (record) => navigate(`/payroll/read/${record._id}`),
    };
    return (
        <CrudModule
            createForm={<DynamicForm fields={fields} />}
            updateForm={<DynamicForm fields={fields} />}
            config={config}
        />
    );
}
