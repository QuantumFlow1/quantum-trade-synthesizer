
import { MinimalTradingTab } from "@/components/trading/minimal/MinimalTradingTab";

export const MinimalTradingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Trading Dashboard</h2>
        <p className="text-muted-foreground">
          A streamlined trading interface with market data, price charts, and AI-powered trading agents.
        </p>
      </div>
      <MinimalTradingTab />
    </div>
  );
};
