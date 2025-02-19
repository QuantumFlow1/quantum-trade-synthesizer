
import { LogOut, Activity, LineChart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import MarketOverview from "./MarketOverview";
import TradingChart from "./TradingChart";
import TradeControls from "./TradeControls";
import TransactionList from "./TransactionList";
import PerformanceMetrics from "./PerformanceMetrics";
import AutoTrading from "./AutoTrading";
import RiskManagement from "./RiskManagement";
import Alerts from "./Alerts";
import FinancialAdvice from "./FinancialAdvice";

const UserDashboard = () => {
  const { signOut, userProfile } = useAuth();
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Actie uitgevoerd",
      description: `${action} is succesvol uitgevoerd`,
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-background via-background/95 to-background/90 animate-in fade-in duration-1000">
      {/* Command Center Header */}
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

      {/* Main Command Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <MarketOverview />
        </div>
        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <PerformanceMetrics />
        </div>
      </div>

      {/* Trading Interface */}
      <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="space-y-6">
          <TradingChart />
          <TradeControls />
        </div>
      </div>

      {/* Trading Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <AutoTrading />
        </div>
        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <RiskManagement />
        </div>
      </div>

      {/* Data & Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <h3 className="text-lg font-medium mb-4 text-gradient">Recent Transactions</h3>
          <TransactionList />
        </div>
        <div className="space-y-6">
          <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
            <Alerts />
          </div>
          <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
            <FinancialAdvice />
          </div>
        </div>
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <h3 className="text-lg font-medium mb-4 text-gradient">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              className="w-full justify-start backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10" 
              variant="outline"
              onClick={() => handleAction("Data analyse")}
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Data Analyse
            </Button>
            <Button 
              className="w-full justify-start backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10" 
              variant="outline"
              onClick={() => handleAction("Rapport generatie")}
            >
              <LineChart className="w-4 h-4 mr-2" />
              Genereer Rapport
            </Button>
          </div>
        </div>

        <div className="glass-panel backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
          <h3 className="text-lg font-medium mb-4 text-gradient">System Status</h3>
          <div className="space-y-4">
            <div className="p-3 backdrop-blur-md bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-500">
                <Activity className="w-4 h-4" />
                <p className="font-medium">Trading Systeem Actief</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Alle systemen functioneren normaal
              </p>
            </div>
            <div className="p-3 backdrop-blur-md bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-blue-500">
                <LineChart className="w-4 h-4" />
                <p className="font-medium">Market Data Updates</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time data wordt ontvangen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
