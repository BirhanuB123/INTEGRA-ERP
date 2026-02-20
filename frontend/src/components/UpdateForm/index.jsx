import { useEffect } from 'react';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectUpdatedItem } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

export default function UpdateForm({ config, formElements, withUpload = false }) {
  let { entity } = config;
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const { state, crudContextAction } = useCrudContext();

  /////

  const { panel, collapsedBox, readBox } = crudContextAction;

  const showCurrentRecord = () => {
    readBox.open();
  };

  /////
  const [form] = Form.useForm();

  const normalizeDatesForSubmit = (values) => {
    const out = { ...values };
    for (const key of Object.keys(out)) {
      const v = out[key];
      if (v != null && typeof v === 'object' && (dayjs.isDayjs(v) || v instanceof Date)) {
        out[key] = dayjs(v).toISOString?.() || dayjs(v).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      }
    }
    return out;
  };

  const onSubmit = (fieldsValue) => {
    const id = current._id;

    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }
    const jsonData = normalizeDatesForSubmit(fieldsValue);
    dispatch(crud.update({ entity, id, jsonData, withUpload }));
  };
  useEffect(() => {
    if (current) {
      let newValues = { ...current };
      const dateFields = [
        'birthday',
        'date',
        'expiredDate',
        'created',
        'updated',
        'checkIn',
        'checkOut',
        'startDate',
        'endDate',
      ];
      for (const key of dateFields) {
        if (newValues[key]) {
          newValues[key] = dayjs(newValues[key]).isValid()
            ? dayjs(newValues[key])
            : newValues[key];
        }
      }
      form.resetFields();
      form.setFieldsValue(newValues);
    }
  }, [current]);

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'update' }));
      dispatch(crud.list({ entity }));
    }
  }, [isSuccess]);

  const { isEditBoxOpen } = state;

  const show = isEditBoxOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return (
    <div style={show}>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {formElements}
          <Form.Item
            style={{
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            <Button type="primary" htmlType="submit">
              {translate('Save')}
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
            <Button onClick={showCurrentRecord}>{translate('Cancel')}</Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
