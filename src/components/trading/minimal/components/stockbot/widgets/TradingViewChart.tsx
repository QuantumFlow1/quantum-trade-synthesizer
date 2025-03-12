
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface ChartWidgetProps {
  symbol: string;
  timeframe?: string;
}

export const TradingViewChart: React.FC<ChartWidgetProps> = ({ symbol, timeframe = "1D" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!symbol) {
      setError("No symbol provided");
      setIsLoading(false);
      return;
    }

    console.log(`TradingViewChart: Initializing chart for ${symbol}`);
    setIsLoading(true);
    setError(null);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && typeof window !== 'undefined' && window.TradingView) {
        if (widgetRef.current) {
          containerRef.current.innerHTML = '';
        }

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
            container_id: containerRef.current.id,
            hide_side_toolbar: false,
          });
          setIsLoading(false);
          console.log(`TradingViewChart: Successfully created widget for ${symbol}`);
        } catch (err) {
          console.error("TradingViewChart: Error creating widget:", err);
          setError("Failed to create chart");
          setIsLoading(false);
        }
      }
    };

    script.onerror = () => {
      setError("Failed to load TradingView script");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
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
    <div
      id={`tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '')}`}
      ref={containerRef}
      className="h-[400px] w-full"
    />
  );
};
