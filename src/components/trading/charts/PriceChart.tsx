
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  ReferenceLine,
  Legend,
  Brush,
  ResponsiveContainer,
  Line
} from "recharts";
import { useChartType } from "../hooks/useChartType";
import { useRef, useState, useEffect } from "react";
import { DrawingToolsOverlay } from "./DrawingToolsOverlay";
import { ChartTooltip } from "./types/ChartTooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface PriceChartProps {
  data: TradingDataPoint[];
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  showExtendedData?: boolean;
  secondaryIndicator?: string;
}

export const PriceChart = ({ 
  data, 
  chartType = "candles", 
  showDrawingTools = false,
  showExtendedData = false,
  secondaryIndicator
}: PriceChartProps) => {
  const { renderChart } = useChartType(data, chartType);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [showExtendedAlert, setShowExtendedAlert] = useState(false);

  // Handle showing extended data alert
  useEffect(() => {
    if (showExtendedData) {
      setShowExtendedAlert(true);
      const timer = setTimeout(() => {
        setShowExtendedAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showExtendedData]);

  // Render secondary indicator if provided
  const renderSecondaryIndicator = () => {
    if (!secondaryIndicator) return null;
    
    return (
      <Line
        type="monotone"
        dataKey={secondaryIndicator}
        stroke="#f59e0b"
        strokeWidth={2}
        dot={false}
        name={secondaryIndicator.toUpperCase()}
      />
    );
  };

  return (
    <div className="relative h-full" ref={chartContainerRef}>
      {showExtendedAlert && (
        <Alert variant="warning" className="absolute top-2 right-2 z-10 w-auto">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Loading extended historical data...
          </AlertDescription>
        </Alert>
      )}
      
      {showDrawingTools && (
        <DrawingToolsOverlay containerRef={chartContainerRef} />
      )}
      
      {renderChart(renderSecondaryIndicator)}
    </div>
  );
};
