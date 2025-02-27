
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChartViews } from "@/components/trading/ChartViews";
import { TimeframeSelector } from "@/components/trading/TimeframeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { generateTradingData } from "@/utils/tradingData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown, ChevronUp, Info, BarChart3, TrendingUp, LayoutGrid, Bell, LineChart } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { AdvancedIndicatorSelector } from "@/components/trading/AdvancedIndicatorSelector";
import { MultiChartLayout } from "@/components/trading/MultiChartLayout";
import { CustomAlertSystem } from "@/components/trading/CustomAlertSystem";
import { toast } from "@/hooks/use-toast";
import { IndicatorType } from "@/components/trading/charts/types/types";

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketName: string | null;
  marketData: any;
}

export const MarketDetailModal = ({
  isOpen,
  onClose,
  marketName,
  marketData,
}: MarketDetailModalProps) => {
  const [tradingData, setTradingData] = useState<TradingDataPoint[]>([]);
  const [currentTimeframe, setCurrentTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1d");
  const [chartView, setChartView] = useState<"price" | "volume" | "indicators">("price");
  const [indicator, setIndicator] = useState<IndicatorType>("sma");
  const [chartType, setChartType] = useState<"candles" | "line" | "area" | "bars">("candles");
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [showMultiChart, setShowMultiChart] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showExtendedData, setShowExtendedData] = useState(false);
  const [secondaryIndicator, setSecondaryIndicator] = useState<string | undefined>(undefined);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Generate dummy trading data for demonstration purposes
  useEffect(() => {
    if (isOpen && marketName) {
      const dummyData = generateTradingData(currentTimeframe);
      setTradingData(dummyData);
    }
  }, [isOpen, marketName, currentTimeframe]);

  // Get market stats for the selected market
  const marketStats = marketData?.find((item: any) => item.name === marketName) || null;

  const handleTimeframeChange = (timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => {
    setCurrentTimeframe(timeframe);
  };

  const handleChartTypeChange = (type: "candles" | "line" | "area" | "bars") => {
    setChartType(type);
    
    toast({
      title: "Chart Type Changed",
      description: `Chart view switched to ${type}`
    });
  };
  
  const handleDrawingToolsToggle = () => {
    setShowDrawingTools(!showDrawingTools);
    
    if (!showDrawingTools) {
      toast({
        title: "Drawing Tools Enabled",
        description: "You can now draw on the chart"
      });
    }
  };
  
  const handleLoadExtendedData = () => {
    setShowExtendedData(true);
    
    // Simulate loading extended data
    toast({
      title: "Loading Extended Data",
      description: "Fetching historical data..."
    });
    
    // After a timeout, generate more data and add it to the beginning
    setTimeout(() => {
      const extendedData = generateTradingData(currentTimeframe, 200);
      setTradingData(extendedData);
      
      toast({
        title: "Data Loaded",
        description: "Extended historical data loaded successfully"
      });
      
      // Reset the flag after loading
      setTimeout(() => {
        setShowExtendedData(false);
      }, 500);
    }, 2000);
  };
  
  const handleSecondaryIndicatorChange = (indicator: string | undefined) => {
    setSecondaryIndicator(indicator);
    
    if (indicator) {
      toast({
        title: "Indicator Overlay Added",
        description: `${indicator.toUpperCase()} added as overlay`
      });
    }
  };
  
  // Create a type-safe wrapper for the setIndicator function
  const handleIndicatorChange = (newIndicator: string) => {
    setIndicator(newIndicator as IndicatorType);
  };

  const Modal = isMobile ? Sheet : Dialog;
  const ModalContent = isMobile ? SheetContent : DialogContent;
  const ModalHeader = isMobile ? SheetHeader : DialogHeader;
  const ModalTitle = isMobile ? SheetTitle : DialogTitle;

  return (
    <Modal open={isOpen} onOpenChange={() => onClose()}>
      <ModalContent className={`${isMobile ? 'pt-10' : ''} bg-background/95 backdrop-blur-xl border-white/10 p-0 max-w-5xl w-full`}>
        <ModalHeader className="px-6 pt-6 pb-2">
          <ModalTitle className="text-2xl font-bold">
            {marketName} Market Detail
          </ModalTitle>
          {marketStats && (
            <DialogDescription className="flex items-center gap-2 text-sm">
              <span className={`font-semibold ${Number(marketStats.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Number(marketStats.change) >= 0 ? (
                  <ChevronUp className="h-4 w-4 inline mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 inline mr-1" />
                )}
                {marketStats.change}%
              </span>
              <span>Last Price: {marketStats.price}</span>
              <span>Volume: {marketStats.volume}</span>
            </DialogDescription>
          )}
        </ModalHeader>

        <div className="p-6 space-y-4">
          {/* Chart Type and Timeframe Selectors */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={chartType === "candles" ? "default" : "outline"}
                onClick={() => handleChartTypeChange("candles")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Candles
              </Button>
              <Button
                size="sm"
                variant={chartType === "line" ? "default" : "outline"}
                onClick={() => handleChartTypeChange("line")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Line
              </Button>
              <Button
                size="sm"
                variant={chartType === "area" ? "default" : "outline"}
                onClick={() => handleChartTypeChange("area")}
              >
                <LineChart className="h-4 w-4 mr-2" />
                Area
              </Button>
              <Button
                size="sm"
                variant={chartType === "bars" ? "default" : "outline"}
                onClick={() => handleChartTypeChange("bars")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Bars
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={showDrawingTools ? "default" : "outline"}
                onClick={handleDrawingToolsToggle}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Draw
              </Button>
              
              <Button
                size="sm"
                variant={showMultiChart ? "default" : "outline"}
                onClick={() => setShowMultiChart(!showMultiChart)}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Multi
              </Button>
              
              <Button
                size="sm"
                variant={showAlerts ? "default" : "outline"}
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleLoadExtendedData}
                disabled={showExtendedData}
              >
                <Info className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
            
            <TimeframeSelector
              currentTimeframe={currentTimeframe}
              onTimeframeChange={handleTimeframeChange}
            />
          </div>

          {/* Multi-Chart Layout */}
          {showMultiChart ? (
            <div className="h-[500px] border border-white/10 rounded-lg overflow-hidden">
              <MultiChartLayout 
                data={tradingData} 
                onClose={() => setShowMultiChart(false)} 
              />
            </div>
          ) : (
            /* Chart Types Tabs */
            <Tabs defaultValue="price" onValueChange={(v) => setChartView(v as any)} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="price" className="flex-1">Price</TabsTrigger>
                <TabsTrigger value="volume" className="flex-1">Volume</TabsTrigger>
                <TabsTrigger value="indicators" className="flex-1">Indicators</TabsTrigger>
              </TabsList>

              {/* Indicators selector when indicators tab is active */}
              {chartView === "indicators" && (
                <div className="mt-2 bg-secondary/10 rounded-md p-2">
                  <AdvancedIndicatorSelector 
                    currentIndicator={indicator}
                    secondaryIndicator={secondaryIndicator}
                    onIndicatorChange={handleIndicatorChange}
                    onSecondaryIndicatorChange={handleSecondaryIndicatorChange}
                  />
                </div>
              )}

              <div className="h-[500px] mt-4">
                <ChartViews 
                  data={tradingData} 
                  view={chartView} 
                  indicator={indicator}
                  chartType={chartType}
                  showDrawingTools={showDrawingTools}
                  showExtendedData={showExtendedData}
                  secondaryIndicator={secondaryIndicator}
                />
              </div>
            </Tabs>
          )}
          
          {/* Alerts Section */}
          {showAlerts && (
            <div className="border border-white/10 rounded-lg p-4 bg-secondary/5">
              <CustomAlertSystem 
                data={tradingData} 
                symbol={marketName || "BTC/USD"} 
              />
            </div>
          )}

          {/* Market Information Section */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary/10 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Market Overview
              </h3>
              {marketStats && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">{marketStats.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Change:</span>
                    <span className={`font-medium ${Number(marketStats.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketStats.change}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h High:</span>
                    <span className="font-medium text-green-400">{marketStats.high}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Low:</span>
                    <span className="font-medium text-red-400">{marketStats.low}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Volume:</span>
                    <span className="font-medium">{marketStats.volume}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-secondary/10 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Quick Analysis
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trend:</span>
                  <span className={`font-medium ${Number(marketStats?.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(marketStats?.change) >= 0 ? 'Bullish' : 'Bearish'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volatility:</span>
                  <span className="font-medium">
                    {marketStats ? (((marketStats.high - marketStats.low) / marketStats.price * 100).toFixed(2) + '%') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SMA (20):</span>
                  <span className="font-medium">
                    {marketStats?.price ? (marketStats.price * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RSI (14):</span>
                  <span className={`font-medium ${Number(marketStats?.change) >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {Number(marketStats?.change) >= 0 ? 
                      (50 + Math.random() * 30).toFixed(0) : 
                      (30 - Math.random() * 20).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
