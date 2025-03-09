
import React, { useEffect, useState } from 'react';
import { useTradingChartData } from '@/hooks/use-trading-chart-data';
import { PriceDataPoint, TradingChartState } from '@/hooks/trading-chart/types';

interface TradingChartProps {
  symbol?: string;
  interval?: string;
  height?: number;
  width?: number;
  showControls?: boolean;
  onSymbolChange?: (symbol: string) => void;
  onIntervalChange?: (interval: string) => void;
  simulationMode?: boolean;
}

// Define a consistent TradingDataPoint type for internal use
interface ChartTradingDataPoint {
  name: string;
  date: Date;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma?: number;
  ema?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
  bollingerUpper?: number;
  bollingerLower?: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol = 'BTC',
  interval = '1h',
  height = 400,
  width = 800,
  showControls = true,
  onSymbolChange,
  onIntervalChange,
  simulationMode = false
}) => {
  // Use our custom hook to handle the data fetching and processing
  const { 
    data, 
    loading, 
    error, 
    apiStatus,
    refreshData,
    symbol: currentSymbol,
    interval: currentInterval
  } = useTradingChartData(simulationMode, symbol, interval);
  
  // State for the processed data ready for chart rendering
  const [chartData, setChartData] = useState<ChartTradingDataPoint[]>([]);
  
  // Process the data when it changes
  useEffect(() => {
    if (data && data.length > 0) {
      // Convert data to proper format with Date objects
      const convertedData = data.map((item: PriceDataPoint, index: number) => {
        // Ensure we have a proper Date object
        const dateObj = new Date(item.timestamp);
        
        return {
          name: `Day-${index}`,
          date: dateObj,
          price: item.close,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
          // Add any additional indicators if available
          sma: undefined,
          ema: undefined,
          rsi: undefined,
          macd: undefined,
          macdSignal: undefined,
          macdHistogram: undefined,
          bollingerUpper: undefined,
          bollingerLower: undefined
        };
      });
      
      setChartData(convertedData);
    }
  }, [data]);

  // Handle changing the symbol
  const handleSymbolChange = (newSymbol: string) => {
    if (onSymbolChange) {
      onSymbolChange(newSymbol);
    }
  };

  // Handle changing the interval
  const handleIntervalChange = (newInterval: string) => {
    if (onIntervalChange) {
      onIntervalChange(newInterval);
    }
  };

  // Refresh chart data
  const handleRefresh = () => {
    refreshData();
  };

  // Show an error message if there was a problem loading the data
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h3>Error loading chart data:</h3>
        <p>{error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const symbols = ['BTC', 'ETH', 'LTC'];
  const intervals = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <div className="trading-chart" style={{ height, width }}>
      {/* Render chart controls if enabled */}
      {showControls && (
        <div className="chart-controls flex justify-between mb-4">
          {/* Symbol selector */}
          <div className="symbol-selector">
            <label htmlFor="symbol">Symbol:</label>
            <select
              id="symbol"
              value={currentSymbol}
              onChange={(e) => {
                handleSymbolChange(e.target.value);
              }}
            >
              {symbols.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          
          {/* Interval selector */}
          <div className="interval-selector">
            <label htmlFor="interval">Interval:</label>
            <select
              id="interval"
              value={currentInterval}
              onChange={(e) => {
                handleIntervalChange(e.target.value);
              }}
            >
              {intervals.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          
          {/* Refresh button */}
          <button 
            onClick={handleRefresh}
            className="refresh-button px-3 py-1 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      )}
      
      {/* Chart area */}
      <div className="chart-area" style={{ height: showControls ? height - 60 : height }}>
        {loading ? (
          <div className="loading-indicator flex items-center justify-center h-full">
            <p>Loading chart data...</p>
          </div>
        ) : chartData.length > 0 ? (
          <div className="chart-container h-full">
            {/* This is where the actual chart would be rendered */}
            <p className="text-center">Chart goes here - {chartData.length} data points available</p>
            <p className="text-center">{currentSymbol} - {currentInterval}</p>
            <p className="text-center">API Status: {apiStatus}</p>
          </div>
        ) : (
          <div className="no-data-message flex items-center justify-center h-full">
            <p>No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingChart;
