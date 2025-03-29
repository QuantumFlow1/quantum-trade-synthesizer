
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, BarChart2, LineChart, BrainCircuit, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  currentTab: string;
}

export const BottomNavigation = ({ currentTab }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: HomeIcon, path: '/dashboard/overview' },
    { id: 'market', label: 'Market', icon: BarChart2, path: '/dashboard/market' },
    { id: 'trading', label: 'Trading', icon: LineChart, path: '/dashboard/trading' },
    { id: 'ai', label: 'AI Tools', icon: BrainCircuit, path: '/dashboard/ai' },
    { id: 'risk', label: 'Risk', icon: ShieldAlert, path: '/dashboard/risk' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <Button
            key={item.id}
            id={`${item.id}-tab`}
            variant="ghost"
            className={`flex flex-col items-center py-2 px-0 w-full rounded-none ${
              currentTab === item.id ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </nav>
    </div>
  );
};
