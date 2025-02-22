
interface TradingMetricsProps {
  tradeCount: number;
  isRapidMode: boolean;
}

export const TradingMetrics = ({ tradeCount, isRapidMode }: TradingMetricsProps) => {
  return (
    <div className="pt-4 border-t border-border/50">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Trades Executed: {tradeCount}</span>
        <span>Mode: {isRapidMode ? 'Rapid (5s)' : 'Normal (30s)'}</span>
      </div>
    </div>
  );
};
