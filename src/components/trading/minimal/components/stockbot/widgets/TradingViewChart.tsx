
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ChartWidgetProps {
  symbol: string;
  timeframe?: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewChart: React.FC<ChartWidgetProps> = ({ symbol, timeframe = "1D" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!symbol) {
      setError("No symbol provided");
      setIsLoading(false);
      return;
    }

    console.log(`TradingViewChart: Starting initialization for ${symbol}`);
    setIsLoading(true);
    setError(null);

    // Cleanup previous widget if it exists
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create unique container ID for this chart instance
    const containerId = `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '')}_${Math.random().toString(36).substring(7)}`;
    
    if (containerRef.current) {
      containerRef.current.id = containerId;
    }

    // Remove any existing TradingView script
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current);
    }

    // Create new script element
    const script = document.createElement('script');
    scriptRef.current = script;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && typeof window.TradingView !== 'undefined') {
        console.log(`TradingViewChart: Script loaded, creating widget for ${symbol}`);
        
        try {
          widgetRef.current = new window.TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: timeframe === "1D" ? "15" : "D",
            timezone: "exchange",
            theme: "light",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: containerId,
            hide_side_toolbar: false,
            height: "400",
            width: "100%",
            toolbar_bg: "#f1f3f6",
            withdateranges: true,
            hide_legend: false,
            save_image: false,
          });

          // Add load handler to widget
          widgetRef.current.onChartReady(() => {
            console.log(`TradingViewChart: Widget ready for ${symbol}`);
            setIsLoading(false);
          });
        } catch (err) {
          console.error("TradingViewChart: Error creating widget:", err);
          setError("Failed to create chart");
          setIsLoading(false);
        }
      }
    };

    script.onerror = () => {
      console.error("TradingViewChart: Failed to load TradingView script");
      setError("Failed to load TradingView script");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, timeframe]);

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-red-50 rounded-lg">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[400px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
      <div 
        ref={containerRef}
        className="h-full w-full"
      />
    </div>
  );
};
