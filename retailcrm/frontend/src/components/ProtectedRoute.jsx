import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Sidebar from './Sidebar';

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
