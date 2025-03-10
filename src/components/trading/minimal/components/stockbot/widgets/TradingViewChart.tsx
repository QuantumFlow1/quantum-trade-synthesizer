
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ChartWidgetProps {
  symbol: string;
  timeframe?: string;
}

export const TradingViewChart: React.FC<ChartWidgetProps> = ({ symbol, timeframe = "1D" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Clean up symbol for safety
      const cleanSymbol = symbol.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
      console.log(`Creating TradingView widget for symbol: ${cleanSymbol}, timeframe: ${timeframe}`);
      
      // Create script element to load TradingView widget script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (containerRef.current && typeof window !== 'undefined' && window.TradingView) {
          if (widgetRef.current) {
            containerRef.current.innerHTML = '';
          }

          try {
            console.log("TradingView script loaded, creating widget");
            // Create a new TradingView widget
            widgetRef.current = new window.TradingView.widget({
              autosize: true,
              symbol: cleanSymbol,
              interval: getIntervalFromTimeframe(timeframe),
              timezone: "exchange",
              theme: "light",
              style: "1",
              locale: "en",
              enable_publishing: false,
              allow_symbol_change: true,
              container_id: containerRef.current.id
            });
            setIsLoading(false);
            console.log("TradingView widget created successfully");
          } catch (err) {
            console.error("Error creating TradingView widget:", err);
            setError("Failed to create chart widget");
            setIsLoading(false);
          }
        } else {
          console.error("Container ref or TradingView not available");
          setError("Failed to initialize TradingView");
          setIsLoading(false);
        }
      };
      
      script.onerror = (e) => {
        console.error("Failed to load TradingView script:", e);
        setError("Failed to load TradingView");
        setIsLoading(false);
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (e) {
      console.error("Error setting up TradingView chart:", e);
      setError("Failed to initialize chart");
      setIsLoading(false);
    }
  }, [symbol, timeframe]);

  // Create a unique ID for each widget to avoid conflicts
  const containerId = `tradingview-widget-${symbol}-${timeframe}`.replace(/[^a-zA-Z0-9-]/g, '');

  // Helper function to convert timeframe to TradingView interval
  const getIntervalFromTimeframe = (tf: string): string => {
    switch (tf) {
      case "1D": return "15";  // 15 minutes
      case "1W": return "60";  // 1 hour
      case "1M": return "D";   // 1 day
      case "3M": return "D";   // 1 day
      case "6M": return "D";   // 1 day
      case "1Y": return "W";   // 1 week
      case "5Y": return "M";   // 1 month
      default: return "D";     // Default: 1 day
    }
  };

  return (
    <div className="mt-2 mb-4 border rounded-md overflow-hidden shadow-sm">
      <div className="bg-gray-100 p-2 border-b text-sm font-medium">
        {symbol} Chart - {timeframe} Timeframe
      </div>
      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="w-full h-[300px]" />
            <p className="text-sm text-gray-500 mt-2">Loading TradingView chart...</p>
          </div>
        </div>
      ) : error ? (
        <div className="h-[400px] flex items-center justify-center bg-gray-50 flex-col p-4">
          <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-gray-600 text-center">{error}</p>
          <p className="text-gray-400 text-sm text-center mt-1">
            Please try refreshing or check your connection
          </p>
        </div>
      ) : (
        <div 
          id={containerId}
          ref={containerRef}
          className="w-full h-[400px]"
        />
      )}
    </div>
  );
};
