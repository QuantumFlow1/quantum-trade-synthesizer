
import React from 'react';
import { 
  BarChart3, 
  CandlestickChart, 
  LineChart, 
  ArrowUpDown, 
  CircleDollarSign, 
  Badge, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface TradingToolbarProps {
  chartType: string;
  setChartType: (type: string) => void;
  selectedPosition?: any;
  assetType?: 'crypto' | 'stock' | 'forex' | 'commodity';
  assetSymbol?: string;
}

export const TradingToolbar: React.FC<TradingToolbarProps> = ({ 
  chartType, 
  setChartType, 
  selectedPosition,
  assetType = 'crypto',
  assetSymbol = 'BTC/USDT'
}) => {
  // Format the price based on asset type
  const formatPrice = (price: number) => {
    if (assetType === 'forex') {
      return price.toFixed(4);
    } else if (price < 1 && assetType === 'crypto') {
      return price.toFixed(6);
    } else {
      return formatCurrency(price);
    }
  };

  // Get display text based on asset type
  const getAssetDisplay = () => {
    switch (assetType) {
      case 'crypto':
        return 'Cryptocurrency';
      case 'stock':
        return 'Stock';
      case 'forex':
        return 'Forex Pair';
      case 'commodity':
        return 'Commodity';
      default:
        return 'Asset';
    }
  };

  return (
    <div className="p-4 pb-0 border-b">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          {assetType === 'crypto' && <CircleDollarSign className="h-5 w-5 text-yellow-500" />}
          {assetType === 'stock' && <Badge className="h-5 w-5 text-blue-500" />}
          {assetType === 'forex' && <ArrowUpDown className="h-5 w-5 text-green-500" />}
          {assetType === 'commodity' && <BarChart3 className="h-5 w-5 text-orange-500" />}
          
          <div>
            <h3 className="font-bold">
              {selectedPosition ? selectedPosition.symbol : assetSymbol}
            </h3>
            <p className="text-xs text-muted-foreground">
              {getAssetDisplay()}
            </p>
          </div>
          
          {selectedPosition && (
            <BadgeComponent variant={selectedPosition.type === 'long' ? 'default' : 'destructive'} className="ml-2">
              {selectedPosition.type.toUpperCase()}
            </BadgeComponent>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {selectedPosition ? (
            <>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Entry Price</div>
                <div className="font-mono">{formatPrice(selectedPosition.entry_price)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Current</div>
                <div className="font-mono">{formatPrice(selectedPosition.current_price)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">P/L</div>
                <div className={`font-mono ${selectedPosition.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPrice(selectedPosition.profit_loss)} ({formatPercentage(selectedPosition.profit_loss_percentage)})
                </div>
              </div>
            </>
          ) : (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Current Price</div>
              <div className="font-mono font-medium">{formatPrice(
                assetType === 'crypto' ? 42000 : 
                assetType === 'stock' ? 175.43 : 
                assetType === 'forex' ? 1.0921 : 
                1800.50
              )}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-1">
          <Button 
            variant={chartType === 'candle' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setChartType('candle')}
          >
            <CandlestickChart className="h-4 w-4" />
          </Button>
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartType('line')}
          >
            <LineChart className="h-4 w-4" />
          </Button>
          <Button 
            variant={chartType === 'bar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </div>
    </div>
  );
};
