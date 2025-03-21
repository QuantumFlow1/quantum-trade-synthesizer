
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { MarketData } from './types';
import { useMarketTableSort } from './hooks/useMarketTableSort';
import { useFavoritesManager } from './hooks/useFavoritesManager';
import { MarketTableHeader } from './components/MarketTableHeader';
import { MarketDataRow } from './components/MarketDataRow';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EnhancedMarketDataTableProps {
  data: MarketData[];
  onSelectMarket: (market: MarketData) => void;
}

export const EnhancedMarketDataTable: React.FC<EnhancedMarketDataTableProps> = ({ 
  data, 
  onSelectMarket 
}) => {
  const { favorites, toggleFavorite } = useFavoritesManager();
  const { sortField, sortOrder, handleSort, sortData } = useMarketTableSort(favorites);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const sortedData = sortData(data);

  return (
    <div className="w-full">
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

      <ScrollArea className="h-[calc(100vh-25rem)]">
        <Table>
          <MarketTableHeader 
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <TableBody>
            {sortedData.filter(item => {
              if (filterCategory === 'all') return true;
              if (filterCategory === 'favorites') return favorites.includes(item.symbol);
              // Additional filters could be implemented based on categories
              return true;
            }).map((item, index) => (
              <MarketDataRow
                key={item.symbol}
                item={item}
                index={index}
                isFavorite={favorites.includes(item.symbol)}
                onToggleFavorite={toggleFavorite}
                onSelectMarket={onSelectMarket}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
