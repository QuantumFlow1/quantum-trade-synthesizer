
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { TradingControls } from './automated/TradingControls';
import { TradingStatus } from './automated/TradingStatus';
import { ErrorDisplay } from './automated/ErrorDisplay';
import { AnalysisDisplay } from './automated/AnalysisDisplay';
import { TradingMetrics } from './automated/TradingMetrics';
import { TradingErrorBoundary } from './automated/TradingErrorBoundary';
import { useTradeAnalysis } from '@/hooks/use-trade-analysis';

interface AutomatedTradingPanelProps {
  simulationMode?: boolean;
}

export const AutomatedTradingPanel = ({ simulationMode = true }: AutomatedTradingPanelProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isRapidMode, setIsRapidMode] = useState(false);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");

  const {
    lastAnalysis,
    tradeCount,
    totalProfit,
    error
  } = useTradeAnalysis({
    isActive,
    riskLevel,
    isRapidMode,
    simulationMode
  });

  return (
    <Card className="p-6 space-y-6 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <TradingErrorBoundary componentName="Trading Controls">
        <TradingControls
          isActive={isActive}
          setIsActive={setIsActive}
          isRapidMode={isRapidMode}
          setIsRapidMode={setIsRapidMode}
          simulationMode={simulationMode}
        />
      </TradingErrorBoundary>

      <TradingErrorBoundary componentName="Trading Status">
        <TradingStatus
          isActive={isActive}
          totalProfit={totalProfit}
        />
      </TradingErrorBoundary>

      <TradingErrorBoundary componentName="Error Display">
        <ErrorDisplay error={error} />
      </TradingErrorBoundary>

      <TradingErrorBoundary componentName="Analysis Display">
        <AnalysisDisplay analysis={lastAnalysis} />
      </TradingErrorBoundary>

      <TradingErrorBoundary componentName="Trading Metrics">
        <TradingMetrics
          tradeCount={tradeCount}
          isRapidMode={isRapidMode}
        />
      </TradingErrorBoundary>
    </Card>
  );
};
