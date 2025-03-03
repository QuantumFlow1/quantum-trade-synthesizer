
import { useState } from "react";
import { ChartData, MarketData } from "../../types";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface UseModalCoreProps {
  marketName: string | null;
  marketData: ChartData[];
  onClose: () => void;
}

export const useModalCore = ({ marketName, marketData }: UseModalCoreProps) => {
  // State management for inputs
  const [amount, setAmount] = useState<string>("0.01");
  const [leverage, setLeverage] = useState<string>("1");
  const [orderType, setOrderType] = useState<string>("market");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("chart");

  // UI state
  const [hasPositions, setHasPositions] = useState<boolean>(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Calculate market data values
  const latestData = marketData[marketData.length - 1];
  const previousPrice = marketData.length > 1 ? marketData[marketData.length - 2].price : latestData.price;
  const isPriceUp = latestData.price > previousPrice;
  const change24h = ((latestData.price - previousPrice) / previousPrice) * 100;

  // Generate full market data with all required properties
  const fullMarketData: MarketData = {
    symbol: marketName || "BTC/USD",
    name: marketName?.split('/')[0] || "Bitcoin",
    price: latestData.price,
    volume: latestData.volume,
    high: latestData.high,
    low: latestData.low,
    timestamp: Date.now(),
    change24h: change24h,
    high24h: Math.max(...marketData.map(d => d.price)),
    low24h: Math.min(...marketData.map(d => d.price)),
    marketCap: latestData.price * 19000000,
    totalVolume24h: latestData.volume,
    circulatingSupply: 19000000,
    totalSupply: 21000000,
    rank: 1,
    ath: latestData.price * 1.5,
    athDate: new Date().toISOString(),
    atl: latestData.price * 0.2,
    atlDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdated: new Date().toISOString(),
    priceChange7d: change24h * 1.2,
    priceChange30d: change24h * 0.8,
  };

  return {
    // Form state
    amount,
    setAmount,
    leverage,
    setLeverage,
    orderType,
    setOrderType,
    hasPositions,
    setHasPositions,
    stopLoss,
    setStopLoss,
    takeProfit,
    setTakeProfit,
    advancedOptions,
    setAdvancedOptions,
    
    // UI state
    currentTab,
    setCurrentTab,
    
    // Auth & notifications
    toast,
    user,
    
    // Market data
    marketName,
    latestData,
    previousPrice,
    isPriceUp,
    change24h,
    fullMarketData
  };
};
