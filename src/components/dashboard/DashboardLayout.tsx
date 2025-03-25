
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardNav } from './DashboardNav';
import { DashboardHeader } from './DashboardHeader';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex flex-col md:flex-row">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
