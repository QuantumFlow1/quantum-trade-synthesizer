
import { LogOut, Home, LineChart, Wallet, Bot, Shield, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import WalletManagement from "./WalletManagement";
import AutoTrading from "./AutoTrading";
import RiskManagement from "./RiskManagement";
import Alerts from "./Alerts";

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
    alerts: "Meldingen"
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
    alerts: "Alerts"
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
    alerts: "Оповещения"
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
    alerts: "Ծանուցումներ"
  }
};

const UserDashboard = () => {
  const { signOut, userProfile } = useAuth();
  const currentLanguage = localStorage.getItem('preferred_language') as keyof typeof translations || 'nl';

  const getText = (key: keyof (typeof translations)['nl']) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  const menuItems = [
    { icon: Home, label: getText('dashboard') },
    { icon: LineChart, label: getText('tradingChart') },
    { icon: Wallet, label: getText('walletManagement') },
    { icon: Bot, label: getText('autoTrading') },
    { icon: Shield, label: getText('riskManagement') },
    { icon: Bell, label: getText('alerts') },
  ];

  return (
    <div className="min-h-screen w-full bg-[#1A1F2C]">
      <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#1A1F2C]/80 border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              QuantumFlow
            </h1>
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="flex items-center gap-2 px-3 hover:bg-white/10"
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
      </div>
        
      <main className="p-6 space-y-6 bg-gradient-to-br from-[#1A1F2C] via-[#221F26]/95 to-[#1A1F2C]/90">
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
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

        <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{getText('marketOverview')}</h2>
          <MarketOverview />
        </div>

        <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{getText('autoTrading')}</h2>
          <AutoTrading />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{getText('tradingChart')}</h2>
            <div className="min-h-[600px]">
              <TradingChart />
            </div>
          </div>
          <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{getText('riskManagement')}</h2>
            <RiskManagement />
          </div>
        </div>

        <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{getText('walletManagement')}</h2>
          <WalletManagement />
        </div>

        <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{getText('alerts')}</h2>
          <Alerts />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
