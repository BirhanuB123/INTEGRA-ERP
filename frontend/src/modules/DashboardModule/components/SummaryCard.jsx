import { Col, Spin, Tooltip } from 'antd';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const CARD_ACCENT = {
  invoice: 'var(--primary-color)',
  quote: 'var(--erp-orange)',
  paid: 'var(--erp-green)',
  unpaid: 'var(--erp-danger)',
  income: 'var(--erp-green)',
  outcome: 'var(--erp-orange)',
  payroll: 'var(--primary-color)',
};

function getAccentKey(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('payroll')) return 'payroll';
  if (t.includes('income')) return 'income';
  if (t.includes('outcome')) return 'outcome';
  if (t.includes('invoice')) return 'invoice';
  if (t.includes('quote')) return 'quote';
  if (t.includes('paid') && !t.includes('un')) return 'paid';
  if (t.includes('unpaid') || t.includes('not paid')) return 'unpaid';
  return 'invoice';
}

export default function SummaryCard({ title, data, prefix, isLoading = false }) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const accent = CARD_ACCENT[getAccentKey(title)] || CARD_ACCENT.invoice;

  const formattedValue = data != null
    ? moneyFormatter({
        amount: data,
        currency_code: money_format_settings?.default_currency_code,
      })
    : moneyFormatter({
        amount: 0,
        currency_code: money_format_settings?.default_currency_code,
      });

  return (
    <Col
      className="gutter-row"
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 12 }}
      lg={{ span: 6 }}
    >
      <div
        className="dashboard-summary-card whiteBox shadow premium-card"
        style={{ borderTopColor: accent }}
      >
        <div className="dashboard-summary-card-inner">
          <span className="dashboard-summary-label">{prefix} · {title}</span>
          {isLoading ? (
            <Spin size="small" />
          ) : (
            <Tooltip title={formattedValue}>
              <span className="dashboard-summary-value">{formattedValue}</span>
            </Tooltip>
          )}
        </div>
      </div>
    </Col>
  );
}
