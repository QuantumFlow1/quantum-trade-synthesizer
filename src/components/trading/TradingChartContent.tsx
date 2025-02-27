
import { useState, useEffect } from "react";
import { Activity, CandlestickChart, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTradingData } from "@/utils/tradingData";
import { ChartControls } from "./ChartControls";
import { ChartActions } from "./ChartActions";
import { TradingTabContent } from "./TradingTabContent";
import { toast } from "@/hooks/use-toast";

interface TradingChartContentProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

export const TradingChartContent = ({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom
}: TradingChartContentProps) => {
  const [data, setData] = useState(generateTradingData());
  const [indicator, setIndicator] = useState<"sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx">("sma");
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [chartType, setChartType] = useState<"candles" | "line" | "area" | "bars">("candles");
  const [showReplayMode, setShowReplayMode] = useState(false);

  // Generate data based on timeframe
  useEffect(() => {
    const newData = generateTradingData(timeframe);
    setData(newData);
    
    toast({
      title: "Timeframe Updated",
      description: `Chart now showing ${timeframe} timeframe data`,
      duration: 2000,
    });
  }, [timeframe]);

  // Live data update effect - only when not in replay mode
  useEffect(() => {
    if (showReplayMode) return;
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = newData[newData.length - 1].close;
        const randomChange = Math.random() * 1000 - 500;
        const newClose = lastValue + randomChange;
        
        // Time label based on selected timeframe
        let timeLabel;
        switch(timeframe) {
          case "1m": timeLabel = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); break;
          case "5m": 
          case "15m": timeLabel = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); break;
          case "1h": timeLabel = new Date().getHours().toString().padStart(2, '0') + ":00"; break;
          case "4h": 
            const hour = Math.floor(new Date().getHours() / 4) * 4;
            timeLabel = hour.toString().padStart(2, '0') + ":00"; 
            break;
          case "1d": timeLabel = new Date().toLocaleDateString([], {month: 'short', day: 'numeric'}); break;
          case "1w": timeLabel = "Week " + Math.ceil(new Date().getDate() / 7); break;
          default: timeLabel = new Date().toLocaleTimeString();
        }
        
        const open = lastValue;
        const high = Math.max(lastValue, newClose) + Math.random() * 200;
        const low = Math.min(lastValue, newClose) - Math.random() * 200;
        const sma = (lastValue + newClose) / 2;
        const ema = sma * 0.8 + (Math.random() * 100 - 50);
        const macd = Math.random() * 20 - 10;
        const macdSignal = macd + (Math.random() * 4 - 2);
        
        newData.push({
          name: timeLabel,
          open,
          high,
          low,
          close: newClose,
          volume: Math.random() * 100 + 50,
          sma,
          ema,
          rsi: Math.random() * 100,
          macd,
          macdSignal,
          macdHistogram: macd - macdSignal,
          bollingerUpper: high + (Math.random() * 300),
          bollingerLower: low - (Math.random() * 300),
          stochastic: Math.random() * 100,
          adx: Math.random() * 100,
          trend: newClose > lastValue ? "up" : "down"
        });
        
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [timeframe, showReplayMode]);

  const handleChartTypeChange = (type: "candles" | "line" | "area" | "bars") => {
    setChartType(type);
  };
  
  const handleToggleReplayMode = () => {
    setShowReplayMode(prev => !prev);
    
    toast({
      title: showReplayMode ? "Replay mode disabled" : "Replay mode enabled",
      description: showReplayMode 
        ? "Chart will now update in real-time" 
        : "You can now replay historical price movements",
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
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
            <ChartControls 
              timeframe={timeframe}
              chartType={chartType}
              showReplayMode={showReplayMode}
              onTimeframeChange={setTimeframe}
              onChartTypeChange={handleChartTypeChange}
              onToggleReplayMode={handleToggleReplayMode}
            />
            
            <ChartActions 
              chartContainerRef={{ current: null }}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleResetZoom={handleResetZoom}
            />
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
      </div>
    </div>
  );
};

