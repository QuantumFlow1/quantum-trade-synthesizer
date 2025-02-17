
import { 
  Bitcoin, DollarSign, Coins, BarChart4, 
  Gem, CandlestickChart, 
  Warehouse, Building2
} from "lucide-react";
import PriceCard from "../components/PriceCard";
import TradingChart from "../components/TradingChart";
import TransactionList from "../components/TransactionList";
import PerformanceMetrics from "../components/PerformanceMetrics";
import TradeControls from "../components/TradeControls";
import MarketOverview from "../components/MarketOverview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">QuantumFlow AI Trading</h1>
        <p className="text-muted-foreground">Geavanceerd handelsplatform voor fysieke en digitale markten</p>
      </header>

      {/* Cryptocurrency Markten */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Cryptocurrency Markten</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceCard
            title="Bitcoin"
            price="$45,234.12"
            change="+5.24%"
            trend="up"
            icon={<Bitcoin className="w-6 h-6" />}
            market="crypto"
          />
          <PriceCard
            title="Ethereum"
            price="$2,845.67"
            change="+3.12%"
            trend="up"
            icon={<Coins className="w-6 h-6" />}
            market="crypto"
          />
          <PriceCard
            title="Cardano"
            price="$1.24"
            change="-1.45%"
            trend="down"
            icon={<CandlestickChart className="w-6 h-6" />}
            market="crypto"
          />
          <PriceCard
            title="Solana"
            price="$98.34"
            change="+2.78%"
            trend="up"
            icon={<Coins className="w-6 h-6" />}
            market="crypto"
          />
        </div>
      </div>

      {/* Grondstoffen en Valuta */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Grondstoffen en Valuta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceCard
            title="Goud"
            price="$1,892.30"
            change="+1.35%"
            trend="up"
            icon={<Coins className="w-6 h-6" />}
            market="commodities"
          />
          <PriceCard
            title="Zilver"
            price="$24.85"
            change="-0.45%"
            trend="down"
            icon={<Gem className="w-6 h-6" />}
            market="commodities"
          />
          <PriceCard
            title="Olie (Brent)"
            price="$85.67"
            change="+2.14%"
            trend="up"
            icon={<Coins className="w-6 h-6" />}
            market="commodities"
          />
          <PriceCard
            title="EUR/USD"
            price="$1.0923"
            change="-0.14%"
            trend="down"
            icon={<DollarSign className="w-6 h-6" />}
            market="forex"
          />
        </div>
      </div>

      {/* Aandelen */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Aandelen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceCard
            title="AAPL"
            price="$178.45"
            change="+2.12%"
            trend="up"
            icon={<BarChart4 className="w-6 h-6" />}
            market="stocks"
          />
          <PriceCard
            title="MSFT"
            price="$334.78"
            change="+1.67%"
            trend="up"
            icon={<Building2 className="w-6 h-6" />}
            market="stocks"
          />
          <PriceCard
            title="GOOGL"
            price="$2,845.12"
            change="-0.34%"
            trend="down"
            icon={<BarChart4 className="w-6 h-6" />}
            market="stocks"
          />
          <PriceCard
            title="AMZN"
            price="$145.24"
            change="+3.45%"
            trend="up"
            icon={<Warehouse className="w-6 h-6" />}
            market="stocks"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="glass-panel p-4 mb-6">
            <TradingChart />
          </div>
          <div className="glass-panel p-4">
            <MarketOverview />
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-panel p-4">
            <PerformanceMetrics />
          </div>
          <div className="glass-panel p-4">
            <TradeControls />
          </div>
        </div>
      </div>

      <div className="glass-panel p-4">
        <TransactionList />
      </div>
    </div>
  );
};

export default Index;
