
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpDown, 
  ChevronDown, 
  Star, 
  BarChart2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MarketData } from './types';

interface EnhancedMarketDataTableProps {
  data: MarketData[];
  onSelectMarket: (market: MarketData) => void;
}

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume' | 'marketCap';
type SortOrder = 'asc' | 'desc';

export const EnhancedMarketDataTable: React.FC<EnhancedMarketDataTableProps> = ({ 
  data, 
  onSelectMarket 
}) => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(symbol)) {
      setFavorites(favorites.filter(fav => fav !== symbol));
    } else {
      setFavorites([...favorites, symbol]);
    }
  };

  const formatNumber = (num: number | undefined, decimals = 2): string => {
    if (num === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    }).format(num);
  };

  const formatCurrency = (num: number | undefined): string => {
    if (num === undefined) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number | undefined): string => {
    if (num === undefined) return 'N/A';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const sortedData = [...data].sort((a, b) => {
    // Handle favorites first
    if (favorites.includes(a.symbol) && !favorites.includes(b.symbol)) return -1;
    if (!favorites.includes(a.symbol) && favorites.includes(b.symbol)) return 1;

    // Then sort by selected field
    const fieldA = a[sortField] !== undefined ? a[sortField] : 0;
    const fieldB = b[sortField] !== undefined ? b[sortField] : 0;
    
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getPriceChangeIcon = (change: number | undefined) => {
    if (change === undefined) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="w-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filter by <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                All Cryptocurrencies
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('favorites')}>
                Favorites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('defi')}>
                DeFi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('nft')}>
                NFT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('layer1')}>
                Layer 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory('layer2')}>
                Layer 2
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-48">
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('price')}>
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('change24h')}>
                24h %
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('volume')}>
                24h Volume
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort('marketCap')}>
                Market Cap
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right w-32">Last 7 Days</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.filter(item => {
            if (filterCategory === 'all') return true;
            if (filterCategory === 'favorites') return favorites.includes(item.symbol);
            // Additional filters could be implemented based on categories
            return true;
          }).map((item, index) => (
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
                  onClick={(e) => toggleFavorite(item.symbol, e)}
                >
                  <Star 
                    className={`h-4 w-4 ${favorites.includes(item.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
