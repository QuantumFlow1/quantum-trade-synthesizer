
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface StockNewsProps {
  symbol: string;
  count?: number;
}

export const StockNews: React.FC<StockNewsProps> = ({ symbol, count = 3 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create script element to load TradingView widget script
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.async = true;
      
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        isTransparent: false,
        displayMode: "regular",
        width: "100%",
        height: "400",
        locale: "en",
        feedMode: "symbol",
        symbol: symbol === "market" ? "SPY" : symbol
      });
      
      // Set up onload and onerror handlers
      script.onload = () => {
        setIsLoading(false);
      };
      
      script.onerror = () => {
        console.error("Failed to load TradingView news script");
        setError("Failed to load stock news");
        setIsLoading(false);
      };

      // Append the script to the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(script);
        widgetRef.current = script;
      }

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (e) {
      console.error("Error setting up news widget:", e);
      setError("Failed to initialize news feed");
      setIsLoading(false);
    }
  }, [symbol, count]);

  return (
    <div className="mt-2 mb-4 border rounded-md overflow-hidden shadow-sm">
      <div className="bg-gray-100 p-2 border-b text-sm font-medium">
        {symbol === "market" ? "Market News" : `News for ${symbol}`}
      </div>
      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Skeleton className="w-full h-full" />
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
          ref={containerRef}
          className="w-full h-[400px]"
        />
      )}
    </div>
  );
};
