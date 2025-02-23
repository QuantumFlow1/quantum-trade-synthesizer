
import { useState, useEffect } from "react";
import { Activity, CandlestickChart, BarChart2, List, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTradingData, type TradingDataPoint } from "@/utils/tradingData";
import { PriceCards } from "./trading/PriceCards";
import { ChartViews } from "./trading/ChartViews";
import { IndicatorSelector } from "./trading/IndicatorSelector";
import { TradeOrderForm } from "./trading/TradeOrderForm";
import TransactionList from "./TransactionList";
import { usePositions } from "@/hooks/use-positions";
import PositionsList from "./trading/PositionsList";

const TradingChart = () => {
  const [data, setData] = useState<TradingDataPoint[]>(generateTradingData());
  const [view, setView] = useState<"price" | "volume" | "indicators">("price");
  const [indicator, setIndicator] = useState<"sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx">("sma");

  const { positions, isLoading: positionsLoading } = usePositions();

  useEffect(() => {
    const interval = setInterval(() => {
      const lastValue = data[data.length - 1].close;
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
      
      setData(prev => {
        const newData = [...prev.slice(1)];
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PriceCards data={data} />
      
      <Tabs defaultValue="charts" className="w-full mt-8">
        <TabsList className="sticky top-0 z-10 bg-background/50 backdrop-blur-md w-full flex-wrap justify-start">
          <TabsTrigger value="charts" className="gap-2">
            <CandlestickChart className="w-4 h-4" />
            Grafieken
          </TabsTrigger>
          <TabsTrigger value="trading" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Handelen
          </TabsTrigger>
          <TabsTrigger value="positions" className="gap-2">
            <List className="w-4 h-4" />
            Posities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="mt-6">
          <div className="space-y-6">
            <Tabs defaultValue="price" className="w-full">
              <TabsList>
                <TabsTrigger value="price">Prijs</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="indicators">Indicatoren</TabsTrigger>
              </TabsList>
              
              <TabsContent value="indicators" className="mt-4">
                <IndicatorSelector 
                  currentIndicator={indicator}
                  onIndicatorChange={setIndicator}
                />
              </TabsContent>
            </Tabs>

            <div className="h-[500px] backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-4">
              <ChartViews data={data} view={view} indicator={indicator} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="mt-6">
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Nieuwe Order</h3>
              <TradeOrderForm 
                currentPrice={data[data.length - 1].close}
                onSubmitOrder={handleSubmitOrder}
              />
            </div>

            <div className="backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">Transactie Geschiedenis</h3>
              <TransactionList />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="mt-6">
          <div className="backdrop-blur-xl bg-secondary/20 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Open Posities</h3>
            <PositionsList positions={positions} isLoading={positionsLoading} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingChart;
