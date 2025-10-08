import { ThemeProvider } from '@/components/ThemeProvider';
import ThemedToastContainer from '@/components/ThemedToastContainer';
import { UserProvider } from '@/contexts/user/UserContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import 'react-toastify/ReactToastify.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Interview Management Dashboard',
  description: 'A dashboard to manage and schedule interviews efficiently.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>{children}</UserProvider>
          <ThemedToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
