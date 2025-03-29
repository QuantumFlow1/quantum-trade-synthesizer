
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, BarChart2, TrendingUp, Zap, Shield } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const DashboardNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').slice(0, 3).join('/');
  
  const tabs: Tab[] = [
    {
      id: "overview",
      label: "Overview",
      path: "/dashboard/overview",
      icon: <Home className="h-4 w-4" />
    },
    {
      id: "market",
      label: "Market",
      path: "/dashboard/market",
      icon: <BarChart2 className="h-4 w-4" />
    },
    {
      id: "trading",
      label: "Trading",
      path: "/dashboard/trading",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: "ai",
      label: "AI",
      path: "/dashboard/ai",
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: "risk",
      label: "Risk",
      path: "/dashboard/risk",
      icon: <Shield className="h-4 w-4" />
    }
  ];

  return (
    <Tabs value={currentPath} className="w-full">
      <TabsList className="grid grid-cols-5 h-12">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.path}
            asChild
            id={`${tab.id}-tab`}
            data-tab={tab.id}
          >
            <Link to={tab.path} className="flex flex-col items-center py-1">
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
