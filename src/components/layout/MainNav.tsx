
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BarChart, 
  Wallet, 
  Settings, 
  Users, 
  MessagesSquare,
  BrainCircuit,
  Activity,
  AreaChart,
  Database,
  Shield,
  Trophy
} from "lucide-react";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const [pathname, setPathname] = useState("/");
  const [showAllItems, setShowAllItems] = useState(false);

  const mainNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      primary: true,
    },
    {
      title: "Trading",
      href: "/trading",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      primary: true,
    },
    {
      title: "Markets",
      href: "/markets",
      icon: <Activity className="h-4 w-4 mr-2" />,
      primary: true,
    },
    {
      title: "Portfolio",
      href: "/portfolio",
      icon: <AreaChart className="h-4 w-4 mr-2" />,
      primary: true,
    },
    {
      title: "Wallet",
      href: "/wallet",
      icon: <Wallet className="h-4 w-4 mr-2" />,
      primary: false,
    },
    {
      title: "AI Assistant",
      href: "/ai-assistant",
      icon: <BrainCircuit className="h-4 w-4 mr-2" />,
      primary: true,
    },
    {
      title: "Trading Bots",
      href: "/bots",
      icon: <MessagesSquare className="h-4 w-4 mr-2" />,
      primary: false,
    },
    {
      title: "Data Monitoring",
      href: "/data-monitoring",
      icon: <Database className="h-4 w-4 mr-2" />,
      primary: true,
    },
    {
      title: "Risk Management",
      href: "/risk",
      icon: <Shield className="h-4 w-4 mr-2" />,
      primary: false,
    },
    {
      title: "Social Trading",
      href: "/social",
      icon: <Users className="h-4 w-4 mr-2" />,
      primary: false,
    },
    {
      title: "Gamification",
      href: "/gamification",
      icon: <Trophy className="h-4 w-4 mr-2" />,
      primary: false,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      primary: false,
    },
  ];

  // Decide which items to display based on showAllItems
  const displayedNavItems = showAllItems 
    ? mainNavItems 
    : mainNavItems.filter(item => item.primary);

  const handleNavClick = (href: string) => {
    setPathname(href);
    // In a real app, you would use a router to navigate
  };

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 overflow-x-auto", className)}>
      {displayedNavItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(item.href);
          }}
        >
          {item.icon}
          {item.title}
        </a>
      ))}
      
      {!showAllItems && mainNavItems.some(item => !item.primary) && (
        <button
          onClick={() => setShowAllItems(true)}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          More...
        </button>
      )}
      
      {showAllItems && (
        <button
          onClick={() => setShowAllItems(false)}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          Less
        </button>
      )}
    </nav>
  );
}
