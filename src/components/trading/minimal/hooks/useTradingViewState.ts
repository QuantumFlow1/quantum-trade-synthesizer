
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';

export type TimeInterval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
export type ChartType = "line" | "area" | "candles" | "bars";

export interface ChartIndicators {
  volume: boolean;
  ema: boolean;
  sma: boolean;
  macd: boolean;
  rsi: boolean;
  bollingerBands: boolean;
}

export function useTradingViewState() {
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>("1h");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [visibleIndicators, setVisibleIndicators] = useState<ChartIndicators>({
    volume: true,
    ema: false,
    sma: true,
    macd: false,
    rsi: false,
    bollingerBands: false
  });
  const [showLegend, setShowLegend] = useState(true);

  // Use ref to track if toast was shown for an interval
  const shownToastsRef = useRef(new Set<string>());

  // Memoize interval change handler
  const handleIntervalChange = useCallback((interval: TimeInterval) => {
    setSelectedInterval(interval);
    
    // Only show toast if we haven't shown it for this interval yet
    if (!shownToastsRef.current.has(interval)) {
      toast({
        title: "Timeframe Updated",
        description: `Chart now showing ${interval} timeframe`,
        duration: 2000,
      });
      shownToastsRef.current.add(interval);
    }
  }, []);

  // Memoize chart type change handler
  const handleChartTypeChange = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);

  // Memoized indicator toggle handler
  const toggleIndicator = useCallback((indicator: keyof ChartIndicators) => {
    setVisibleIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  }, []);

  // Toggle legend display
  const toggleLegend = useCallback(() => {
    setShowLegend(prev => !prev);
  }, []);

  // Process chart data with indicators
  const processChartData = useCallback((data: any[]) => {
    if (!data || data.length === 0) return [];
    
    // Clone data to avoid mutating original
    return data.map(point => {
      // Return original data with any calculated indicators
      return {
        ...point,
        // Add any custom calculated indicators here if needed
      };
    });
  }, []);

  // Reset shown toasts when component unmounts
  useEffect(() => {
    return () => {
      shownToastsRef.current.clear();
    };
  }, []);

  return {
    selectedInterval,
    setSelectedInterval: handleIntervalChange,
    chartType,
    setChartType: handleChartTypeChange,
    visibleIndicators,
    toggleIndicator,
    showLegend,
    toggleLegend,
    processChartData
  };
}
