
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welkom, {userProfile?.email}</h1>
          <p className="text-muted-foreground">Trading Dashboard</p>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </div>

      {/* Top Row - Market Overview en Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketOverview />
        <PerformanceMetrics />
      </div>

      {/* Trading Chart & Controls */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <TradingChart />
          <div className="mt-6">
            <TradeControls />
          </div>
        </div>
      </div>

      {/* Automatic Trading & Risk Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutoTrading />
        <RiskManagement />
      </div>

      {/* Transactions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Recente Transacties</h3>
          <TransactionList />
        </div>
        <div className="space-y-6">
          <Alerts />
          <FinancialAdvice />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Snelle Acties</h3>
          <div className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleAction("Data analyse")}
            >
              <Activity className="w-4 h-4 mr-2" />
              Start Data Analyse
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleAction("Rapport generatie")}
            >
              <LineChart className="w-4 h-4 mr-2" />
              Genereer Rapport
            </Button>
          </div>
        </div>

        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Systeem Status</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="flex items-center gap-2 text-green-500">
                <Activity className="w-4 h-4" />
                <p className="font-medium">Trading Systeem Actief</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Alle systemen functioneren normaal
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
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
