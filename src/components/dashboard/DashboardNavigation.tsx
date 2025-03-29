
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, ChartBar, Wallet, Settings, Shield, 
  BadgeDollarSign, Brain, AreaChart, Zap 
} from 'lucide-react';
import { OnboardingTooltip } from '@/components/ui/tooltip-custom';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface DashboardNavigationProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

const DashboardNavigation = ({ activePage, onChangePage }: DashboardNavigationProps) => {
  const location = useLocation();
  const { 
    steps, 
    currentStepIndex, 
    isOnboardingActive, 
    goToNextStep 
  } = useOnboarding();

  const isActive = (path: string) => {
    return activePage === path;
  };

  const navItems = [
    { path: "overview", label: "Overview", icon: <Home className="h-5 w-5" />, id: "dashboard-overview" },
    { path: "market", label: "Market", icon: <ChartBar className="h-5 w-5" />, id: "market-tab" },
    { path: "trading", label: "Trading", icon: <AreaChart className="h-5 w-5" />, id: "trading-tab" },
    { path: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" />, id: "wallet-tab" },
    { path: "risk", label: "Risk Mgmt", icon: <Shield className="h-5 w-5" />, id: "risk-tab" },
    { path: "ai", label: "AI Tools", icon: <Brain className="h-5 w-5" />, id: "ai-tab" },
    { path: "subscription", label: "Subscription", icon: <Zap className="h-5 w-5" />, id: "subscription-tab" },
    { path: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, id: "settings-tab" },
  ];

  const getTooltipForNavItem = (itemId: string) => {
    if (!isOnboardingActive) return null;
    
    const currentStep = steps[currentStepIndex];
    if (currentStep?.elementId === itemId) {
      return {
        title: currentStep.title,
        content: currentStep.content,
        position: currentStep.position,
        isOpen: true
      };
    }
    
    return null;
  };

  return (
    <nav className="flex items-center space-x-2 overflow-x-auto py-2 px-1">
      {navItems.map((item) => {
        const tooltip = getTooltipForNavItem(item.id);
        
        return (
          <OnboardingTooltip
            key={item.path}
            id={item.id}
            title={tooltip?.title || ""}
            content={tooltip?.content || ""}
            position={tooltip?.position as any || "bottom"}
            isOpen={tooltip?.isOpen}
            highlight={tooltip?.isOpen}
            showNext={tooltip?.isOpen}
            onNext={goToNextStep}
          >
            <Link
              to={item.path === "subscription" ? "/subscription" : `/dashboard/${item.path}`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => item.path !== "subscription" && onChangePage(item.path)}
              id={item.id}
            >
              <span className={`mr-3 ${isActive(item.path) ? "text-primary" : ""}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          </OnboardingTooltip>
        );
      })}
    </nav>
  );
};

export default DashboardNavigation;
