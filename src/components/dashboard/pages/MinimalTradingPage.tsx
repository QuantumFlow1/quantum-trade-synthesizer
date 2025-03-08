
import { MinimalTradingTab } from "@/components/trading/minimal/MinimalTradingTab";

export const MinimalTradingPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Trading Dashboard</h2>
      <p className="text-muted-foreground">
        A streamlined trading interface with essential market data and charting tools.
      </p>
      <MinimalTradingTab />
    </div>
  );
};
