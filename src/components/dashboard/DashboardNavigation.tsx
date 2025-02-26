
import { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  AlertCircle, 
  Settings, 
  BrainCircuit,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  value: string;
};

interface DashboardNavigationProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

export const DashboardNavigation = ({ activePage, onChangePage }: DashboardNavigationProps) => {
  const navItems: NavItem[] = [
    { name: "Overview", icon: <BarChart3 className="w-4 h-4" />, value: "overview" },
    { name: "Market", icon: <LineChart className="w-4 h-4" />, value: "market" },
    { name: "Trading", icon: <TrendingUp className="w-4 h-4" />, value: "trading" },
    { name: "Analytics", icon: <PieChart className="w-4 h-4" />, value: "analytics" },
    { name: "Wallet", icon: <Wallet className="w-4 h-4" />, value: "wallet" },
    { name: "Risk", icon: <AlertCircle className="w-4 h-4" />, value: "risk" },
    { name: "AI Tools", icon: <BrainCircuit className="w-4 h-4" />, value: "ai" },
    { name: "Settings", icon: <Settings className="w-4 h-4" />, value: "settings" },
  ];

  return (
    <div className="w-full backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-2 mb-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] overflow-hidden">
      <div className="flex items-center justify-start overflow-x-auto gap-1 scrollbar-hide no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.value}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md whitespace-nowrap transition-all duration-200",
              activePage === item.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onChangePage(item.value)}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
