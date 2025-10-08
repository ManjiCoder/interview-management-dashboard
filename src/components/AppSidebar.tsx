'use client';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUser } from '@/contexts/user/UserContext';
import { cn } from '@/lib/utils';
import {
  BarChart,
  FileText,
  LayoutDashboard,
  LogOut,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Role Management', href: '/admin/users', icon: Users },
  ],
  ta_member: [
    { name: 'Dashboard', href: '/ta_member', icon: LayoutDashboard },
    { name: 'Candidate Management', href: '/ta_member/candidate', icon: Users },
    { name: 'Reports', href: '/ta_member', icon: BarChart },
  ],
  panelist: [
    { name: 'Dashboard', href: '/panelist', icon: LayoutDashboard },
    { name: 'Candidate Management', href: '/panelist/candidate', icon: Users },
    { name: 'Submissions', href: '/panelist', icon: FileText },
  ],
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useUser();

  // 👇 Close sidebar only if mobile (screen < 1024px)
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      const trigger = document.querySelector(
        '[data-sidebar="trigger"]'
      ) as HTMLElement;
      if (trigger) trigger.click();
    }
  };

  const renderMenuItems = (items: typeof menuItems.admin) =>
    items.map((item) => (
      <SidebarMenuItem key={item.name}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  onClick={closeSidebarOnMobile} // 👈 close only on mobile
                  className={cn(
                    'flex items-center gap-2',
                    pathname === item.href && 'font-semibold text-primary'
                  )}
                >
                  <item.icon className='w-5 h-5' />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side='right'>{item.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href='/'
                className='text-lg font-bold'
                onClick={closeSidebarOnMobile}
              >
                IMD
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {user?.role === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(menuItems.admin)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {['ta_member', 'admin'].includes(user ? user.role : 'guest') && (
          <SidebarGroup>
            <SidebarGroupLabel>TA Member</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(menuItems.ta_member)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {['panelist', 'admin'].includes(user ? user.role : 'guest') && (
          <SidebarGroup>
            <SidebarGroupLabel>Panelist</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(menuItems.panelist)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <div className='p-4 mt-auto'>
          <Button
            variant='destructive'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => {
              closeSidebarOnMobile();
              logout();
            }}
          >
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
