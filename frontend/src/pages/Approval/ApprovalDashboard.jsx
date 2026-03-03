import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Modal,
    Input,
    InputNumber,
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
    const [approvedDaysCount, setApprovedDaysCount] = useState(null);
    const [leaveDetails, setLeaveDetails] = useState(null);
    const [actionType, setActionType] = useState('');
    const [summary, setSummary] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
    const [activeTab, setActiveTab] = useState('pending');
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [viewApproval, setViewApproval] = useState(null);

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
        setLeaveDetails(null);
        setApprovedDaysCount(null);
        setModalVisible(true);
    };

    const handleReject = (record) => {
        setSelectedApproval(record);
        setActionType('reject');
        setModalVisible(true);
    };

    const handleView = (record) => {
        setViewApproval(record);
        setViewModalVisible(true);
    };

    // Fetch leave details when approving a Leave request so HR can set approved days
    useEffect(() => {
        if (!modalVisible || !selectedApproval || selectedApproval.entityType !== 'Leave' || actionType !== 'approve') {
            return;
        }
        let cancelled = false;
        request
            .read({ entity: 'leave', id: selectedApproval.entityId })
            .then((res) => {
                if (!cancelled && res?.result) {
                    setLeaveDetails(res.result);
                    setApprovedDaysCount(res.result.daysCount);
                }
            })
            .catch(() => {
                if (!cancelled) setLeaveDetails(null);
            });
        return () => { cancelled = true; };
    }, [modalVisible, selectedApproval, actionType]);

    const handleSubmitAction = async () => {
        if (!selectedApproval) return;

        setLoading(true);
        try {
            const endpoint = actionType === 'approve' ? 'approve' : 'reject';
            const jsonData = { comments };
            if (actionType === 'approve' && selectedApproval.entityType === 'Leave' && approvedDaysCount != null) {
                jsonData.approvedDaysCount = approvedDaysCount;
            }
            const response = await request.post({
                entity: 'approval',
                id: selectedApproval._id,
                jsonData,
                options: { endpoint },
            });

            if (response.success) {
                message.success(`Request ${actionType}d successfully`);
                setModalVisible(false);
                setComments('');
                setApprovedDaysCount(null);
                setLeaveDetails(null);
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
            title: 'Requested (Leave)',
            key: 'entityDetails',
            render: (_, record) => {
                if (record.entityType !== 'Leave' || !record.entityDetails) return '—';
                const d = record.entityDetails;
                const days = d.daysCount != null ? `${d.daysCount} days` : '';
                const dates =
                    d.startDate && d.endDate
                        ? ` (${dayjs(d.startDate).format('YYYY-MM-DD')} – ${dayjs(d.endDate).format('YYYY-MM-DD')})`
                        : '';
                return days ? (
                    <span title={`${days}${dates}`}>
                        <strong>{d.daysCount}</strong> days{dates && <span style={{ color: '#666' }}>{dates}</span>}
                    </span>
                ) : '—';
            },
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
                    <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
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
                    setApprovedDaysCount(null);
                    setLeaveDetails(null);
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
                        {selectedApproval.entityType === 'Leave' && leaveDetails && actionType === 'approve' && (
                            <div className="approval-modal-field" style={{ marginTop: 12 }}>
                                <strong>Leave requested:</strong> {leaveDetails.daysCount} days
                                {leaveDetails.startDate && leaveDetails.endDate && (
                                    <span>
                                        {' '}
                                        ({dayjs(leaveDetails.startDate).format('YYYY-MM-DD')} –{' '}
                                        {dayjs(leaveDetails.endDate).format('YYYY-MM-DD')})
                                    </span>
                                )}
                                <div style={{ marginTop: 8 }}>
                                    <strong>Approve with days:</strong>
                                    <InputNumber
                                        min={1}
                                        max={leaveDetails.daysCount}
                                        value={approvedDaysCount}
                                        onChange={setApprovedDaysCount}
                                        style={{ marginLeft: 8, width: 80 }}
                                    />
                                    <span style={{ marginLeft: 8, color: '#666' }}>
                                        (e.g. approve 10 days instead of {leaveDetails.daysCount})
                                    </span>
                                </div>
                            </div>
                        )}
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

            <Modal
                title="View Request Details"
                open={viewModalVisible}
                onCancel={() => { setViewModalVisible(false); setViewApproval(null); }}
                footer={
                    viewApproval?.status === 'pending'
                        ? [
                            <Button key="reject" danger icon={<CloseOutlined />} onClick={() => { setViewModalVisible(false); handleReject(viewApproval); setViewApproval(null); }}>
                                Reject
                            </Button>,
                            <Button key="approve" type="primary" icon={<CheckOutlined />} onClick={() => { setViewModalVisible(false); handleApprove(viewApproval); setViewApproval(null); }}>
                                Approve
                            </Button>,
                        ]
                        : null
                }
                className="approval-view-modal"
            >
                {viewApproval && (
                    <div className="approval-modal-body">
                        <div className="approval-modal-field">
                            <strong>Entity Type:</strong> <Tag>{viewApproval.entityType}</Tag>
                        </div>
                        <div className="approval-modal-field">
                            <strong>Approval Type:</strong> {getApprovalTypeTag(viewApproval.approvalType)}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Requested By:</strong> {viewApproval.requestedBy?.name}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Priority:</strong> {getPriorityTag(viewApproval.priority)}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Status:</strong> {getStatusTag(viewApproval.status)}
                        </div>
                        <div className="approval-modal-field">
                            <strong>Created:</strong> {dayjs(viewApproval.created).format('YYYY-MM-DD HH:mm')}
                        </div>
                        {viewApproval.entityType === 'Leave' && viewApproval.entityDetails && (
                            <div className="approval-modal-field" style={{ marginTop: 12, padding: 12, background: '#fafafa', borderRadius: 8 }}>
                                <strong>Leave requested:</strong>
                                <div style={{ marginTop: 6 }}>
                                    <strong>{viewApproval.entityDetails.daysCount}</strong> days
                                    {viewApproval.entityDetails.startDate && viewApproval.entityDetails.endDate && (
                                        <span>
                                            {' '}
                                            ({dayjs(viewApproval.entityDetails.startDate).format('YYYY-MM-DD')} –{' '}
                                            {dayjs(viewApproval.entityDetails.endDate).format('YYYY-MM-DD')})
                                        </span>
                                    )}
                                    {viewApproval.entityDetails.type && (
                                        <span> · Type: {String(viewApproval.entityDetails.type)}</span>
                                    )}
                                </div>
                                {viewApproval.status === 'pending' && (
                                    <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                                        Use &quot;Approve&quot; to approve as-is or with fewer days (e.g. approve 5 days if 10 requested).
                                    </div>
                                )}
                            </div>
                        )}
                        {viewApproval.metadata && Object.keys(viewApproval.metadata).length > 0 && (
                            <div className="approval-modal-field">
                                <strong>Details:</strong>
                                <pre className="approval-modal-pre">{JSON.stringify(viewApproval.metadata, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
