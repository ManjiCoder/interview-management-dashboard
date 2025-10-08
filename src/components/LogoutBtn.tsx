'use client';
import { useUser } from '@/contexts/user/UserContext';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

export default function LogoutBtn() {
  const { logout } = useUser();
  return (
    <Button
      variant='destructive'
      className='flex items-center justify-center gap-2'
      onClick={logout}
    >
      <LogOut className='w-4 h-4' />
      Logout
    </Button>
  );
}
