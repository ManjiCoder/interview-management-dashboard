'use client';

import { UserRoles } from '@/types/constant';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';

// Define the User type
type User = {
  username: string;
  role: string;
};

// Define the context value type
type UserContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  // Restore user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from sessionStorage:', e);
        sessionStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    toast.success(
      `Logged in as ${UserRoles[userData.role as keyof typeof UserRoles]}`
    );
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    toast.warn('Logged out successfully');
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
