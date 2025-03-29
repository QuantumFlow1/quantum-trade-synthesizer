
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, ChartBar, Wallet, Settings, Shield, 
  BadgeDollarSign, Brain, AreaChart, Zap 
} from 'lucide-react';

const DashboardNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath.includes(path);
  };

  const navItems = [
    { path: "/dashboard/overview", label: "Overview", icon: <Home className="h-5 w-5" /> },
    { path: "/dashboard/market", label: "Market", icon: <ChartBar className="h-5 w-5" /> },
    { path: "/dashboard/trading", label: "Trading", icon: <AreaChart className="h-5 w-5" /> },
    { path: "/dashboard/wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" /> },
    { path: "/dashboard/risk", label: "Risk Mgmt", icon: <Shield className="h-5 w-5" /> },
    { path: "/dashboard/ai", label: "AI Tools", icon: <Brain className="h-5 w-5" /> },
    { path: "/subscription", label: "Subscription", icon: <Zap className="h-5 w-5" /> },
    { path: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          }`}
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
