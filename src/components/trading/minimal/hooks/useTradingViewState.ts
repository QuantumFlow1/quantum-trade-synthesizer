
import { useState } from "react";

export const useTradingViewState = () => {
  const [selectedInterval, setSelectedInterval] = useState("1d");
  const [chartType, setChartType] = useState("line");
  const [visibleIndicators, setVisibleIndicators] = useState({
    volume: true,
    ema: false,
    sma: true,
  });
  
  const toggleIndicator = (indicator: keyof typeof visibleIndicators) => {
    setVisibleIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  // Generate EMA (Exponential Moving Average) data
  const getEMAData = (data: any[], period: number = 20) => {
    const k = 2 / (period + 1);
    let ema = data[0]?.close || 0;
    
    return data.map(item => {
      ema = item.close * k + ema * (1 - k);
      return ema;
    });
  };
  
  // Generate SMA (Simple Moving Average) data
  const getSMAData = (data: any[], period: number = 20) => {
    return data.map((item, index) => {
      if (index < period - 1) return null;
      
      let sum = 0;
      for (let i = 0; i < period; i++) {
        sum += data[index - i].close;
      }
      
      return sum / period;
    });
  };
  
  // Process chart data with technical indicators
  const processChartData = (chartData: any[]) => {
    // Format data for SMA line
    const smaData = getSMAData(chartData, 20);
    
    // Format data for EMA line
    const emaData = getEMAData(chartData, 20);
    
    // Enhanced chart data with indicators
    const enhancedChartData = chartData.map((item, index) => ({
      ...item,
      formattedDate: formatDate(item.timestamp),
      sma: smaData[index],
      ema: emaData[index]
    }));
    
    return enhancedChartData;
  };
  
  return {
    selectedInterval,
    setSelectedInterval,
    chartType,
    setChartType,
    visibleIndicators,
    toggleIndicator,
    processChartData
  };
};
