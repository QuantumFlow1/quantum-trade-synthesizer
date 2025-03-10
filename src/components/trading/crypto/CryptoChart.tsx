
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface CryptoChartProps {
  symbol: string;
  timeframe?: string;
}

export function CryptoChart({ symbol, timeframe = '1D' }: CryptoChartProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [chartUrl, setChartUrl] = useState('');
  
  useEffect(() => {
    // Create TradingView widget URL for the specified symbol and timeframe
    const prepareChartUrl = () => {
      // Format the symbol for TradingView (BINANCE:BTCUSDT for most crypto)
      let formattedSymbol = symbol;
      
      // If it's a simple ticker like BTC, ETH, etc. add BINANCE:XXUSDT format
      if (symbol.length <= 5 && !symbol.includes(':')) {
        formattedSymbol = `BINANCE:${symbol}USDT`;
      }
      
      // Get the interval based on timeframe
      let interval = 'D'; // default to daily
      switch (timeframe) {
        case '1H': interval = '60'; break;
        case '4H': interval = '240'; break; 
        case '1D': interval = 'D'; break;
        case '1W': interval = 'W'; break;
        case '1M': interval = 'M'; break;
        default: interval = 'D';
      }
      
      // Create TradingView widget URL
      const baseUrl = 'https://s.tradingview.com/widgetembed/';
      const params = new URLSearchParams({
        symbol: formattedSymbol,
        interval,
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: 'false',
        hide_top_toolbar: 'true',
        hide_legend: 'false',
        save_image: 'false',
        container_id: `tradingview_${symbol.replace(/[^a-zA-Z0-9]/g, '')}`
      });
      
      return `${baseUrl}?${params.toString()}`;
    };
    
    setChartUrl(prepareChartUrl());
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [symbol, timeframe]);
  
  return (
    <Card className="overflow-hidden w-full mt-2 border-muted-foreground/20">
      {isLoading ? (
        <div className="h-[400px] w-full flex flex-col items-center justify-center bg-muted/30">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          <p className="text-sm text-muted-foreground mt-2">Loading {symbol} chart...</p>
          <Skeleton className="h-[200px] w-[90%] mt-4" />
        </div>
      ) : (
        <iframe
          src={chartUrl}
          style={{ width: '100%', height: '400px' }}
          frameBorder="0"
          allowTransparency={true}
          scrolling="no"
          allowFullScreen={true}
        />
      )}
    </Card>
  );
}
