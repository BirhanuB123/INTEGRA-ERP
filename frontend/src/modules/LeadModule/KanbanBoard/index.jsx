import { useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Spin, Space, Tooltip, Empty } from 'antd';
import {
    ArrowRightOutlined,
    CheckCircleOutlined,
    UserAddOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems, selectUpdatedItem } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';

const STAGES = [
    { value: 'new', label: 'new', color: '#1890ff' },
    { value: 'contacted', label: 'contacted', color: '#722ed1' },
    { value: 'proposal', label: 'proposal', color: '#faad14' },
    { value: 'won', label: 'won', color: '#52c41a' },
    { value: 'lost', label: 'lost', color: '#f5222d' },
];

export default function KanbanBoard() {
    const translate = useLanguage();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { result: listResult, isLoading } = useSelector(selectListItems);
    const { items: leads = [] } = listResult;
    const { isSuccess: updateSuccess } = useSelector(selectUpdatedItem);

    const fetchLeads = () => {
        dispatch(crud.list({ entity: 'client', options: { filter: 'type', equal: 'lead' } }));
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        if (updateSuccess) {
            fetchLeads();
        }
    }, [updateSuccess]);

    const moveStage = (id, newStage) => {
        dispatch(crud.update({ entity: 'client', id, jsonData: { leadStage: newStage } }));
    };

    const convertToCustomer = (id) => {
        dispatch(crud.update({ entity: 'client', id, jsonData: { type: 'customer' } }));
    };

    const renderCard = (lead) => {
        const currentStageIndex = STAGES.findIndex((s) => s.value === lead.leadStage);
        const nextStage = STAGES[currentStageIndex + 1];

        return (
            <Card
                key={lead._id}
                size="small"
                style={{
                    marginBottom: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
                actions={[
                    <Tooltip title={translate('Show Detail')}>
                        <EyeOutlined onClick={() => navigate(`/customer/read/${lead._id}`)} />
                    </Tooltip>,
                    nextStage && (
                        <Tooltip title={`${translate('Move to')} ${translate(nextStage.label)}`}>
                            <ArrowRightOutlined onClick={() => moveStage(lead._id, nextStage.value)} />
                        </Tooltip>
                    ),
                    lead.leadStage === 'won' && (
                        <Tooltip title={translate('Convert to Customer')}>
                            <UserAddOutlined
                                style={{ color: '#52c41a' }}
                                onClick={() => convertToCustomer(lead._id)}
                            />
                        </Tooltip>
                    ),
                ].filter(Boolean)}
            >
                <Card.Meta
                    title={<span style={{ fontSize: '14px' }}>{lead.name}</span>}
                    description={
                        <div style={{ fontSize: '12px' }}>
                            <p style={{ marginBottom: '4px' }}>{lead.email}</p>
                            <p style={{ marginBottom: '0' }}>{lead.phone}</p>
                        </div>
                    }
                />
            </Card>
        );
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{translate('Lead Pipeline')}</h1>
                <Button type="primary" onClick={() => navigate('/customer')}>
                    {translate('Manage All Clients')}
                </Button>
            </div>

            {isLoading && leads.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={16} style={{ flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '16px' }}>
                    {STAGES.map((stage) => {
                        const stageLeads = leads.filter((l) => l.leadStage === stage.value);
                        return (
                            <Col key={stage.value} style={{ width: '300px', flex: '0 0 300px' }}>
                                <div
                                    style={{
                                        backgroundColor: '#ebedf0',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        minHeight: '500px',
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '8px 12px',
                                            marginBottom: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <h3 style={{ margin: 0, fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {translate(stage.label)}
                                        </h3>
                                        <Tag color={stage.color} style={{ borderRadius: '10px' }}>
                                            {stageLeads.length}
                                        </Tag>
                                    </div>
                                    <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        {stageLeads.length > 0 ? (
                                            stageLeads.map(renderCard)
                                        ) : (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
                                        )}
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
}
