
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Globe, Activity } from 'lucide-react';

interface MarketTabListProps {
  activeTab: string;
  marketCategories: string[];
}

export const MarketTabList: React.FC<MarketTabListProps> = ({ 
  activeTab, 
  marketCategories = [] 
}) => {
  return (
    <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
      <TabsTrigger value="all" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">All Markets</span>
        <span className="sm:hidden">All</span>
      </TabsTrigger>
      
      {marketCategories.slice(0, 6).map(category => (
        <TabsTrigger 
          key={category} 
          value={category}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">{category}</span>
          <span className="sm:hidden">{category.substring(0, 3)}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
