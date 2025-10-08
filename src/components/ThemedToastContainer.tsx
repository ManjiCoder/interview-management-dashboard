'use client';
import { useTheme } from 'next-themes';
import { ToastContainer } from 'react-toastify';

export default function ThemedToastContainer() {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position='top-right'
      autoClose={3000}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}
