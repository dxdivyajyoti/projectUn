import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { useCustomers, useDeleteCustomer, useCreateCustomer } from '../hooks/useCustomers';

const TAGS = ['', 'NEW', 'VIP', 'AT_RISK'];

export default function CustomersPage() {
  const [page, setPage] = useState(0);
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', tag: 'NEW', notes: '' });

  const { data, isLoading } = useCustomers(page, tag || null);
  const deleteMutation = useDeleteCustomer();
  const createMutation = useCreateCustomer();
  const navigate = useNavigate();

  const customers = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const filteredCustomers = search
    ? customers.filter(c =>
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search))
      )
    : customers;

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
      setShowForm(false);
      setForm({ fullName: '', phone: '', email: '', tag: 'NEW', notes: '' });
    } catch (err) {
      // handled by query
    }
  };

  const avatarColors = ['#6366f1', '#06d6a0', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
  const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="animate-in">
      <div className="page-header-actions">
        <div className="page-header">
          <h1>Customers</h1>
          <p>Manage your customer relationships</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <HiOutlinePlus /> Add Customer
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="search-bar">
          <HiOutlineSearch className="search-icon" />
          <input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {TAGS.map(t => (
            <button
              key={t}
              className={`btn btn-sm ${tag === t ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setTag(t); setPage(0); }}
            >
              {t || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : filteredCustomers.length > 0 ? (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Tag</th>
                  <th>Last Visit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/customers/${c.id}`)}>
                    <td>
                      <div className="customer-name">
                        <div className="customer-avatar" style={{ background: getColor(c.fullName) }}>
                          {c.fullName.charAt(0).toUpperCase()}
                        </div>
                        {c.fullName}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.phone || '–'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email || '–'}</td>
                    <td><span className={`tag tag-${c.tag?.toLowerCase()}`}>{c.tag}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {c.lastVisited ? new Date(c.lastVisited).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <button
                        className="btn-ghost btn-icon"
                        onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(c.id); }}
                        title="Delete"
                      >
                        <HiOutlineTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No customers yet</h3>
          <p>Add your first customer to get started</p>
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Customer</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  placeholder="Customer name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    placeholder="+91-XXXXXXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tag</label>
                <select
                  className="form-select"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                >
                  <option value="NEW">New</option>
                  <option value="VIP">VIP</option>
                  <option value="AT_RISK">At Risk</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Add notes about this customer..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
