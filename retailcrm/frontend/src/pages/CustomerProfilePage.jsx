import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService, interactionService } from '../services/api';
import { useUpdateCustomer } from '../hooks/useCustomers';
import { HiOutlineArrowLeft, HiOutlinePhone, HiOutlineMail, HiOutlineCalendar, HiOutlineCash, HiOutlinePlus } from 'react-icons/hi';

const INTERACTION_ICONS = {
  PURCHASE: '🛍️',
  VISIT: '👋',
  CALL: '📞',
  NOTE: '📝',
};

export default function CustomerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showInteraction, setShowInteraction] = useState(false);
  const [editing, setEditing] = useState(false);
  const [interactionForm, setInteractionForm] = useState({ type: 'NOTE', note: '', amount: '' });

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.get(id).then(r => r.data),
  });

  const { data: interactions } = useQuery({
    queryKey: ['interactions', id],
    queryFn: () => interactionService.list(id, 0).then(r => r.data),
  });

  const createInteraction = useMutation({
    mutationFn: (data) => interactionService.create(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['interactions', id] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      setShowInteraction(false);
      setInteractionForm({ type: 'NOTE', note: '', amount: '' });
    },
  });

  const updateMutation = useUpdateCustomer();

  const [editForm, setEditForm] = useState({});

  if (isLoading) {
    return <div className="loading-spinner"><div className="spinner" /></div>;
  }

  if (!customer) {
    return <div className="empty-state"><h3>Customer not found</h3></div>;
  }

  const startEditing = () => {
    setEditForm({
      fullName: customer.fullName,
      phone: customer.phone || '',
      email: customer.email || '',
      tag: customer.tag,
      notes: customer.notes || '',
    });
    setEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateMutation.mutateAsync({ id, data: editForm });
    setEditing(false);
  };

  const handleInteractionSubmit = (e) => {
    e.preventDefault();
    createInteraction.mutate({
      type: interactionForm.type,
      note: interactionForm.note,
      amount: interactionForm.amount ? Number(interactionForm.amount) : null,
    });
  };

  const avatarColors = ['#6366f1', '#06d6a0', '#f59e0b', '#ef4444', '#3b82f6'];
  const color = avatarColors[customer.fullName.charCodeAt(0) % avatarColors.length];
  const interactionList = interactions?.content || [];

  return (
    <div className="animate-in">
      {/* Back Button */}
      <button className="btn btn-ghost" onClick={() => navigate('/customers')} style={{ marginBottom: '16px' }}>
        <HiOutlineArrowLeft /> Back to Customers
      </button>

      {/* Profile Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="customer-avatar" style={{
            background: color, width: 64, height: 64, fontSize: '1.5rem', borderRadius: 'var(--radius-lg)'
          }}>
            {customer.fullName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{customer.fullName}</h2>
            <span className={`tag tag-${customer.tag?.toLowerCase()}`} style={{ marginTop: 4 }}>{customer.tag}</span>
          </div>
          <button className="btn btn-secondary" onClick={startEditing}>Edit</button>
        </div>

        <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
          {customer.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <HiOutlinePhone /> {customer.phone}
            </div>
          )}
          {customer.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <HiOutlineMail /> {customer.email}
            </div>
          )}
          {customer.birthday && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <HiOutlineCalendar /> {new Date(customer.birthday).toLocaleDateString()}
            </div>
          )}
        </div>

        {customer.notes && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {customer.notes}
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Interaction History</div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowInteraction(true)}>
            <HiOutlinePlus /> Log Interaction
          </button>
        </div>

        {interactionList.length > 0 ? (
          <div className="timeline">
            {interactionList.map(i => (
              <div key={i.id} className="timeline-item">
                <div className="timeline-dot">{INTERACTION_ICONS[i.type] || '📝'}</div>
                <div className="timeline-content">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {i.type}
                    {i.amount && (
                      <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>
                        <HiOutlineCash style={{ verticalAlign: 'middle' }} /> ₹{Number(i.amount).toLocaleString()}
                      </span>
                    )}
                  </h4>
                  {i.note && <p>{i.note}</p>}
                  <div className="timeline-meta">
                    {new Date(i.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No interactions yet</h3>
            <p>Log the first interaction with this customer</p>
          </div>
        )}
      </div>

      {/* Log Interaction Modal */}
      {showInteraction && (
        <div className="modal-overlay" onClick={() => setShowInteraction(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Interaction</h2>
              <button className="modal-close" onClick={() => setShowInteraction(false)}>×</button>
            </div>
            <form onSubmit={handleInteractionSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
                >
                  <option value="NOTE">Note</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="VISIT">Visit</option>
                  <option value="CALL">Call</option>
                </select>
              </div>
              {interactionForm.type === 'PURCHASE' && (
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    value={interactionForm.amount}
                    onChange={(e) => setInteractionForm({ ...interactionForm, amount: e.target.value })}
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Note</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Details about this interaction..."
                  value={interactionForm.note}
                  onChange={(e) => setInteractionForm({ ...interactionForm, note: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInteraction(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createInteraction.isPending}>
                  {createInteraction.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Customer</h2>
              <button className="modal-close" onClick={() => setEditing(false)}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tag</label>
                <select className="form-select" value={editForm.tag} onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}>
                  <option value="NEW">New</option>
                  <option value="VIP">VIP</option>
                  <option value="AT_RISK">At Risk</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows={3} value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
