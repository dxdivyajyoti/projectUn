import { useDashboardSummary, useSegments } from '../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TAG_COLORS = { NEW: '#3b82f6', VIP: '#f59e0b', AT_RISK: '#ef4444' };
const TAG_LABELS = { NEW: 'New Customers', VIP: 'VIP Customers', AT_RISK: 'At Risk' };

export default function AnalyticsPage() {
  const { data: summary, isLoading } = useDashboardSummary();
  const { data: segments } = useSegments();

  if (isLoading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  const barData = (segments || []).map(s => ({
    name: TAG_LABELS[s.tag] || s.tag,
    count: s.count,
    fill: TAG_COLORS[s.tag] || '#6366f1',
  }));

  const pieData = (segments || []).filter(s => s.count > 0).map(s => ({
    name: TAG_LABELS[s.tag] || s.tag,
    value: s.count,
    color: TAG_COLORS[s.tag],
  }));

  const tooltipStyle = {
    contentStyle: {
      background: '#1c1c2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: '#f1f5f9',
      fontSize: '0.85rem',
    },
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Insights into your customer base</p>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card" style={{ '--stat-color': '#6366f1' }}>
          <div className="stat-value">{summary?.totalCustomers || 0}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#06d6a0' }}>
          <div className="stat-value">{summary?.totalInteractionsThisMonth || 0}</div>
          <div className="stat-label">Interactions This Month</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
          <div className="stat-value">₹{Number(summary?.revenueThisMonth || 0).toLocaleString()}</div>
          <div className="stat-label">Revenue This Month</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Bar Chart */}
        <div className="card">
          <div className="card-title">Customer Segments</div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} barSize={40}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No data available</p></div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-title">Distribution</div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
                {pieData.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                    <span style={{ color: '#94a3b8' }}>{s.name} ({s.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state"><p>No data available</p></div>
          )}
        </div>
      </div>

      {/* Detailed Segments Table */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-title">Segment Breakdown</div>
        <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Segment</th>
                <th>Count</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {(segments || []).map(s => (
                <tr key={s.tag}>
                  <td>
                    <span className={`tag tag-${s.tag.toLowerCase()}`}>{s.tag}</span>
                  </td>
                  <td>{s.count}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {summary?.totalCustomers ? Math.round((s.count / summary.totalCustomers) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
