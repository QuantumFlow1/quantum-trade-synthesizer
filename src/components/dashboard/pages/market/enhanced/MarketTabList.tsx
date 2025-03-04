
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Globe, Activity, TrendingUp } from 'lucide-react';

interface MarketTabListProps {
  activeTab: string;
  marketCategories: string[];
}

export const MarketTabList: React.FC<MarketTabListProps> = ({ 
  activeTab, 
  marketCategories = [] 
}) => {
  // Ensure we have some default categories even if none are provided
  const displayCategories = marketCategories.length > 0 
    ? marketCategories.slice(0, 6) 
    : ['Stocks', 'Crypto', 'Forex', 'Commodities'];
  
  // Set of icons to use for different market types
  const getIconForCategory = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('crypto')) return <TrendingUp className="h-4 w-4" />;
    if (lower.includes('forex')) return <Activity className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };
  
  return (
    <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
      <TabsTrigger value="all" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">All Markets</span>
        <span className="sm:hidden">All</span>
      </TabsTrigger>
      
      {displayCategories.map(category => (
        <TabsTrigger 
          key={category} 
          value={category}
          className="flex items-center gap-2"
        >
          {getIconForCategory(category)}
          <span className="hidden sm:inline">{category}</span>
          <span className="sm:hidden">{category.substring(0, 3)}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
