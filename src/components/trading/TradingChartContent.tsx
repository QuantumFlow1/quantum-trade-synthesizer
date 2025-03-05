
import React from 'react';
import TradingChart from '../TradingChart';

interface TradingChartContentProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

export const TradingChartContent: React.FC<TradingChartContentProps> = ({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom
}) => {
  return (
    <div className="w-full h-full">
      <div className="chart-container relative bg-background/20 rounded-lg p-4 h-[500px]">
        {/* Chart visualization would go here */}
        <div className="p-4 flex justify-center items-center h-full">
          <TradingChart />
        </div>
      </div>
    </div>
  );
};
