import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Spin } from 'antd';
import useLanguage from '@/locale/useLanguage';

const DEFAULT_COLORS = ['#0077b6', '#ffc107', '#28a745', '#fd7e14', '#00b4d8', '#64748b'];

/**
 * Donut chart for dashboard – shows breakdown with legend (e.g. Works Status, Work Category).
 * data: [{ name: 'Estimated', value: 55, color?: '#0077b6' }, ...]
 */
export default function DonutChart({ data = [], title, loading = false, colors = DEFAULT_COLORS }) {
  const translate = useLanguage();
  const chartData = data.map((item, i) => ({
    name: translate(item.name || item.tag || '') || (item.name || item.tag || '—'),
    value: Number(item.value) || 0,
    color: item.color || colors[i % colors.length],
  })).filter((d) => d.value > 0);

  if (loading) {
    return (
      <div className="dashboard-donut-card whiteBox shadow premium-card pad20" style={{ minHeight: 280 }}>
        <h3 className="dashboard-donut-title">{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
          <Spin />
        </div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="dashboard-donut-card whiteBox shadow premium-card pad20" style={{ minHeight: 280 }}>
        <h3 className="dashboard-donut-title">{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220, color: 'var(--text-muted)' }}>
          {translate('No data')}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-donut-card whiteBox shadow premium-card pad20">
      <h3 className="dashboard-donut-title">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, translate('Share')]} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(name) => <span style={{ color: 'var(--text-main)' }}>{name}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
