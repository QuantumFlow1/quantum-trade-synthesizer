
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, BarChart2, LineChart, BrainCircuit, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon, path: '/dashboard/overview' },
    { id: 'market', label: 'Market', icon: BarChart2, path: '/dashboard/market' },
    { id: 'trading', label: 'Trading', icon: LineChart, path: '/dashboard/trading' },
    { id: 'ai', label: 'AI Tools', icon: BrainCircuit, path: '/dashboard/ai' },
    { id: 'risk', label: 'Risk', icon: ShieldAlert, path: '/dashboard/risk' },
  ];

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => (
        <Button
          key={item.id}
          id={`${item.id}-tab`}
          variant={currentPath.includes(item.path) ? 'secondary' : 'ghost'}
          className="w-full justify-start py-2"
          onClick={() => navigate(item.path)}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </nav>
  );
};
