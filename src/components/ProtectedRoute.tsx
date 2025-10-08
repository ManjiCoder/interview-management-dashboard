'use client';

import { UserRole } from '@/utils/roles';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type ProtectedRouteProps = {
  children: ReactNode;
  role: UserRole;
};

export default function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // Wait until sessionStorage is available
    const timer = setTimeout(() => {
      const sessionUser = sessionStorage.getItem('user');
      console.log({ sessionUser });

      if (!sessionUser) {
        toast.error('Please login first');
        router.replace('/login');
        return;
      }

      try {
        const user = JSON.parse(sessionUser);
        if (user.role === role || user.role === 'admin') {
          setAllowed(true);
        } else {
          toast.error('Access denied');
          router.replace('/login');
        }
      } catch {
        toast.error('Invalid session');
        router.replace('/login');
      } finally {
        setReady(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router, role]);

  // Don't render anything until ready
  if (!ready) return null;

  return allowed ? <>{children}</> : null;
}
