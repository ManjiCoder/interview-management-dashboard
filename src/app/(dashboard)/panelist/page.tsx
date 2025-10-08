'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    toast.info('Logged out');
    router.push('/login');
  };

  return (
    <ProtectedRoute role='panelist'>
      <div className='p-6'>
        <Card className='w-full max-w-xl mx-auto'>
          <CardHeader>
            <CardTitle>Panelist Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Welcome, panelist!</p>
            <Button className='mt-4' onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
