import { FC, useState, useEffect } from "react";
import { Market3DView } from "@/components/visualization/Market3DView";
import { TradingOrderSection } from "@/components/trading/TradingOrderSection";
import { TradingDataPoint } from "@/utils/tradingData";
import { ApiStatus } from "@/hooks/use-trading-chart-data";
import { LoadingSpinner } from "@/components/visualization/3d/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ThreeDViewProps {
  data: TradingDataPoint[];
  apiStatus: ApiStatus;
  rawMarketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
}

export const ThreeDView: FC<ThreeDViewProps> = ({
  data,
  apiStatus,
  rawMarketData,
  onSimulationToggle,
  isSimulationMode,
  apiKeysAvailable
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const maxRetryAttempts = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleError = () => {
    console.error("3D visualization error detected");
    
    if (retryAttempts < maxRetryAttempts) {
      setRetryAttempts(prev => prev + 1);
      console.log(`Auto-retry attempt ${retryAttempts + 1}/${maxRetryAttempts}`);
      
      setIsLoading(true);
      
      setTimeout(() => {
        setHasError(false);
        setIsLoading(false);
      }, 1000);
    } else {
      setHasError(true);
      setIsLoading(false);
      
      toast({
        title: "Visualization Issue",
        description: "Unable to load 3D view. Switched to a fallback display.",
        variant: "destructive",
      });
    }
  };
  
  const handleLoaded = () => {
    console.log("3D view loaded successfully");
    setIsLoading(false);
    setHasError(false);
  };
  
  const handleManualRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryAttempts(0);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      <div className="lg:col-span-2 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
            <LoadingSpinner message="Preparing 3D visualization..." />
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
            <div className="text-center p-6">
              <div className="text-destructive text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Visualization Error</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load the 3D visualization. This might be due to WebGL issues or browser compatibility.
              </p>
              <button 
                onClick={handleManualRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md mr-2"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
              >
                Reload Page
              </button>
            </div>
          </div>
        )}
        
        <Market3DView 
          data={data}
          isSimulationMode={isSimulationMode}
          onError={handleError}
          onLoaded={handleLoaded}
        />
      </div>

      <TradingOrderSection 
        apiStatus={apiStatus}
        marketData={rawMarketData}
        onSimulationToggle={onSimulationToggle}
        isSimulationMode={isSimulationMode}
        apiKeysAvailable={apiKeysAvailable}
      />
    </div>
  );
};
