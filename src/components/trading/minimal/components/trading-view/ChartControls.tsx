
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandlestickChart, LineChartIcon, BarChart as BarChartIcon } from "lucide-react";

interface ChartControlsProps {
  selectedInterval: string;
  setSelectedInterval: (value: string) => void;
  chartType: string;
  setChartType: (type: string) => void;
  useRealData?: boolean;
}

export const ChartControls = ({
  selectedInterval,
  setSelectedInterval,
  chartType,
  setChartType,
  useRealData = false
}: ChartControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Select value={selectedInterval} onValueChange={setSelectedInterval}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15m">15 minutes</SelectItem>
            <SelectItem value="1h">1 hour</SelectItem>
            <SelectItem value="4h">4 hours</SelectItem>
            <SelectItem value="1d">1 day</SelectItem>
            <SelectItem value="1w">1 week</SelectItem>
          </SelectContent>
        </Select>
        
        <Badge variant={useRealData ? "default" : "outline"}>
          {useRealData ? "Real Data" : "Simulated"}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant={chartType === "line" ? "default" : "outline"} 
          size="icon" 
          onClick={() => setChartType("line")}
          title="Line Chart"
        >
          <LineChartIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant={chartType === "area" ? "default" : "outline"} 
          size="icon" 
          onClick={() => setChartType("area")}
          title="Area Chart"
        >
          <BarChartIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant={chartType === "candle" ? "default" : "outline"} 
          size="icon" 
          onClick={() => setChartType("candle")}
          title="Candlestick Chart"
        >
          <CandlestickChart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
