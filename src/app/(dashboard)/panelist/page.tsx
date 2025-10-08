'use client';

import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PanelistDashboard() {
  return (
    <ProtectedRoute role='panelist'>
      <Dashboard />
    </ProtectedRoute>
  );
}
