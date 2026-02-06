import { useState, useEffect } from 'react';
import { Tabs, Row, Col, Descriptions, Statistic, Tag, Divider, Timeline, Button, Modal, Form, Input } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import {
    EditOutlined,
    FilePdfOutlined,
    CloseCircleOutlined,
    MailOutlined,
    HistoryOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';

import DataTable from '@/modules/ErpPanelModule/DataTable';

export default function CustomerDetail({ config, selectedItem }) {
    const translate = useLanguage();
    const navigate = useNavigate();
    const { moneyFormatter } = useMoney();
    const { entity, ENTITY_NAME } = config;

    const [activeTab, setActiveTab] = useState('profile');

    const profileContent = (
        <Descriptions title={selectedItem.name} bordered>
            <Descriptions.Item label={translate('Type')}>
                <Tag color={selectedItem.type === 'lead' ? 'purple' : 'blue'}>
                    {translate(selectedItem.type)}
                </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={translate('Status')}>
                <Tag color={selectedItem.status === 'active' ? 'green' : 'red'}>
                    {translate(selectedItem.status)}
                </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={translate('Lead Stage')}>
                {translate(selectedItem.leadStage)}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Email')}>{selectedItem.email}</Descriptions.Item>
            <Descriptions.Item label={translate('Phone')}>{selectedItem.phone}</Descriptions.Item>
            <Descriptions.Item label={translate('Country')}>{selectedItem.country}</Descriptions.Item>
            <Descriptions.Item label={translate('Address')} span={3}>
                {selectedItem.address}
                <Button
                    type="link"
                    icon={<EnvironmentOutlined />}
                    onClick={() =>
                        window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                selectedItem.address
                            )}`,
                            '_blank'
                        )
                    }
                >
                    {translate('View on Map')}
                </Button>
            </Descriptions.Item>
            <Descriptions.Item label={translate('Credit Limit')}>
                {moneyFormatter({ amount: selectedItem.creditLimit })}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Credit Hold')}>
                {selectedItem.creditHold ? <Tag color="red">YES</Tag> : <Tag color="green">NO</Tag>}
            </Descriptions.Item>
        </Descriptions>
    );

    const timelineContent = (
        <div style={{ padding: '20px' }}>
            <Timeline
                mode="left"
                items={(selectedItem.notes || []).map((note) => ({
                    label: new Date(note.date).toLocaleDateString(),
                    children: (
                        <>
                            <strong>{note.title}</strong>
                            <p>{note.content}</p>
                        </>
                    ),
                }))}
            />
        </div>
    );

    const invoiceColumns = [
        { title: translate('Number'), dataIndex: 'number' },
        { title: translate('Date'), dataIndex: 'date' },
        { title: translate('Total'), dataIndex: 'total' },
        { title: translate('Status'), dataIndex: 'status' },
    ];

    const tabItems = [
        {
            key: 'profile',
            label: (
                <span>
                    <EditOutlined />
                    {translate('Profile')}
                </span>
            ),
            children: profileContent,
        },
        {
            key: 'invoices',
            label: translate('Invoices'),
            children: (
                <DataTable
                    config={{
                        entity: 'invoice',
                        dataTableColumns: invoiceColumns,
                        DATATABLE_TITLE: translate('Invoices'),
                        searchConfig: { entity: 'client' },
                    }}
                    initialOptions={{ filter: 'client', equal: selectedItem._id }}
                    extra={[]}
                />
            ),
        },
        {
            key: 'quotes',
            label: translate('Quotes'),
            children: (
                <DataTable
                    config={{
                        entity: 'quote',
                        dataTableColumns: invoiceColumns,
                        DATATABLE_TITLE: translate('Quotes'),
                        searchConfig: { entity: 'client' },
                    }}
                    initialOptions={{ filter: 'client', equal: selectedItem._id }}
                    extra={[]}
                />
            ),
        },
        {
            key: 'timeline',
            label: (
                <span>
                    <HistoryOutlined />
                    {translate('Activity Timeline')}
                </span>
            ),
            children: timelineContent,
        },
    ];

    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);

    return (
        <>
            <PageHeader
                onBack={() => navigate('/customer')}
                title={selectedItem.name}
                ghost={false}
                extra={[
                    <Button
                        key="email"
                        icon={<MailOutlined />}
                        onClick={() => setIsEmailModalVisible(true)}
                    >
                        {translate('Send Email')}
                    </Button>,
                    <Button
                        key="close"
                        icon={<CloseCircleOutlined />}
                        onClick={() => navigate('/customer')}
                    >
                        {translate('Close')}
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/customer/update/${selectedItem._id}`)}
                    >
                        {translate('Edit')}
                    </Button>,
                ]}
            />
            <Divider />
            <div style={{ padding: '0 24px' }}>
                <Tabs defaultActiveKey="profile" items={tabItems} />
            </div>

            <Modal
                title={`${translate('Send Email to')} ${selectedItem.name}`}
                open={isEmailModalVisible}
                onOk={() => {
                    setIsEmailModalVisible(false);
                    Modal.success({
                        title: translate('Success'),
                        content: translate('Email successfully sent!'),
                    });
                }}
                onCancel={() => setIsEmailModalVisible(false)}
            >
                <div style={{ padding: '20px 0' }}>
                    <Form layout="vertical">
                        <Form.Item label={translate('Subject')} initialValue={`Inquiry for ${selectedItem.name}`}>
                            <Input />
                        </Form.Item>
                        <Form.Item label={translate('Message')}>
                            <Input.TextArea rows={4} placeholder={translate('Type your message here...')} />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
