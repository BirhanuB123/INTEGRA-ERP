import { Col, Spin } from 'antd';
import { Link } from 'react-router-dom';

/**
 * Simple stat card with optional link - for HR/Employee dashboards (non-currency stats).
 * iconVariant: 'blue' | 'yellow' | 'green' | 'orange' for image-style cards.
 */
export default function StatCard({
  title,
  value,
  prefix,
  icon: Icon,
  linkTo,
  isLoading = false,
  iconVariant = 'blue',
  trend,
  trendUp = true,
}) {
  const variantClass =
    ['blue', 'yellow', 'green', 'orange'].includes(iconVariant) ? `erp-icon-${iconVariant}` : 'erp-icon-blue';
  const content = (
    <div className="whiteBox shadow premium-card summary-card-wrapper" style={{ height: '100%' }}>
      <div className="summary-card-content">
        <div className="summary-info summary-info-left">
          {prefix && <div className="summary-card-prefix">{prefix}</div>}
          <h3 className="summary-card-title">{title}</h3>
          {isLoading ? (
            <Spin size="small" />
          ) : (
            <>
              <div className="summary-value summary-card-value">{value ?? '—'}</div>
              {trend != null && (
                <div className={`summary-card-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>
              )}
            </>
          )}
        </div>
        {Icon && (
          <div className={`summary-icon-container ${variantClass}`}>
            <Icon style={{ fontSize: 26 }} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }}>
      {linkTo ? (
        <Link to={linkTo} style={{ display: 'block', height: '100%' }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </Col>
  );
}
