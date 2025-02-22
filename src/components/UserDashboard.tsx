
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

const UserDashboard = () => {
  const { signOut, userProfile } = useAuth();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-background/90">
          <div className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-lg" />
            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gradient">Welcome Commander, {userProfile?.email}</h1>
                <p className="text-muted-foreground">Quantum Trading Interface</p>
              </div>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6">
              <MarketOverview />
            </div>
            <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6">
              <TradingChart />
            </div>
          </div>

          <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6">
            <WalletManagement />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6">
              <AutoTrading />
            </div>
            <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6">
              <RiskManagement />
            </div>
          </div>

          <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6">
            <Alerts />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserDashboard;
