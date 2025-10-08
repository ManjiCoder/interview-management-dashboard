import AppSidebar from '@/components/AppSidebar';
import LogoutBtn from '@/components/LogoutBtn';
import ToggleMode from '@/components/ToggleTheme';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='p-4 flex flex-col w-full'>
        <nav>
          <div className='flex justify-between'>
            <SidebarTrigger />
            <div className='flex gap-5'>
              <ToggleMode />
              <LogoutBtn />
            </div>
          </div>
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
