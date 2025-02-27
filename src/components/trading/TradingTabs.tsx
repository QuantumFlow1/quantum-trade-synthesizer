
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CandlestickChart, BarChart2 } from "lucide-react";
import { TradingDataPoint } from "@/utils/tradingData";
import { TradingTabContent } from "./TradingTabContent";

interface TradingTabsProps {
  data: TradingDataPoint[];
  chartType: "candles" | "line" | "area" | "bars";
  scale: number;
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
  setIndicator: (indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx") => void;
  showReplayMode: boolean;
  children: ReactNode;
}

export const TradingTabs = ({
  data,
  chartType,
  scale,
  indicator,
  setIndicator,
  showReplayMode,
  children
}: TradingTabsProps) => {
  return (
    <Tabs defaultValue="price" className="w-full">
      <TabsList className="bg-background/50 backdrop-blur-md">
        <TabsTrigger value="price" className="gap-2">
          <CandlestickChart className="w-4 h-4" />
          Price
        </TabsTrigger>
        <TabsTrigger value="volume" className="gap-2">
          <BarChart2 className="w-4 h-4" />
          Volume
        </TabsTrigger>
        <TabsTrigger value="indicators" className="gap-2">
          <Activity className="w-4 h-4" />
          Indicators
        </TabsTrigger>
      </TabsList>

      <div className="flex flex-wrap gap-2 mt-4 justify-between items-center">
        {children}
      </div>

      <TabsContent value="price">
        <TradingTabContent 
          tabValue="price"
          data={data}
          chartType={chartType}
          scale={scale}
          indicator={indicator}
          setIndicator={setIndicator}
          showReplayMode={showReplayMode}
        />
      </TabsContent>

      <TabsContent value="volume">
        <TradingTabContent 
          tabValue="volume"
          data={data}
          chartType={chartType}
          scale={scale}
          indicator={indicator}
          setIndicator={setIndicator}
          showReplayMode={false}
        />
      </TabsContent>

      <TabsContent value="indicators">
        <TradingTabContent 
          tabValue="indicators"
          data={data}
          chartType={chartType}
          scale={scale}
          indicator={indicator}
          setIndicator={setIndicator}
          showReplayMode={false}
        />
      </TabsContent>
    </Tabs>
  );
};
