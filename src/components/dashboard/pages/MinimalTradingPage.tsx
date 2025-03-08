
import { MinimalTradingTab } from "@/components/trading/minimal/MinimalTradingTab";

export const MinimalTradingPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Trading</h2>
      <p className="text-muted-foreground">
        This is a minimal version of the trading page for performance testing.
      </p>
      <MinimalTradingTab />
    </div>
  );
};
