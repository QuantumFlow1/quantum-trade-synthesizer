
import { FC } from "react";
import { TradingChartContent } from "@/components/trading/TradingChartContent";
import { TradingOrderSection } from "@/components/trading";
import { TradingDataPoint } from "@/utils/tradingData";
import { ApiStatus } from "@/hooks/use-trading-chart-data";
import { Button } from "@/components/ui/button";
import { BoxIcon } from "lucide-react";

interface CombinedViewProps {
  data: TradingDataPoint[];
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  apiStatus: ApiStatus;
  rawMarketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
  isLoading?: boolean;
}

export const CombinedView: FC<CombinedViewProps> = ({
  data,
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  apiStatus,
  rawMarketData,
  onSimulationToggle,
  isSimulationMode,
  apiKeysAvailable,
  isLoading = false
}) => {
  const handleOpenVisualization = () => {
    // Navigate to visualization page
    const dashboardNavHandler = (window as any).__dashboardNavigationHandler;
    if (typeof dashboardNavHandler === 'function') {
      dashboardNavHandler('visualization');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingChartContent 
          scale={scale}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
          handleResetZoom={handleResetZoom}
          isLoading={isLoading}
        />
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center h-[500px] border border-dashed border-white/20 rounded-lg bg-secondary/5">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-3">3D Visualization Available</h3>
              <p className="mb-4 text-muted-foreground">The 3D visualization is now available as a separate page for better performance.</p>
              <Button onClick={handleOpenVisualization} className="flex items-center gap-2">
                <BoxIcon className="h-4 w-4" />
                Open 3D View
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <TradingOrderSection 
            apiStatus={apiStatus}
            marketData={rawMarketData}
            onSimulationToggle={onSimulationToggle}
            isSimulationMode={isSimulationMode}
            apiKeysAvailable={apiKeysAvailable}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
