import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Customer() {
  const translate = useLanguage();
  const entity = 'client';
  const navigate = useNavigate();
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

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
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    handleRead: (record) => {
      navigate(`/customer/read/${record._id}`);
    },
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
      extra={[
        {
          label: translate('Show'),
          key: 'read',
          icon: <EyeOutlined />,
        },
      ]}
    />
  );
}
