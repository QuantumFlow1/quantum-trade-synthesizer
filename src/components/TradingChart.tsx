
import { useState, useEffect } from "react";
import { Activity, CandlestickChart, BarChart2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTradingData, type TradingDataPoint } from "@/utils/tradingData";
import { PriceCards } from "./trading/PriceCards";
import { ChartViews } from "./trading/ChartViews";
import { IndicatorSelector } from "./trading/IndicatorSelector";
import { TradeOrderForm } from "./trading/TradeOrderForm";
import TransactionList from "./TransactionList";

const TradingChart = () => {
  const [data, setData] = useState<TradingDataPoint[]>(generateTradingData());
  const [view, setView] = useState<"price" | "volume" | "indicators">("price");
  const [indicator, setIndicator] = useState<"sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx">("sma");

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = newData[newData.length - 1].close;
        const randomChange = Math.random() * 1000 - 500;
        const newClose = lastValue + randomChange;
        const hour = new Date().getHours().toString().padStart(2, '0') + ":00";
        
        const open = lastValue;
        const high = Math.max(lastValue, newClose) + Math.random() * 200;
        const low = Math.min(lastValue, newClose) - Math.random() * 200;
        const sma = (lastValue + newClose) / 2;
        const ema = sma * 0.8 + (Math.random() * 100 - 50);
        const macd = Math.random() * 20 - 10;
        const macdSignal = macd + (Math.random() * 4 - 2);
        
        newData.push({
          name: hour,
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
  }, []);

  const handleSubmitOrder = (order: any) => {
    console.log("Order submitted:", order);
  };

  return (
    <div className="space-y-6">
      <PriceCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="price" className="w-full">
            <TabsList className="mb-4 bg-background/50 backdrop-blur-md">
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

            <TabsContent value="price">
              <div className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
                <ChartViews data={data} view="price" indicator={indicator} />
              </div>
            </TabsContent>

            <TabsContent value="volume">
              <div className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
                <ChartViews data={data} view="volume" indicator={indicator} />
              </div>
            </TabsContent>

            <TabsContent value="indicators">
              <div className="space-y-4">
                <IndicatorSelector 
                  currentIndicator={indicator}
                  onIndicatorChange={setIndicator}
                />
                
                <div className="h-[400px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] transition-all duration-300">
                  <ChartViews data={data} view="indicators" indicator={indicator} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <TradeOrderForm 
            currentPrice={data[data.length - 1].close}
            onSubmitOrder={handleSubmitOrder}
          />
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
