
import React from 'react';
import { 
  LayoutDashboard, ChartLine, Wallet, LucideIcon, 
  BarChart, Shield, Bot, Settings, Globe, Trophy 
} from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface DashboardNavigationProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

// Navigation Item Component
const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-secondary/50'
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  activePage,
  onChangePage,
}) => {
  // Navigation items configuration
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'market', label: 'Market', icon: Globe },
    { id: 'trading', label: 'Trading', icon: ChartLine },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'risk', label: 'Risk', icon: Shield },
    { id: 'ai', label: 'AI Tools', icon: Bot },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur px-4 py-2 border-b mb-4">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activePage === item.id}
            onClick={() => onChangePage(item.id)}
          />
        ))}
      </div>
    </div>
  );
};
