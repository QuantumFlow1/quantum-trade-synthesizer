
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { SortField, SortOrder } from '../hooks/useMarketTableSort';

interface MarketTableHeaderProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export const MarketTableHeader: React.FC<MarketTableHeaderProps> = ({
  sortField,
  sortOrder,
  onSort
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">#</TableHead>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-48">
          <div className="flex items-center cursor-pointer" onClick={() => onSort('name')}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center justify-end cursor-pointer" onClick={() => onSort('price')}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center justify-end cursor-pointer" onClick={() => onSort('change24h')}>
            24h %
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center justify-end cursor-pointer" onClick={() => onSort('volume')}>
            24h Volume
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right">
          <div className="flex items-center justify-end cursor-pointer" onClick={() => onSort('marketCap')}>
            Market Cap
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </TableHead>
        <TableHead className="text-right w-32">Last 7 Days</TableHead>
      </TableRow>
    </TableHeader>
  );
};
