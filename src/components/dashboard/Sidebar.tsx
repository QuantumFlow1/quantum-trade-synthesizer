
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardNavigation } from './DashboardNavigation';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hidden md:flex w-64 flex-col border-r bg-background h-full">
      <div className="flex flex-col h-full py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Trading Dashboard</h2>
        </div>
        <div className="mt-4 flex-1">
          <DashboardNavigation />
        </div>
      </div>
    </div>
  );
};
