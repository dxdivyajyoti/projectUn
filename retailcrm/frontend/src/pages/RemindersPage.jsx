import { useState } from 'react';
import { useReminders, useCreateReminder, useCompleteReminder } from '../hooks/useReminders';
import { useCustomers } from '../hooks/useCustomers';
import { HiOutlineCheck, HiOutlinePlus, HiOutlineClock } from 'react-icons/hi';

export default function RemindersPage() {
  const { data: reminders, isLoading } = useReminders();
  const createMutation = useCreateReminder();
  const completeMutation = useCompleteReminder();
  const { data: customersData } = useCustomers(0, null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerId: '', note: '', dueDate: '' });

  const customers = customersData?.content || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      customerId: form.customerId,
      note: form.note,
      dueDate: new Date(form.dueDate).toISOString(),
    });
    setShowForm(false);
    setForm({ customerId: '', note: '', dueDate: '' });
  };

  const isOverdue = (dateStr) => new Date(dateStr) < new Date();
  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  if (isLoading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  const remindersList = reminders || [];

  return (
    <div className="animate-in">
      <div className="page-header-actions">
        <div className="page-header">
          <h1>Reminders</h1>
          <p>Stay on top of follow-ups and tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <HiOutlinePlus /> New Reminder
        </button>
      </div>

      {remindersList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {remindersList.map(r => (
            <div key={r.id} className="card" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              borderLeft: `4px solid ${isOverdue(r.dueDate) ? 'var(--danger)' : isToday(r.dueDate) ? 'var(--warning)' : 'var(--primary)'}`,
            }}>
              <button
                className="btn btn-icon btn-secondary"
                onClick={() => completeMutation.mutate(r.id)}
                title="Mark complete"
                style={{ 
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--accent)',
                  width: 36, 
                  height: 36
                }}
              >
                <HiOutlineCheck />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.customerName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {r.note || 'No note'}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                color: isOverdue(r.dueDate) ? 'var(--danger)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                fontWeight: isOverdue(r.dueDate) ? 600 : 400,
              }}>
                <HiOutlineClock />
                {isToday(r.dueDate) ? 'Today' : new Date(r.dueDate).toLocaleDateString()}
                {isOverdue(r.dueDate) && !isToday(r.dueDate) && ' (Overdue)'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No pending reminders</h3>
            <p>You're all caught up! Create a reminder to follow up with a customer.</p>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Reminder</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select
                  className="form-select"
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Note</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="What do you need to follow up on?"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
