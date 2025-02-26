
import { Activity, LineChart, AlertCircle, Zap, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import MarketOverview from "../MarketOverview";
import TradingChart from "../TradingChart";
import PerformanceMetrics from "../PerformanceMetrics";
import TransactionList from "../TransactionList";
import RiskManagement from "../RiskManagement";
import AutoTrading from "../AutoTrading";
import Alerts from "../Alerts";
import { useDashboard } from "@/contexts/DashboardContext";

export const MainContent = () => {
  const { visibleWidgets } = useDashboard();

  return (
    <>
      {/* Market Overview Section */}
      {visibleWidgets.market && (
        <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Market Overview</h2>
          <MarketOverview />
        </Card>
      )}

      {/* Trading Section */}
      {visibleWidgets.trading && (
        <Card className="col-span-full md:col-span-2 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><LineChart className="w-5 h-5 mr-2" /> Trading Chart</h2>
          <TradingChart />
        </Card>
      )}

      {/* Performance Metrics */}
      {visibleWidgets.performance && (
        <Card className="md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2" /> Performance</h2>
          <PerformanceMetrics />
        </Card>
      )}

      {/* Transactions List */}
      {visibleWidgets.transactions && (
        <Card className="col-span-full md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2" /> Recent Transactions</h2>
          <TransactionList />
        </Card>
      )}

      {/* Risk Management */}
      {visibleWidgets.riskManagement && (
        <Card className="col-span-full md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Risk Management</h2>
          <RiskManagement />
        </Card>
      )}

      {/* Auto Trading */}
      {visibleWidgets.autoTrading && (
        <Card className="col-span-full md:col-span-1 backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Settings className="w-5 h-5 mr-2" /> Auto Trading</h2>
          <AutoTrading />
        </Card>
      )}

      {/* Alerts */}
      {visibleWidgets.alerts && (
        <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
          <h2 className="text-xl font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2" /> Alerts</h2>
          <Alerts />
        </Card>
      )}
    </>
  );
};
