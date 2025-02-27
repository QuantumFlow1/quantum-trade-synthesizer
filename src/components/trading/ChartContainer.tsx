
import { FC, ReactNode, RefObject, useState, useEffect } from "react";
import { ChartViews } from "./ChartViews";
import { TradingDataPoint } from "@/utils/tradingData";
import { ZoomControls } from "../ZoomControls";
import { toast } from "@/components/ui/use-toast";
import { IndicatorType } from "./charts/types/types";

interface ChartContainerProps {
  data: TradingDataPoint[];
  view: "price" | "volume" | "indicators";
  indicator: IndicatorType;
  chartType: "candles" | "line" | "area" | "bars";
  chartContainerRef: RefObject<HTMLDivElement>;
  scale: number;
  showReplayMode?: boolean;
  children?: ReactNode;
}

export const ChartContainer: FC<ChartContainerProps> = ({
  data,
  view,
  indicator,
  chartType,
  chartContainerRef,
  scale,
  showReplayMode = false,
  children
}) => {
  const [localScale, setLocalScale] = useState(scale);
  
  // Sync with parent scale prop
  useEffect(() => {
    setLocalScale(scale);
  }, [scale]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    const newScale = Math.min(localScale + 0.1, 1.5);
    setLocalScale(newScale);
    toast({
      title: "Chart zoomed in",
      description: `Scale: ${Math.round(newScale * 100)}%`,
      duration: 1500,
    });
  };

  // Handle zoom out
  const handleZoomOut = () => {
    const newScale = Math.max(localScale - 0.1, 0.5);
    setLocalScale(newScale);
    toast({
      title: "Chart zoomed out",
      description: `Scale: ${Math.round(newScale * 100)}%`,
      duration: 1500,
    });
  };

  // Reset zoom
  const handleResetZoom = () => {
    setLocalScale(1);
    toast({
      title: "Chart zoom reset",
      description: "Scale: 100%",
      duration: 1500,
    });
  };
  
  return (
    <div className="relative">
      <div 
        ref={chartContainerRef}
        className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300"
        style={{ transform: `scale(${localScale})`, transformOrigin: 'center', height: '400px' }}
      >
        <ChartViews 
          data={data} 
          view={view} 
          indicator={indicator}
          chartType={chartType}
          showReplayMode={showReplayMode}
        />
        {children}
      </div>
      
      <div className="absolute top-2 right-2 z-10">
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
        />
      </div>
    </div>
  );
};
