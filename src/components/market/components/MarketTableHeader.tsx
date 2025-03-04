
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
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
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4 text-primary" /> 
      : <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
  };

  const createSortableHeader = (field: SortField, label: string, className: string = '') => (
    <TableHead className={className}>
      <button 
        className="flex items-center focus:outline-none" 
        onClick={() => onSort(field)}
        aria-label={`Sort by ${label}`}
      >
        {label}
        {getSortIcon(field)}
      </button>
    </TableHead>
  );

  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="w-10">Rank</TableHead>
        <TableHead className="w-10"></TableHead>
        {createSortableHeader('name', 'Name', 'w-48')}
        {createSortableHeader('price', 'Price', 'text-right')}
        {createSortableHeader('change24h', '24h %', 'text-right')}
        {createSortableHeader('volume', '24h Volume', 'text-right')}
        {createSortableHeader('marketCap', 'Market Cap', 'text-right')}
        <TableHead className="text-right w-32">Last 7 Days</TableHead>
      </TableRow>
    </TableHeader>
  );
};
