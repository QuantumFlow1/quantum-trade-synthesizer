
import { LogOut, Home, LineChart, Wallet, Bot, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import WalletManagement from "./WalletManagement";
import AutoTrading from "./AutoTrading";
import RiskManagement from "./RiskManagement";
import Alerts from "./Alerts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const translations = {
  nl: {
    welcome: "Welkom Commander",
    interface: "Quantum Trading Interface",
    signOut: "Uitloggen",
    marketOverview: "Marktoverzicht",
    tradingChart: "Handelsgrafieken",
    walletManagement: "Portefeuillebeheer",
    autoTrading: "Automatisch Handelen",
    riskManagement: "Risicobeheer",
    alerts: "Meldingen",
    dashboard: "Dashboard"
  },
  en: {
    welcome: "Welcome Commander",
    interface: "Quantum Trading Interface",
    signOut: "Sign Out",
    marketOverview: "Market Overview",
    tradingChart: "Trading Charts",
    walletManagement: "Wallet Management",
    autoTrading: "Auto Trading",
    riskManagement: "Risk Management",
    alerts: "Alerts",
    dashboard: "Dashboard"
  },
  ru: {
    welcome: "Добро пожаловать, Командир",
    interface: "Квантовый Торговый Интерфейс",
    signOut: "Выйти",
    marketOverview: "Обзор Рынка",
    tradingChart: "Торговые Графики",
    walletManagement: "Управление Кошельком",
    autoTrading: "Автоматическая Торговля",
    riskManagement: "Управление Рисками",
    alerts: "Оповещения",
    dashboard: "Панель управления"
  },
  hy: {
    welcome: "Բարի գալուստ Հրամանատար",
    interface: "Քվանտային Առևտրային Ինտերֆեյս",
    signOut: "Դուրս գալ",
    marketOverview: "Շուկայի ակնարկ",
    tradingChart: "Առևտրային գրաֆիկներ",
    walletManagement: "Դրամապանակի կառավարում",
    autoTrading: "Ավտոմատ առևտուր",
    riskManagement: "Ռիսկերի կառավարում",
    alerts: "Ծանուցումներ",
    dashboard: "Վահանակ"
  }
};

const UserDashboard = () => {
  const { signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const currentLanguage = localStorage.getItem('preferred_language') as keyof typeof translations || 'nl';
  const [activeView, setActiveView] = useState('market-overview');

  const getText = (key: keyof (typeof translations)['nl']) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  const menuItems = [
    { id: 'market-overview', icon: Home, label: getText('marketOverview') },
    { id: 'trading-chart', icon: LineChart, label: getText('tradingChart') },
    { id: 'wallet', icon: Wallet, label: getText('walletManagement') },
    { id: 'auto-trading', icon: Bot, label: getText('autoTrading') },
    { id: 'risk', icon: Shield, label: getText('riskManagement') },
    { id: 'alerts', icon: Bell, label: getText('alerts') },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'market-overview':
        return <MarketOverview />;
      case 'trading-chart':
        return <TradingChart />;
      case 'wallet':
        return <WalletManagement />;
      case 'auto-trading':
        return <AutoTrading />;
      case 'risk':
        return <RiskManagement />;
      case 'alerts':
        return <Alerts />;
      default:
        return <MarketOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#1A1F2C]/80 border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              QuantumFlow
            </h1>
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-3 hover:bg-white/10",
                    activeView === item.id && "bg-white/10"
                  )}
                  onClick={() => setActiveView(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          <Button 
            variant="outline" 
            onClick={signOut}
            className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {getText('signOut')}
          </Button>
        </div>
      </header>
        
      <main className="container mx-auto p-6 space-y-6">
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-secondary/5 to-purple-500/10 rounded-lg" />
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {getText('welcome')}, {userProfile?.email}
              </h1>
              <p className="text-muted-foreground">{getText('interface')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
