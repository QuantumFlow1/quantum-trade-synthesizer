
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart2, TrendingUp, Zap, Shield } from 'lucide-react';

interface BottomNavigationProps {
  currentTab: string;
}

export const BottomNavigation = ({ currentTab }: BottomNavigationProps) => {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      path: "/dashboard/overview",
      icon: <Home className="h-5 w-5" />
    },
    {
      id: "market",
      label: "Market",
      path: "/dashboard/market",
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      id: "trading",
      label: "Trading",
      path: "/dashboard/trading",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: "ai",
      label: "AI",
      path: "/dashboard/ai",
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "risk",
      label: "Risk",
      path: "/dashboard/risk",
      icon: <Shield className="h-5 w-5" />
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-50">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-2 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              id={`${tab.id}-tab`}
              data-tab={tab.id}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
