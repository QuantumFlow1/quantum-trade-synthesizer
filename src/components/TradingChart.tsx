
import { useState, useEffect } from "react";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { PriceCards } from "./trading/PriceCards";
import { TradingChartContent } from "./trading/TradingChartContent";
import { TradingOrderSection } from "./trading/TradingOrderSection";
import { generateTradingData } from "@/utils/tradingData";

const TradingChart = () => {
  const [data, setData] = useState(generateTradingData());
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('available');
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);

  return (
    <div className="space-y-6">
      <PriceCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradingChartContent 
            scale={scale}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
          />
        </div>

        <TradingOrderSection apiStatus={apiStatus} />
      </div>
    </div>
  );
};

export default TradingChart;
