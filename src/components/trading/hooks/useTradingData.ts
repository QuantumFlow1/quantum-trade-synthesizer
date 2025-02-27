
import { useState, useEffect } from "react";
import { generateTradingData, TradingDataPoint } from "@/utils/tradingData";
import { toast } from "@/hooks/use-toast";

interface UseTradingDataOptions {
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
  showReplayMode: boolean;
}

export const useTradingData = ({ timeframe, showReplayMode }: UseTradingDataOptions) => {
  const [data, setData] = useState<TradingDataPoint[]>(generateTradingData());

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

  return { data, setData };
};
