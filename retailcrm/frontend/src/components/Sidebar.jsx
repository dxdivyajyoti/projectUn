import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineUsers, HiOutlineBell, HiOutlineChartBar, HiOutlineLogout } from 'react-icons/hi';
import useAuthStore from '../stores/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/customers', icon: HiOutlineUsers, label: 'Customers' },
    { path: '/reminders', icon: HiOutlineBell, label: 'Reminders' },
    { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  ];

  const initials = user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">R</div>
        <div className="sidebar-brand-text">
          Retail<span>CRM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon"><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.storeName || 'My Store'}</div>
          <div className="sidebar-user-email">{user?.email}</div>
        </div>
        <button className="btn-ghost btn-icon" onClick={handleLogout} title="Logout">
          <HiOutlineLogout />
        </button>
      </div>
    </aside>
  );
}
