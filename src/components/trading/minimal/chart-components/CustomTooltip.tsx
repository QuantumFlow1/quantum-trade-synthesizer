
import { TradingDataPoint } from "@/utils/tradingData";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload as TradingDataPoint;
  
  return (
    <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md text-xs">
      <p className="font-medium mb-1">{label}</p>
      <div className="space-y-1">
        <p><span className="font-medium">Price:</span> ${data.close.toFixed(2)}</p>
        <p><span className="font-medium">High:</span> ${data.high.toFixed(2)}</p>
        <p><span className="font-medium">Low:</span> ${data.low.toFixed(2)}</p>
        {data.volume && <p><span className="font-medium">Volume:</span> {data.volume.toLocaleString()}</p>}
        {data.sma && <p><span className="font-medium">SMA:</span> ${data.sma.toFixed(2)}</p>}
        {data.ema && <p><span className="font-medium">EMA:</span> ${data.ema.toFixed(2)}</p>}
      </div>
    </div>
  );
};
