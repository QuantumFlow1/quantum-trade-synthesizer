
import { Card } from "@/components/ui/card";
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { MarketViewHeader } from "./MarketViewHeader";
import { StatsOverlay } from "./StatsOverlay";
import { LoadingState } from "./LoadingState";
import { WebGLErrorState } from "./errors/WebGLErrorState";
import { VisualizationControls } from "./VisualizationControls";
import { MarketViewCanvas } from "./canvas/MarketViewCanvas";

interface Market3DVisualizationProps {
  isSimulationMode?: boolean;
  theme: ColorTheme;
  isLoading: boolean;
  hasError: boolean;
  contextLost: boolean;
  webGLAvailable: boolean;
  dataReady: boolean;
  loadingTime: number;
  renderKey: number;
  stats: {
    avgPrice: number;
    priceChange: number;
    priceChangePercent: number;
    maxPrice?: number;
    minPrice?: number;
  };
  visualizationData: TradingDataPoint[];
  errorStateType: 'context-lost' | 'error' | 'unsupported';
  onContextLost: () => void;
  onContextRestored: () => void;
  onRetry: () => void;
  onWebGLRestore: () => void;
}

export const Market3DVisualization = ({
  isSimulationMode = false,
  theme,
  isLoading,
  hasError,
  contextLost,
  webGLAvailable,
  dataReady,
  loadingTime,
  renderKey,
  stats,
  visualizationData,
  errorStateType,
  onContextLost,
  onContextRestored,
  onRetry,
  onWebGLRestore
}: Market3DVisualizationProps) => {
  return (
    <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all h-[500px] overflow-hidden">
      {/* Header */}
      <MarketViewHeader isSimulationMode={isSimulationMode} />
      
      {/* Stats overlay - only show when successfully loaded */}
      {!isLoading && !hasError && !contextLost && (
        <StatsOverlay 
          avgPrice={stats.avgPrice} 
          priceChange={stats.priceChange} 
          priceChangePercent={stats.priceChangePercent}
          theme={theme}
        />
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <LoadingState 
          message={
            dataReady 
              ? "Preparing 3D environment..." 
              : "Loading market data..."
          }
          retryAction={loadingTime > 5000 ? onRetry : undefined}
          loadingTime={loadingTime}
        />
      )}
      
      {/* Error state */}
      {(hasError || contextLost || (!webGLAvailable && !isLoading)) && (
        <WebGLErrorState 
          type={errorStateType} 
          onRetry={hasError ? onRetry : onWebGLRestore} 
        />
      )}
      
      {/* Controls - only show when not loading or error */}
      {!isLoading && !hasError && !contextLost && webGLAvailable && (
        <div className="absolute bottom-4 left-6 z-10">
          <VisualizationControls />
        </div>
      )}
      
      {/* 3D Canvas - with key to force remount */}
      {!hasError && !contextLost && webGLAvailable && (
        <MarketViewCanvas 
          key={`canvas-${renderKey}`}
          theme={theme}
          webGLAvailable={webGLAvailable}
          hasError={hasError}
          contextLost={contextLost}
          isLoading={isLoading}
          data={visualizationData}
          onWebGLContextLost={onContextLost}
          onWebGLContextRestored={onContextRestored}
        />
      )}
    </Card>
  );
};
