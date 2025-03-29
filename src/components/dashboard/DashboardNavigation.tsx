
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, ChartBar, Wallet, Settings, Shield, 
  BadgeDollarSign, Brain, AreaChart, Zap 
} from 'lucide-react';

interface DashboardNavigationProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

const DashboardNavigation = ({ activePage, onChangePage }: DashboardNavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return activePage === path;
  };

  const navItems = [
    { path: "overview", label: "Overview", icon: <Home className="h-5 w-5" /> },
    { path: "market", label: "Market", icon: <ChartBar className="h-5 w-5" /> },
    { path: "trading", label: "Trading", icon: <AreaChart className="h-5 w-5" /> },
    { path: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" /> },
    { path: "risk", label: "Risk Mgmt", icon: <Shield className="h-5 w-5" /> },
    { path: "ai", label: "AI Tools", icon: <Brain className="h-5 w-5" /> },
    { path: "subscription", label: "Subscription", icon: <Zap className="h-5 w-5" /> },
    { path: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="flex items-center space-x-2 overflow-x-auto py-2 px-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path === "subscription" ? "/subscription" : `/dashboard/${item.path}`}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => item.path !== "subscription" && onChangePage(item.path)}
        >
          <span className={`mr-3 ${isActive(item.path) ? "text-primary" : ""}`}>
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default DashboardNavigation;
