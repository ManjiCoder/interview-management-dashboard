export const dynamic = 'force-dynamic';

import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <ProtectedRoute role='admin'>
      <Dashboard />
    </ProtectedRoute>
  );
}
