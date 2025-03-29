
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { NavBar } from '@/components/dashboard/NavBar';
import { BottomNavigation } from '@/components/dashboard/BottomNavigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto dashboard-overview" id="dashboard-overview">
          {children}
        </main>
      </div>
      <BottomNavigation currentTab={currentTab} />
    </div>
  );
};
