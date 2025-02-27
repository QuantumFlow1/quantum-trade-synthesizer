
import { useState, useEffect, useRef } from "react";
import { Activity, CandlestickChart, BarChart2, Clock, ZoomIn, ZoomOut, Download, Maximize2, RotateCcw, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTradingData, type TradingDataPoint } from "@/utils/tradingData";
import { PriceCards } from "./trading/PriceCards";
import { ChartViews } from "./trading/ChartViews";
import { IndicatorSelector } from "./trading/IndicatorSelector";
import { TradeOrderForm } from "./trading/TradeOrderForm";
import TransactionList from "./TransactionList";
import { usePositions } from "@/hooks/use-positions";
import PositionsList from "./trading/PositionsList";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { TimeframeSelector } from "./trading/TimeframeSelector";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const TradingChart = () => {
  const [data, setData] = useState<TradingDataPoint[]>(generateTradingData());
  const [view, setView] = useState<"price" | "volume" | "indicators">("price");
  const [indicator, setIndicator] = useState<"sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx">("sma");
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('available');
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [chartType, setChartType] = useState<"candles" | "line" | "area" | "bars">("candles");
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const { positions, isLoading: positionsLoading } = usePositions();

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

  // Live data update effect
  useEffect(() => {
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
  }, [timeframe]);

  const handleSubmitOrder = (order: any) => {
    console.log("Order submitted:", order);
  };

  const handleDownloadChart = () => {
    if (!chartContainerRef.current) return;
    
    toast({
      title: "Chart Downloaded",
      description: "Chart image has been downloaded successfully",
    });
  };

  const handleFullscreen = () => {
    if (!chartContainerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      chartContainerRef.current.requestFullscreen();
    }
  };

  const handleChartTypeChange = (type: "candles" | "line" | "area" | "bars") => {
    setChartType(type);
    
    toast({
      title: "Chart Type Changed",
      description: `Chart view switched to ${type}`,
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <PriceCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                  <div className="flex gap-2 items-center">
                    <TimeframeSelector 
                      currentTimeframe={timeframe} 
                      onTimeframeChange={setTimeframe} 
                    />
                    
                    <Select value={chartType} onValueChange={(value) => 
                      handleChartTypeChange(value as "candles" | "line" | "area" | "bars")
                    }>
                      <SelectTrigger className="w-[130px] h-9">
                        <SelectValue placeholder="Chart Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Chart Type</SelectLabel>
                          <SelectItem value="candles">Candlestick</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                          <SelectItem value="area">Area</SelectItem>
                          <SelectItem value="bars">Bars</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleZoomIn}>
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom In</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleZoomOut}>
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom Out</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleResetZoom}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset View</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleDownloadChart}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download Chart</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={handleFullscreen}>
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <TabsContent value="price">
                  <div 
                    ref={chartContainerRef}
                    className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300"
                    style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                  >
                    <ChartViews 
                      data={data} 
                      view="price" 
                      indicator={indicator} 
                      chartType={chartType}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="volume">
                  <div 
                    ref={chartContainerRef}
                    className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300"
                    style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                  >
                    <ChartViews 
                      data={data} 
                      view="volume" 
                      indicator={indicator}
                      chartType={chartType}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="indicators">
                  <div className="space-y-4">
                    <IndicatorSelector 
                      currentIndicator={indicator}
                      onIndicatorChange={setIndicator}
                    />
                    
                    <div 
                      ref={chartContainerRef}
                      className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300"
                      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                    >
                      <ChartViews 
                        data={data} 
                        view="indicators" 
                        indicator={indicator}
                        chartType={chartType}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <TradeOrderForm apiStatus={apiStatus} />
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Open Positions</h3>
            <PositionsList positions={positions} isLoading={positionsLoading} />
          </div>
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
