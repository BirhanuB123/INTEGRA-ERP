import React from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

export default function ApprovalStatusBadge({ status, approvalStatus }) {
    // Use approvalStatus if available, otherwise fall back to status
    const currentStatus = approvalStatus || status;

    if (!currentStatus) return null;

    const statusConfig = {
        pending: {
            color: 'orange',
            icon: <ClockCircleOutlined />,
            text: 'Pending Approval',
        },
        approved: {
            color: 'green',
            icon: <CheckCircleOutlined />,
            text: 'Approved',
        },
        rejected: {
            color: 'red',
            icon: <CloseCircleOutlined />,
            text: 'Rejected',
        },
    };

    const config = statusConfig[currentStatus] || statusConfig.pending;

    return (
        <Tag icon={config.icon} color={config.color}>
            {config.text}
        </Tag>
    );
}
