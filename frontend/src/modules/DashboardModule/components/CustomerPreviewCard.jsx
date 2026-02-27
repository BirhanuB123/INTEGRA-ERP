import { Statistic, Progress, Divider, Row, Spin, Grid } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TeamOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { useBreakpoint } = Grid;

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
}) {
  const translate = useLanguage();
  const screens = useBreakpoint();
  const progressSize = screens.lg ? 148 : screens.md ? 132 : screens.sm ? 120 : 100;
  return (
    <Row className="gutter-row">
      <div className="whiteBox shadow premium-card customer-preview-card-wrap">
        <div className="customer-card-header">
          <h3 className="customer-card-title">
            <TeamOutlined style={{ marginRight: 8, color: 'var(--primary-color)' }} />
            {translate('Customers')}
          </h3>
        </div>
        <div className="pad20 customer-card-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <Spin />
            </div>
          ) : (
            <>
              <div className="customer-stat">
                <Progress
                  type="dashboard"
                  percent={Math.min(newCustomer, 100)}
                  size={progressSize}
                  strokeColor={{ '0%': 'var(--primary-color)', '100%': 'var(--primary-color-light)' }}
                  trailColor="rgba(226, 232, 240, 0.8)"
                />
                <p className="customer-stat-label" style={{ marginTop: 12, marginBottom: 0 }}>
                  {translate('New Customer this Month')}
                </p>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <div className="customer-stat">
                <Statistic
                  title={translate('Active Customer')}
                  value={activeCustomer}
                  precision={2}
                  valueStyle={{
                    color: 'var(--primary-color)',
                    fontWeight: 800,
                    fontSize: '1.75rem',
                  }}
                  prefix={
                    activeCustomer > 0 ? (
                      <ArrowUpOutlined style={{ marginRight: 4 }} />
                    ) : activeCustomer < 0 ? (
                      <ArrowDownOutlined style={{ marginRight: 4 }} />
                    ) : null
                  }
                  suffix="%"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Row>
  );
}
