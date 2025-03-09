
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart2, 
  TrendingUp, 
  Settings, 
  Wallet,
  Bot,
  PieChart
} from "lucide-react";

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MenuItem = ({ to, icon, label }: MenuItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "hover:bg-muted hover:text-accent-foreground"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export function ShellMenu() {
  return (
    <div className="space-y-1 py-2">
      <MenuItem to="/" icon={<Home className="h-4 w-4" />} label="Home" />
      <MenuItem to="/market" icon={<BarChart2 className="h-4 w-4" />} label="Market" />
      <MenuItem to="/trading" icon={<TrendingUp className="h-4 w-4" />} label="Trading" />
      <MenuItem to="/wallet" icon={<Wallet className="h-4 w-4" />} label="Wallet" />
      <MenuItem to="/dashboard" icon={<PieChart className="h-4 w-4" />} label="Dashboard" />
      <MenuItem to="/stockbot" icon={<Bot className="h-4 w-4" />} label="StockBot" />
      <MenuItem to="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
    </div>
  );
}
