'use client';

import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  // const handleLogout = () => {
  //   sessionStorage.removeItem('user');
  //   toast.info('Logged out');
  //   router.push('/login');
  // };

  return (
    <ProtectedRoute role='admin'>
      <Dashboard />
    </ProtectedRoute>
  );
}
