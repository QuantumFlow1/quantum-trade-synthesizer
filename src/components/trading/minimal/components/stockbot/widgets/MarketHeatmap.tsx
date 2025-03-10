
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface HeatmapWidgetProps {
  sector?: string;
}

export const MarketHeatmap: React.FC<HeatmapWidgetProps> = ({ sector = "all" }) => {
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
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
      script.async = true;
      
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        dateRange: "1D",
        exchange: "US",
        showChart: true,
        locale: "en",
        largeChartUrl: "",
        isTransparent: false,
        showSymbolLogo: true,
        plotLineColorGrowing: "rgba(60, 188, 152, 1)",
        plotLineColorFalling: "rgba(255, 74, 104, 1)",
        gridLineColor: "rgba(238, 238, 238, 1)",
        scaleFontColor: "rgba(82, 82, 82, 1)",
        belowLineFillColorGrowing: "rgba(60, 188, 152, 0.05)",
        belowLineFillColorFalling: "rgba(255, 74, 104, 0.05)",
        symbolActiveColor: "rgba(242, 250, 254, 1)",
        tabs: [
          {
            title: sector !== "all" ? sector : "All",
            symbols: getSymbolsForSector(sector)
          }
        ]
      });

      // Set up onload and onerror handlers
      script.onload = () => {
        setIsLoading(false);
      };
      
      script.onerror = () => {
        console.error("Failed to load TradingView heatmap script");
        setError("Failed to load market heatmap");
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
      console.error("Error setting up market heatmap:", e);
      setError("Failed to initialize heatmap");
      setIsLoading(false);
    }
  }, [sector]);

  // Helper function to get symbols based on sector
  const getSymbolsForSector = (sector: string): any[] => {
    // Default to S&P 500
    if (sector === "all") {
      return [
        { "s": "SPY", "d": "S&P 500" },
        { "s": "QQQ", "d": "Nasdaq 100" },
        { "s": "DIA", "d": "Dow Jones" }
      ];
    }
    // Technology sector
    else if (sector.toLowerCase() === "technology") {
      return [
        { "s": "AAPL", "d": "Apple" },
        { "s": "MSFT", "d": "Microsoft" },
        { "s": "GOOGL", "d": "Alphabet" },
        { "s": "AMZN", "d": "Amazon" },
        { "s": "META", "d": "Meta" },
        { "s": "NVDA", "d": "NVIDIA" }
      ];
    }
    // Energy sector
    else if (sector.toLowerCase() === "energy") {
      return [
        { "s": "XOM", "d": "Exxon Mobil" },
        { "s": "CVX", "d": "Chevron" },
        { "s": "COP", "d": "ConocoPhillips" },
        { "s": "SLB", "d": "Schlumberger" }
      ];
    }
    // Financial sector
    else if (sector.toLowerCase() === "financial") {
      return [
        { "s": "JPM", "d": "JP Morgan" },
        { "s": "BAC", "d": "Bank of America" },
        { "s": "WFC", "d": "Wells Fargo" },
        { "s": "C", "d": "Citigroup" }
      ];
    }
    // Default to general market
    return [
      { "s": "SPY", "d": "S&P 500" },
      { "s": "QQQ", "d": "Nasdaq 100" }
    ];
  };

  return (
    <div className="mt-2 mb-4 border rounded-md overflow-hidden shadow-sm">
      <div className="bg-gray-100 p-2 border-b text-sm font-medium">
        Market Heatmap {sector !== "all" ? `- ${sector} Sector` : ""}
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
