import { Row, Col, Spin, Tooltip } from 'antd';
import {
  FileTextOutlined,
  FormOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const CARD_ICONS = {
  invoice: { Icon: FileTextOutlined, color: 'var(--erp-blue)', bg: 'var(--erp-blue-bg)' },
  quote: { Icon: FormOutlined, color: 'var(--erp-yellow)', bg: 'var(--erp-yellow-bg)' },
  paid: { Icon: CheckCircleOutlined, color: 'var(--erp-green)', bg: 'var(--erp-green-bg)' },
  unpaid: { Icon: ExclamationCircleOutlined, color: 'var(--erp-orange)', bg: 'var(--erp-orange-bg)' },
};

function getIconKey(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('invoice')) return 'invoice';
  if (t.includes('quote')) return 'quote';
  if (t.includes('paid') && !t.includes('un')) return 'paid';
  if (t.includes('unpaid') || t.includes('not paid')) return 'unpaid';
  return 'invoice';
}

export default function AnalyticSummaryCard({ title, tagColor, data, prefix, isLoading = false }) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const key = getIconKey(title);
  const { Icon, color, bg } = CARD_ICONS[key] || CARD_ICONS.invoice;

  const formattedValue = data
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
      <div className="whiteBox shadow premium-card summary-card-wrapper" style={{ height: '100%' }}>
        <div className="summary-card-content">
          <div className="summary-info summary-info-left">
            <div className="summary-card-prefix">{prefix}</div>
            <h3 className="summary-card-title">{title}</h3>
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <Tooltip title={formattedValue}>
                <div className="summary-value summary-card-value" style={{ direction: 'ltr' }}>
                  {formattedValue}
                </div>
              </Tooltip>
            )}
          </div>
          <div
            className="summary-icon-container"
            style={{ background: bg, color }}
          >
            <Icon style={{ fontSize: 26 }} />
          </div>
        </div>
      </div>
    </Col>
  );
}
