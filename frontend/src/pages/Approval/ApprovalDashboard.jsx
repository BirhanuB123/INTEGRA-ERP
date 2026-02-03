import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Modal, Input, message, Tabs, Badge, Card, Row, Col, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { request } from '@/request';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { TabPane } = Tabs;

export default function ApprovalDashboard() {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [comments, setComments] = useState('');
    const [actionType, setActionType] = useState('');
    const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchMyApprovals();
        fetchSummary();
    }, []);

    const fetchMyApprovals = async () => {
        setLoading(true);
        try {
            const response = await request.post({ entity: 'approval', options: { endpoint: 'myApprovals' } });
            if (response.success) {
                setApprovals(response.result || []);
            }
        } catch (error) {
            message.error('Failed to fetch approvals');
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await request.summary({ entity: 'approval' });
            if (response.success) {
                setSummary(response.result);
            }
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };

    const handleApprove = (record) => {
        setSelectedApproval(record);
        setActionType('approve');
        setModalVisible(true);
    };

    const handleReject = (record) => {
        setSelectedApproval(record);
        setActionType('reject');
        setModalVisible(true);
    };

    const handleSubmitAction = async () => {
        if (!selectedApproval) return;

        setLoading(true);
        try {
            const endpoint = actionType === 'approve' ? 'approve' : 'reject';
            const response = await request.post({
                entity: 'approval',
                id: selectedApproval._id,
                jsonData: { comments },
                options: { endpoint },
            });

            if (response.success) {
                message.success(`Request ${actionType}d successfully`);
                setModalVisible(false);
                setComments('');
                fetchMyApprovals();
                fetchSummary();
            } else {
                message.error(response.message || `Failed to ${actionType} request`);
            }
        } catch (error) {
            message.error(`Failed to ${actionType} request`);
        } finally {
            setLoading(false);
        }
    };

    const getApprovalTypeTag = (type) => {
        const typeMap = {
            hr_approval: { color: 'blue', text: 'HR Approval' },
            finance_approval: { color: 'green', text: 'Finance Approval' },
            general_approval: { color: 'default', text: 'General Approval' },
        };
        const config = typeMap[type] || typeMap.general_approval;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const getStatusTag = (status) => {
        const statusMap = {
            pending: { color: 'orange', text: 'Pending' },
            approved: { color: 'green', text: 'Approved' },
            rejected: { color: 'red', text: 'Rejected' },
        };
        const config = statusMap[status] || statusMap.pending;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const getPriorityTag = (priority) => {
        const priorityMap = {
            low: { color: 'default', text: 'Low' },
            medium: { color: 'blue', text: 'Medium' },
            high: { color: 'orange', text: 'High' },
            urgent: { color: 'red', text: 'Urgent' },
        };
        const config = priorityMap[priority] || priorityMap.medium;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'Entity Type',
            dataIndex: 'entityType',
            key: 'entityType',
            render: (text) => <Tag>{text}</Tag>,
        },
        {
            title: 'Approval Type',
            dataIndex: 'approvalType',
            key: 'approvalType',
            render: (type) => getApprovalTypeTag(type),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => getPriorityTag(priority),
        },
        {
            title: 'Requested By',
            dataIndex: ['requestedBy', 'name'],
            key: 'requestedBy',
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
            render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => handleApprove(record)}
                                size="small"
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => handleReject(record)}
                                size="small"
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    <Button icon={<EyeOutlined />} size="small">
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <h1>Approval Dashboard</h1>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={summary.pending}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Approved"
                            value={summary.approved}
                            prefix={<CheckOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Rejected"
                            value={summary.rejected}
                            prefix={<CloseOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total" value={summary.total} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane
                        tab={
                            <span>
                                <Badge count={summary.pending} offset={[10, 0]}>
                                    Pending Approvals
                                </Badge>
                            </span>
                        }
                        key="pending"
                    >
                        <Table
                            columns={columns}
                            dataSource={approvals.filter((a) => a.status === 'pending')}
                            loading={loading}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                    <TabPane tab="All Approvals" key="all">
                        <Table
                            columns={columns}
                            dataSource={approvals}
                            loading={loading}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Request`}
                visible={modalVisible}
                onOk={handleSubmitAction}
                onCancel={() => {
                    setModalVisible(false);
                    setComments('');
                }}
                okText={actionType === 'approve' ? 'Approve' : 'Reject'}
                okButtonProps={{ danger: actionType === 'reject' }}
            >
                {selectedApproval && (
                    <div>
                        <p>
                            <strong>Entity Type:</strong> {selectedApproval.entityType}
                        </p>
                        <p>
                            <strong>Approval Type:</strong> {getApprovalTypeTag(selectedApproval.approvalType)}
                        </p>
                        <p>
                            <strong>Requested By:</strong> {selectedApproval.requestedBy?.name}
                        </p>
                        <p>
                            <strong>Priority:</strong> {getPriorityTag(selectedApproval.priority)}
                        </p>
                        {selectedApproval.metadata && Object.keys(selectedApproval.metadata).length > 0 && (
                            <div>
                                <strong>Details:</strong>
                                <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                                    {JSON.stringify(selectedApproval.metadata, null, 2)}
                                </pre>
                            </div>
                        )}
                        <div style={{ marginTop: '16px' }}>
                            <strong>Comments:</strong>
                            <TextArea
                                rows={4}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Add your comments here (optional)"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
