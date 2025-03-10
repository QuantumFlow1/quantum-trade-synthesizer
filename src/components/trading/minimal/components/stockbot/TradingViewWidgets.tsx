
import React, { useEffect, useRef } from 'react';

interface ChartWidgetProps {
  symbol: string;
  timeframe?: string;
}

export const TradingViewChart: React.FC<ChartWidgetProps> = ({ symbol, timeframe = "1M" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Create script element to load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        if (widgetRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Create a new TradingView widget
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: getIntervalFromTimeframe(timeframe),
          timezone: "exchange",
          theme: "light",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, timeframe]);

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
      <div 
        id={containerId}
        ref={containerRef}
        className="w-full h-[400px]"
      />
    </div>
  );
};

interface HeatmapWidgetProps {
  sector?: string;
}

export const MarketHeatmap: React.FC<HeatmapWidgetProps> = ({ sector = "all" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
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
      <div 
        ref={containerRef}
        className="w-full h-[400px]"
      />
    </div>
  );
};

interface StockNewsProps {
  symbol: string;
  count?: number;
}

export const StockNews: React.FC<StockNewsProps> = ({ symbol, count = 3 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
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
  }, [symbol, count]);

  return (
    <div className="mt-2 mb-4 border rounded-md overflow-hidden shadow-sm">
      <div className="bg-gray-100 p-2 border-b text-sm font-medium">
        {symbol === "market" ? "Market News" : `News for ${symbol}`}
      </div>
      <div 
        ref={containerRef}
        className="w-full h-[400px]"
      />
    </div>
  );
};
