import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Modal,
    Input,
    message,
    Tabs,
    Badge,
    Card,
    Row,
    Col,
    Statistic,
    Grid,
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    FileDoneOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    UnorderedListOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

export default function ApprovalDashboard() {
    const screens = useBreakpoint();
    const gutter = screens.lg ? [20, 20] : screens.sm ? [16, 16] : [12, 12];
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
        <div className="dashboard-container approval-dashboard">
            <header className="dashboard-page-header">
                <h1 className="dashboard-title">Approval Dashboard</h1>
                <p className="dashboard-subtitle">
                    Review and manage pending approval requests
                </p>
            </header>

            <Row gutter={gutter} className="approval-stats-row">
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="approval-stat-card approval-stat-pending" hoverable>
                        <div className="approval-stat-content">
                            <div className="approval-stat-icon-wrap approval-stat-icon-pending">
                                <ClockCircleOutlined />
                            </div>
                            <Statistic
                                title="Pending Approvals"
                                value={summary.pending}
                                valueStyle={{ color: '#d97706', fontWeight: 700 }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="approval-stat-card approval-stat-approved" hoverable>
                        <div className="approval-stat-content">
                            <div className="approval-stat-icon-wrap approval-stat-icon-approved">
                                <CheckCircleFilled />
                            </div>
                            <Statistic
                                title="Approved"
                                value={summary.approved}
                                valueStyle={{ color: '#059669', fontWeight: 700 }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="approval-stat-card approval-stat-rejected" hoverable>
                        <div className="approval-stat-content">
                            <div className="approval-stat-icon-wrap approval-stat-icon-rejected">
                                <CloseCircleFilled />
                            </div>
                            <Statistic
                                title="Rejected"
                                value={summary.rejected}
                                valueStyle={{ color: '#dc2626', fontWeight: 700 }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <Card className="approval-stat-card approval-stat-total" hoverable>
                        <div className="approval-stat-content">
                            <div className="approval-stat-icon-wrap approval-stat-icon-total">
                                <UnorderedListOutlined />
                            </div>
                            <Statistic title="Total" value={summary.total} valueStyle={{ fontWeight: 700 }} />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card className="approval-table-card premium-card">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="approval-tabs"
                    size={screens.md ? 'large' : 'middle'}
                >
                    <TabPane
                        tab={
                            <span className="approval-tab-label">
                                <ClockCircleOutlined style={{ marginRight: 6 }} />
                                <Badge count={summary.pending} offset={[8, 0]} size="small">
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
                            className="approval-table"
                            scroll={{ x: 'max-content' }}
                        />
                    </TabPane>
                    <TabPane
                        tab={
                            <span className="approval-tab-label">
                                <FileDoneOutlined style={{ marginRight: 6 }} />
                                All Approvals
                            </span>
                        }
                        key="all"
                    >
                        <Table
                            columns={columns}
                            dataSource={approvals}
                            loading={loading}
                            rowKey="_id"
                            pagination={{ pageSize: 10 }}
                            className="approval-table"
                            scroll={{ x: 'max-content' }}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Request`}
                open={modalVisible}
                onOk={handleSubmitAction}
                onCancel={() => {
                    setModalVisible(false);
                    setComments('');
                }}
                okText={actionType === 'approve' ? 'Approve' : 'Reject'}
                okButtonProps={{ danger: actionType === 'reject' }}
                className="approval-action-modal"
            >
                {selectedApproval && (
                    <div className="approval-modal-body">
                        <div className="approval-modal-field">
                            <strong>Entity Type:</strong> {selectedApproval.entityType}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Approval Type:</strong> {getApprovalTypeTag(selectedApproval.approvalType)}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Requested By:</strong> {selectedApproval.requestedBy?.name}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Priority:</strong> {getPriorityTag(selectedApproval.priority)}
                        </div>
                        {selectedApproval.metadata && Object.keys(selectedApproval.metadata).length > 0 && (
                            <div className="approval-modal-field">
                                <strong>Details:</strong>
                                <pre className="approval-modal-pre">
                                    {JSON.stringify(selectedApproval.metadata, null, 2)}
                                </pre>
                            </div>
                        )}
                        <div className="approval-modal-field" style={{ marginTop: 16 }}>
                            <strong>Comments:</strong>
                            <TextArea
                                rows={4}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Add your comments here (optional)"
                                style={{ marginTop: 8 }}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
