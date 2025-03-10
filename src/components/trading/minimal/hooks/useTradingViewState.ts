
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
    if (!timestamp) return "N/A";
    
    try {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    } catch (error) {
      console.error("Error formatting date:", error, timestamp);
      return "N/A";
    }
  };
  
  // Generate EMA (Exponential Moving Average) data
  const getEMAData = (data: any[], period: number = 20) => {
    if (!data || data.length === 0 || !data[0]?.close) {
      return new Array(data?.length || 0).fill(null);
    }
    
    const k = 2 / (period + 1);
    let ema = data[0]?.close || 0;
    
    return data.map(item => {
      if (typeof item.close !== 'number') return null;
      ema = item.close * k + ema * (1 - k);
      return ema;
    });
  };
  
  // Generate SMA (Simple Moving Average) data
  const getSMAData = (data: any[], period: number = 20) => {
    if (!data || data.length === 0) {
      return new Array(data?.length || 0).fill(null);
    }
    
    return data.map((item, index) => {
      if (index < period - 1) return null;
      
      let sum = 0;
      let validPoints = 0;
      
      for (let i = 0; i < period; i++) {
        const dataPoint = data[index - i];
        if (dataPoint && typeof dataPoint.close === 'number') {
          sum += dataPoint.close;
          validPoints++;
        }
      }
      
      return validPoints > 0 ? sum / validPoints : null;
    });
  };
  
  // Generate Bollinger Bands data
  const getBollingerBands = (data: any[], period: number = 20, multiplier: number = 2) => {
    if (!data || data.length === 0) {
      return data?.map(() => ({ upper: null, lower: null })) || [];
    }
    
    const smaData = getSMAData(data, period);
    
    return data.map((item, index) => {
      if (index < period - 1 || !smaData[index]) return { upper: null, lower: null };
      
      let sumOfSquaredDeviations = 0;
      let validPoints = 0;
      
      for (let i = 0; i < period; i++) {
        const dataPoint = data[index - i];
        if (dataPoint && typeof dataPoint.close === 'number' && smaData[index] !== null) {
          const deviation = dataPoint.close - smaData[index];
          sumOfSquaredDeviations += deviation * deviation;
          validPoints++;
        }
      }
      
      if (validPoints === 0) return { upper: null, lower: null };
      
      const standardDeviation = Math.sqrt(sumOfSquaredDeviations / validPoints);
      return {
        upper: smaData[index] + (standardDeviation * multiplier),
        lower: smaData[index] - (standardDeviation * multiplier)
      };
    });
  };
  
  // Generate RSI data
  const getRSIData = (data: any[], period: number = 14) => {
    if (!data || data.length <= period) {
      return new Array(data?.length || 0).fill(null);
    }
    
    const rsiData = new Array(data.length).fill(null);
    
    // Ensure we have valid data with close values
    const validData = data.every(item => item && typeof item.close === 'number');
    if (!validData) return rsiData;
    
    let avgGain = 0;
    let avgLoss = 0;
    
    // Calculate the first avgGain and avgLoss
    for (let i = 1; i <= period; i++) {
      if (!data[i] || !data[i-1] || typeof data[i].close !== 'number' || typeof data[i-1].close !== 'number') {
        continue;
      }
      
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
      if (!data[i] || !data[i-1] || typeof data[i].close !== 'number' || typeof data[i-1].close !== 'number') {
        rsiData[i] = null;
        continue;
      }
      
      const change = data[i].close - data[i - 1].close;
      
      if (change >= 0) {
        avgGain = (avgGain * (period - 1) + change) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
      }
      
      if (avgLoss === 0) {
        rsiData[i] = 100;
      } else {
        const rs = avgGain / avgLoss;
        rsiData[i] = 100 - (100 / (1 + rs));
      }
    }
    
    return rsiData;
  };
  
  // Process chart data with technical indicators
  const processChartData = (chartData: any[]) => {
    if (!chartData || chartData.length === 0) {
      console.log("No chart data to process");
      return [];
    }
    
    // Controleer of de data geldige timestamps heeft
    const validChartData = chartData.filter(item => item && typeof item.timestamp === 'number');
    
    if (validChartData.length === 0) {
      console.log("No valid chart data points with timestamps");
      return [];
    }
    
    try {
      // Format data for SMA line
      const smaData = getSMAData(validChartData, 20);
      
      // Format data for EMA line
      const emaData = getEMAData(validChartData, 20);
      
      // Format data for Bollinger Bands
      const bollingerBands = getBollingerBands(validChartData, 20, 2);
      
      // Format data for RSI
      const rsiData = getRSIData(validChartData, 14);
      
      // Enhanced chart data with indicators
      const enhancedChartData = validChartData.map((item, index) => ({
        ...item,
        formattedDate: formatDate(item.timestamp),
        sma: smaData[index],
        ema: emaData[index],
        upperBand: bollingerBands[index]?.upper,
        lowerBand: bollingerBands[index]?.lower,
        rsi: rsiData[index]
      }));
      
      return enhancedChartData;
    } catch (error) {
      console.error("Error processing chart data:", error);
      return validChartData.map(item => ({
        ...item,
        formattedDate: formatDate(item.timestamp)
      }));
    }
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
