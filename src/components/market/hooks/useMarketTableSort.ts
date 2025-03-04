
import { useState } from 'react';
import { MarketData } from '../types';

export type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume' | 'marketCap';
export type SortOrder = 'asc' | 'desc';

export const useMarketTableSort = (favorites: string[]) => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortData = (data: MarketData[]): MarketData[] => {
    return [...data].sort((a, b) => {
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
  };

  return {
    sortField,
    sortOrder,
    handleSort,
    sortData
  };
};
