'use client';

import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TaDashboard() {
  return (
    <ProtectedRoute role='ta_member'>
      <Dashboard />
    </ProtectedRoute>
  );
}
