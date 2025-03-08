
import { TradingDataPoint } from "@/utils/tradingData";
import { RSIChart } from "./RSIChart";
import { MACDChart } from "./MACDChart";

interface IndicatorsSectionProps {
  data: TradingDataPoint[];
  showIndicators: boolean;
}

export const IndicatorsSection = ({ data, showIndicators }: IndicatorsSectionProps) => {
  if (!showIndicators) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <RSIChart data={data} />
      <MACDChart data={data} />
    </div>
  );
};
