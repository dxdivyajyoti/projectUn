import { useDashboardSummary, useSegments } from '../hooks/useAnalytics';
import { useReminders } from '../hooks/useReminders';
import { HiOutlineUsers, HiOutlineUserAdd, HiOutlineCash, HiOutlineBell } from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TAG_COLORS = { NEW: '#3b82f6', VIP: '#f59e0b', AT_RISK: '#ef4444' };

export default function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary();
  const { data: segments } = useSegments();
  const { data: reminders } = useReminders();

  if (isLoading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  const upcomingReminders = (reminders || []).slice(0, 5);
  const pieData = (segments || []).filter(s => s.count > 0).map(s => ({
    name: s.tag,
    value: s.count,
    color: TAG_COLORS[s.tag] || '#6366f1',
  }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's how your store is doing</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': '#6366f1' }}>
          <div className="stat-icon"><HiOutlineUsers /></div>
          <div className="stat-value">{summary?.totalCustomers || 0}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#06d6a0' }}>
          <div className="stat-icon"><HiOutlineUserAdd /></div>
          <div className="stat-value">{summary?.newCustomersThisMonth || 0}</div>
          <div className="stat-label">New This Month</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
          <div className="stat-icon"><HiOutlineCash /></div>
          <div className="stat-value">₹{Number(summary?.revenueThisMonth || 0).toLocaleString()}</div>
          <div className="stat-label">Revenue This Month</div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#ef4444' }}>
          <div className="stat-icon"><HiOutlineBell /></div>
          <div className="stat-value">{summary?.pendingReminders || 0}</div>
          <div className="stat-label">Pending Reminders</div>
        </div>
      </div>

      {/* Charts + Reminders Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Segments Chart */}
        <div className="card">
          <div className="card-title">Customer Segments</div>
          {pieData.length > 0 ? (
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
                <Tooltip
                  contentStyle={{
                    background: '#1c1c2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                    fontSize: '0.85rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p>No customer data yet</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            {(segments || []).map(s => (
              <div key={s.tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: TAG_COLORS[s.tag] }} />
                <span style={{ color: '#94a3b8' }}>{s.tag} ({s.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="card">
          <div className="card-title">Upcoming Reminders</div>
          {upcomingReminders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingReminders.map(r => (
                <div key={r.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <HiOutlineBell style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{r.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.note}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(r.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No reminders</h3>
              <p>All caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
