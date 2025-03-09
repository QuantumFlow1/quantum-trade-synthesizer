
import { useState } from "react";

export const useTradingViewState = () => {
  const [selectedInterval, setSelectedInterval] = useState("1d");
  const [chartType, setChartType] = useState("line");
  const [showLegend, setShowLegend] = useState(false);
  const [visibleIndicators, setVisibleIndicators] = useState({
    volume: true,
    ema: false,
    sma: true,
    macd: false,
    rsi: false,
    bollingerBands: false
  });
  
  const toggleIndicator = (indicator: keyof typeof visibleIndicators) => {
    setVisibleIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };
  
  const toggleLegend = () => {
    setShowLegend(prev => !prev);
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
  
  // Generate Bollinger Bands data
  const getBollingerBands = (data: any[], period: number = 20, multiplier: number = 2) => {
    const smaData = getSMAData(data, period);
    
    return data.map((item, index) => {
      if (index < period - 1) return { upper: null, lower: null };
      
      let sumOfSquaredDeviations = 0;
      for (let i = 0; i < period; i++) {
        const deviation = data[index - i].close - smaData[index];
        sumOfSquaredDeviations += deviation * deviation;
      }
      
      const standardDeviation = Math.sqrt(sumOfSquaredDeviations / period);
      return {
        upper: smaData[index] + (standardDeviation * multiplier),
        lower: smaData[index] - (standardDeviation * multiplier)
      };
    });
  };
  
  // Generate RSI data
  const getRSIData = (data: any[], period: number = 14) => {
    const rsiData = new Array(data.length).fill(null);
    
    if (data.length <= period) return rsiData;
    
    let avgGain = 0;
    let avgLoss = 0;
    
    // Calculate the first avgGain and avgLoss
    for (let i = 1; i <= period; i++) {
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) {
        avgGain += change;
      } else {
        avgLoss += Math.abs(change);
      }
    }
    
    avgGain /= period;
    avgLoss /= period;
    
    // Calculate RSI for the rest of the data
    for (let i = period; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      
      if (change >= 0) {
        avgGain = (avgGain * (period - 1) + change) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
      }
      
      const rs = avgGain / avgLoss;
      rsiData[i] = 100 - (100 / (1 + rs));
    }
    
    return rsiData;
  };
  
  // Process chart data with technical indicators
  const processChartData = (chartData: any[]) => {
    // Format data for SMA line
    const smaData = getSMAData(chartData, 20);
    
    // Format data for EMA line
    const emaData = getEMAData(chartData, 20);
    
    // Format data for Bollinger Bands
    const bollingerBands = getBollingerBands(chartData, 20, 2);
    
    // Format data for RSI
    const rsiData = getRSIData(chartData, 14);
    
    // Enhanced chart data with indicators
    const enhancedChartData = chartData.map((item, index) => ({
      ...item,
      formattedDate: formatDate(item.timestamp),
      sma: smaData[index],
      ema: emaData[index],
      upperBand: bollingerBands[index]?.upper,
      lowerBand: bollingerBands[index]?.lower,
      rsi: rsiData[index]
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
    processChartData,
    showLegend,
    toggleLegend
  };
};
