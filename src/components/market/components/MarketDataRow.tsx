
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface MarketDataRowProps {
  item: MarketData;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string, e: React.MouseEvent) => void;
  onSelectMarket: (market: MarketData) => void;
}

export const MarketDataRow: React.FC<MarketDataRowProps> = ({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onSelectMarket
}) => {
  const getPriceChangeIcon = (change: number | undefined) => {
    if (change === undefined) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <TableRow 
      key={item.symbol} 
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => onSelectMarket(item)}
    >
      <TableCell className="font-medium">{item.rank || index + 1}</TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={(e) => onToggleFavorite(item.symbol, e)}
        >
          <Star 
            className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        </Button>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <div className="mr-3 bg-gray-100 rounded-full p-1.5">
            <div className="h-6 w-6 flex items-center justify-center font-bold text-xs text-gray-700">
              {item.symbol.substring(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{item.name || item.symbol}</span>
            <span className="text-xs text-gray-500">{item.symbol}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(item.price)}
      </TableCell>
      <TableCell className="text-right">
        <div className={`flex items-center justify-end ${
          item.change24h && item.change24h > 0 
            ? 'text-green-500' 
            : item.change24h && item.change24h < 0 
              ? 'text-red-500' 
              : 'text-gray-500'
        }`}>
          {getPriceChangeIcon(item.change24h)}
          <span className="ml-1">{formatPercentage(item.change24h)}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(item.totalVolume24h || item.volume)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(item.marketCap)}
      </TableCell>
      <TableCell className="text-right">
        <div className="h-8 w-full flex items-center justify-end">
          <BarChart2 className="h-4 w-4 text-gray-400" />
        </div>
      </TableCell>
    </TableRow>
  );
};
