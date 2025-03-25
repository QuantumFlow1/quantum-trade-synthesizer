
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Briefcase, LineChart, Settings } from 'lucide-react';

export const DashboardNav: React.FC = () => {
  const navItems = [
    { name: 'Market', href: '/dashboard/market', icon: BarChart3 },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'Trading', href: '/dashboard/trading', icon: LineChart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <nav className="md:w-64 bg-card border-r p-4 hidden md:block">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
