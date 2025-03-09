
import { MinimalTradingTab } from "@/components/trading/minimal/MinimalTradingTab";
import { TradingPairsList } from "@/components/trading/minimal/components/TradingPairsList";
import { MarketSummary } from "@/components/trading/minimal/components/MarketSummary";
import { PriceAlerts } from "@/components/trading/minimal/components/PriceAlerts";
import { Grid } from "@/components/ui/grid";

export const MinimalTradingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Trading Dashboard</h2>
        <p className="text-muted-foreground">
          A streamlined trading interface with market data, price charts, and AI-powered trading agents.
        </p>
      </div>
      
      <Grid className="grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <TradingPairsList />
          <MarketSummary />
          <PriceAlerts />
        </div>
        
        <div className="lg:col-span-3">
          <MinimalTradingTab />
        </div>
      </Grid>
    </div>
  );
};
