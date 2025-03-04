
import { useState, useCallback } from 'react';
import { MarketData } from '../types';

export type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'volume' | 'marketCap';
export type SortOrder = 'asc' | 'desc';

export const useMarketTableSort = (favorites: string[]) => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  const sortData = useCallback((data: MarketData[]): MarketData[] => {
    return [...data].sort((a, b) => {
      // Handle favorites first
      const aIsFavorite = favorites.includes(a.symbol);
      const bIsFavorite = favorites.includes(b.symbol);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // Then sort by selected field
      const fieldA = a[sortField] !== undefined ? a[sortField] : 0;
      const fieldB = b[sortField] !== undefined ? b[sortField] : 0;
      
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [favorites, sortField, sortOrder]);

  return {
    sortField,
    sortOrder,
    handleSort,
    sortData
  };
};
