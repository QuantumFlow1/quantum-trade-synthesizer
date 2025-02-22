
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import WalletManagement from "./WalletManagement";
import AutoTrading from "./AutoTrading";
import RiskManagement from "./RiskManagement";
import Alerts from "./Alerts";
import { DashboardSettings } from "./DashboardSettings";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

const translations = {
  nl: {
    welcome: "Welkom Commander",
    interface: "Quantum Trading Interface",
    signOut: "Uitloggen"
  },
  en: {
    welcome: "Welcome Commander",
    interface: "Quantum Trading Interface",
    signOut: "Sign Out"
  },
  ru: {
    welcome: "Добро пожаловать, Командир",
    interface: "Квантовый Торговый Интерфейс",
    signOut: "Выйти"
  },
  hy: {
    welcome: "Բարի գալուստ Հրամանատար",
    interface: "Քվանտային Առևտրային Ինտերֆեյս",
    signOut: "Դուրս գալ"
  }
};

const UserDashboard = () => {
  const { signOut, userProfile } = useAuth();
  const currentLanguage = localStorage.getItem('preferred_language') as keyof typeof translations || 'nl';

  const getText = (key: keyof (typeof translations)['nl']) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-[#1A1F2C]">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#1A1F2C] via-[#221F26]/95 to-[#1A1F2C]/90">
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-secondary/5 to-purple-500/10 rounded-lg" />
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                  {getText('welcome')}, {userProfile?.email}
                </h1>
                <p className="text-muted-foreground">{getText('interface')}</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
              <MarketOverview />
            </div>
            <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
              <TradingChart />
            </div>
          </div>

          <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
            <WalletManagement />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
              <AutoTrading />
            </div>
            <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
              <RiskManagement />
            </div>
          </div>

          <div className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/[0.07] hover:shadow-lg">
            <Alerts />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;
