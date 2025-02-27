
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  ReferenceLine,
  Legend,
  Brush,
  ResponsiveContainer 
} from "recharts";
import { useChartType } from "../hooks/useChartType";

interface PriceChartProps {
  data: TradingDataPoint[];
  chartType?: "candles" | "line" | "area" | "bars";
}

export const PriceChart = ({ data, chartType = "candles" }: PriceChartProps) => {
  const { renderChart } = useChartType(data, chartType);
  return renderChart();
};
