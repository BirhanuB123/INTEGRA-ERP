import { useState } from 'react';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import PayrollImportModal from './PayrollImportModal';

export default function Payroll() {
    const translate = useLanguage();
    const navigate = useNavigate();
    const [importModalOpen, setImportModalOpen] = useState(false);
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
        handleRead: (record) => navigate(`/payroll/read/${record._id}`),
        customHeaderButtons: [
            <Button
                key="import-payroll"
                icon={<UploadOutlined />}
                onClick={() => setImportModalOpen(true)}
            >
                {translate('import_from_sheet')}
            </Button>,
        ],
    };
    return (
        <>
            <CrudModule
                createForm={<DynamicForm fields={fields} />}
                updateForm={<DynamicForm fields={fields} />}
                config={config}
            />
            <PayrollImportModal
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onSuccess={() => setImportModalOpen(false)}
            />
        </>
    );
}
