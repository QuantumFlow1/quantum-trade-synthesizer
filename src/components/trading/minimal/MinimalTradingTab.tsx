
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { MinimalMarketData } from "./MinimalMarketData";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { PortfolioManager } from "../PortfolioManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { OrderBook } from "./components/OrderBook";
import { PriceAlerts } from "./components/PriceAlerts";
import { TradingPairSelector } from "./components/TradingPairSelector";
import { ChartDrawingTools } from "./components/ChartDrawingTools";
import { TechnicalIndicators } from "./components/TechnicalIndicators";
import { NewsFeed } from "./components/NewsFeed";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState<any>(null);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("chart");
  const [selectedPair, setSelectedPair] = useState<string>("BTC/USDT");
  const [showOrderBook, setShowOrderBook] = useState<boolean>(true);
  const [showNewsPane, setShowNewsPane] = useState<boolean>(true);
  const dataRef = useRef<TradingDataPoint[]>([]);
  const { toast } = useToast();

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    try {
      const newData = tradingDataService.refreshData(timeframe);
      setData(newData);
      dataRef.current = newData;
      
      // Set current data for agent analysis
      if (newData.length > 0) {
        const latestDataPoint = newData[newData.length - 1];
        setCurrentData({
          symbol: selectedPair.split("/")[0],
          price: latestDataPoint.close,
          high: latestDataPoint.high,
          low: latestDataPoint.low,
          volume: latestDataPoint.volume
        });
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Error loading chart data",
        description: "Could not refresh trading data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
    try {
      const newData = tradingDataService.refreshData(newTimeframe);
      setData(newData);
      dataRef.current = newData;
      
      // Update current data
      if (newData.length > 0) {
        const latestDataPoint = newData[newData.length - 1];
        setCurrentData({
          symbol: selectedPair.split("/")[0],
          price: latestDataPoint.close,
          high: latestDataPoint.high,
          low: latestDataPoint.low,
          volume: latestDataPoint.volume
        });
      }
    } catch (error) {
      console.error("Error changing timeframe:", error);
      toast({
        title: "Error changing timeframe",
        description: "Could not load data for the selected timeframe.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle trading pair change
  const handlePairChange = (pair: string) => {
    setSelectedPair(pair);
    refreshData();
    toast({
      title: "Trading pair changed",
      description: `Now viewing ${pair} data`,
    });
  };

  // Handle simulation mode toggle
  const handleSimulationToggle = (enabled: boolean) => {
    setIsSimulationMode(enabled);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Toggle order book visibility
  const toggleOrderBook = () => {
    setShowOrderBook(prev => !prev);
  };

  // Toggle news pane visibility
  const toggleNewsPane = () => {
    setShowNewsPane(prev => !prev);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Trading pair selector and market data */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="w-full md:w-1/4">
          <TradingPairSelector 
            selectedPair={selectedPair} 
            onPairChange={handlePairChange} 
          />
        </div>
        <div className="w-full md:w-3/4">
          <MinimalMarketData />
        </div>
      </div>
      
      {/* Price alerts */}
      <PriceAlerts selectedPair={selectedPair} />
      
      {/* Main content with tabs */}
      <Tabs 
        defaultValue="chart" 
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="order-book">Order Book</TabsTrigger>
          <TabsTrigger value="agents">Trading Agents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Trading Chart</CardTitle>
              <ChartDrawingTools />
            </CardHeader>
            <CardContent>
              <MinimalTradingControls
                onRefresh={refreshData}
                onTimeframeChange={handleTimeframeChange}
                currentTimeframe={timeframe}
              />
              
              <TechnicalIndicators />
              
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  Loading chart data...
                </div>
              ) : (
                <MinimalPriceChart data={dataRef.current.length > 0 ? dataRef.current : data} />
              )}
            </CardContent>
          </Card>
          
          {/* News feed below chart */}
          {showNewsPane && (
            <NewsFeed selectedPair={selectedPair} />
          )}
        </TabsContent>
        
        <TabsContent value="order-book">
          <OrderBook selectedPair={selectedPair} />
        </TabsContent>
        
        <TabsContent value="agents">
          <PortfolioManager 
            isSimulationMode={isSimulationMode}
            onSimulationToggle={handleSimulationToggle}
            currentData={currentData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
