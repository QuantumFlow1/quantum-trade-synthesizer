
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Coins, BarChart4 } from "lucide-react";
import PriceCard from "../components/PriceCard";
import TradingChart from "../components/TradingChart";
import TransactionList from "../components/TransactionList";
import PerformanceMetrics from "../components/PerformanceMetrics";
import TradeControls from "../components/TradeControls";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">QuantumFlow AI Trading</h1>
        <p className="text-muted-foreground">Advanced algorithmic trading platform</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <PriceCard
          title="Bitcoin"
          price="$45,234.12"
          change="+5.24%"
          trend="up"
          icon={<Bitcoin className="w-6 h-6" />}
          market="crypto"
        />
        <PriceCard
          title="EUR/USD"
          price="$1.0923"
          change="-0.14%"
          trend="down"
          icon={<DollarSign className="w-6 h-6" />}
          market="forex"
        />
        <PriceCard
          title="Gold"
          price="$1,892.30"
          change="+1.35%"
          trend="up"
          icon={<Coins className="w-6 h-6" />}
          market="commodities"
        />
        <PriceCard
          title="AAPL"
          price="$178.45"
          change="+2.12%"
          trend="up"
          icon={<BarChart4 className="w-6 h-6" />}
          market="stocks"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 glass-panel p-4">
          <TradingChart />
        </div>
        <div className="glass-panel p-4">
          <PerformanceMetrics />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TradeControls />
        <TransactionList />
      </div>
    </div>
  );
};

export default Index;
