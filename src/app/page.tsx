'use client';
import { useUser } from '@/contexts/user/UserContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  if (!user) {
    return router.push('/login');
  }
  if (user) {
    return router.push(`/${user.role}`);
  }
  return null;
}
