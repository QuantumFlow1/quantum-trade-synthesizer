
import { MarketData } from '@/components/market/types';

/**
 * Filters market data based on search term and active tab
 */
export const filterMarketData = (
  data: MarketData[], 
  search: string, 
  tab: string
): MarketData[] => {
  if (!Array.isArray(data)) {
    console.error('filterData received non-array data:', data);
    return [];
  }
  
  let filtered = [...data];
  
  // Apply search filter
  if (search.trim() !== '') {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      item => item.symbol?.toLowerCase().includes(searchLower) || 
      (item.name && item.name.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply tab filter
  if (tab !== 'all') {
    filtered = filtered.filter(item => item.market === tab);
  }
  
  return filtered;
};

/**
 * Extracts unique market categories from market data
 */
export const getMarketCategories = (marketData: MarketData[]): string[] => {
  if (!Array.isArray(marketData) || marketData.length === 0) {
    return [];
  }
  
  const categories = new Set<string>();
  
  marketData.forEach(item => {
    if (item && item.market) {
      categories.add(item.market);
    }
  });
  
  return Array.from(categories);
};
