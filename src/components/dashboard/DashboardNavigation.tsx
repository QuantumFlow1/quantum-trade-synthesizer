
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, LineChart, TrendingUp, 
  BarChart3, Wallet, Shield, Brain, 
  Settings, Trophy, BoxIcon
} from "lucide-react";

interface DashboardNavigationProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

export const DashboardNavigation = ({ activePage, onChangePage }: DashboardNavigationProps) => {
  const navigationItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "market", label: "Market", icon: <LineChart className="h-5 w-5" /> },
    { id: "trading", label: "Trading", icon: <TrendingUp className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" /> },
    { id: "risk", label: "Risk", icon: <Shield className="h-5 w-5" /> },
    { id: "ai", label: "AI Tools", icon: <Brain className="h-5 w-5" /> },
    { id: "visualization", label: "3D View", icon: <BoxIcon className="h-5 w-5" /> },
    { id: "gamification", label: "Gamification", icon: <Trophy className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="mb-6 px-4 overflow-x-auto">
      <div className="flex items-center space-x-1 pb-2 min-w-max">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activePage === item.id ? "default" : "ghost"}
            size="sm"
            className={`flex items-center gap-1 ${
              activePage === item.id ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => onChangePage(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
      <Separator />
    </div>
  );
};
