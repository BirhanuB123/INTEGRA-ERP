import { Row, Col, Spin, Tooltip } from 'antd';
import { useMoney } from '@/settings';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const CARD_ICONS = {
  invoice: { stroke: '#4f46e5', fill: 'url(#colorInvoice)', topBorder: '#4f46e5' }, // Indigo
  quote: { stroke: '#f59e0b', fill: 'url(#colorQuote)', topBorder: '#f59e0b' }, // Amber/Orange
  paid: { stroke: '#ef4444', fill: 'url(#colorPaid)', topBorder: '#ef4444' }, // Red/Rose
  unpaid: { stroke: '#a855f7', fill: 'url(#colorUnpaid)', topBorder: '#a855f7' }, // Purple
};

function getIconKey(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('invoice')) return 'invoice';
  if (t.includes('quote')) return 'quote';
  if (t.includes('paid') && !t.includes('un')) return 'paid';
  if (t.includes('unpaid') || t.includes('not paid')) return 'unpaid';
  return 'invoice';
}

export default function AnalyticSummaryCard({ title, tagColor, data, prefix, isLoading = false, trend, trendUp }) {
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const key = getIconKey(title);
  const theme = CARD_ICONS[key] || CARD_ICONS.invoice;

  // Mock data for the mini chart since actual historical data isn't provided here for the line chart yet
  const dummyData = [
    { uv: Math.random() * 100 }, { uv: Math.random() * 100 }, { uv: Math.random() * 100 },
    { uv: Math.random() * 100 }, { uv: Math.random() * 100 }, { uv: Math.random() * 100 },
    { uv: Math.random() * 100 }, { uv: Math.random() * 100 }, { uv: Math.random() * 100 },
    { uv: Math.random() * 100 }, { uv: Math.random() * 100 }, { uv: Math.random() * 100 },
    { uv: Math.random() * 100 }, { uv: Math.random() * 100 }, { uv: Math.random() * 100 }
  ];

  // Provide a default trend if not provided, just for the visual demonstration like the image
  const displayTrend = trend || (trendUp === undefined ? '+15.9%' : (trendUp ? '+10.1%' : '-5.1%'));
  const isTrendUp = trendUp !== undefined ? trendUp : displayTrend.startsWith('+');

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
      <div 
        className="whiteBox shadow premium-card summary-card-wrapper" 
        style={{ height: '100%', borderTop: `3px solid ${theme.topBorder}`, borderRadius: '12px' }}
      >
        <div className="summary-card-content" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px 20px 16px 20px', gap: '0' }}>
          
          <div className="summary-info summary-info-left" style={{ width: '100%' }}>
            <div className="summary-card-prefix" style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500', textTransform: 'capitalize', marginBottom: '8px' }}>
              {prefix} {title}
            </div>
            
            {isLoading ? (
              <Spin size="small" />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginBottom: '16px' }}>
                <Tooltip title={formattedValue}>
                  <div className="summary-value summary-card-value" style={{ fontSize: '1.45rem', fontWeight: '800', color: '#1e293b', direction: 'ltr', lineHeight: 1 }}>
                    {formattedValue}
                  </div>
                </Tooltip>
                
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: isTrendUp ? '#10b981' : '#f43f5e' }}>
                  {displayTrend}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '100%', height: '60px', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.stroke} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.stroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="uv" 
                  stroke={theme.stroke} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#color${key})`} 
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
        </div>
      </div>
    </Col>
  );
}
