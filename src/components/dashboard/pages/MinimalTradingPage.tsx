
import { MinimalTradingTab } from "@/components/trading/minimal/MinimalTradingTab";

export const MinimalTradingPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Trading Dashboard</h2>
      <p className="text-muted-foreground">
        An immersive 3D trading interface with essential market data and advanced visualization.
      </p>
      <MinimalTradingTab />
    </div>
  );
};
