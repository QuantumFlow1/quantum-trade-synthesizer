
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MarketTabListProps {
  activeTab: string;
  marketCategories: string[];
}

export const MarketTabList: React.FC<MarketTabListProps> = ({ 
  activeTab, 
  marketCategories 
}) => {
  return (
    <TabsList className="mb-4 flex overflow-x-auto">
      <TabsTrigger value="all">All Markets</TabsTrigger>
      {marketCategories.map(category => (
        <TabsTrigger key={category} value={category}>
          {category}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
