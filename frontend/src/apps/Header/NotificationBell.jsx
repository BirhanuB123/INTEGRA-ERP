import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Dropdown, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { request } from '@/request';
import useLanguage from '@/locale/useLanguage';

const POLL_INTERVAL_MS = 60000;

export default function NotificationBell() {
  const translate = useLanguage();
  const [data, setData] = useState({ totalCount: 0, items: [] });
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await request.get({
        entity: 'approval',
        options: { endpoint: 'notifications' },
      });
      if (response?.success && response?.result) {
        setData({
          totalCount: response.result.totalCount ?? 0,
          items: response.result.items ?? [],
        });
      }
    } catch (_) {
      setData({ totalCount: 0, items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const dropdownContent = (
    <div className="notification-dropdown" style={{ minWidth: 260, maxWidth: 360 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: 14 }}>
        {translate('notifications') || 'Notifications'}
      </div>
      {loading ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Spin size="small" />
        </div>
      ) : data.items.length === 0 ? (
        <div style={{ padding: 24, color: '#999', textAlign: 'center', fontSize: 13 }}>
          {translate('no_notifications') || 'No new notifications'}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0', maxHeight: 320, overflowY: 'auto' }}>
          {data.items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.link}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
                className="notification-item"
              >
                <span style={{ fontSize: 13 }}>{item.label}</span>
                {item.count > 0 && (
                  <span style={{ fontSize: 12, color: '#1890ff', fontWeight: 600 }}>{item.count}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="header-notification-dropdown"
    >
      <span className="headerIcon" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
        <Badge count={data.totalCount} size="small" offset={[-2, 2]}>
          <BellOutlined style={{ fontSize: 20, color: '#555' }} />
        </Badge>
      </span>
    </Dropdown>
  );
}
