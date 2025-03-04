
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface MarketTabListProps {
  activeTab: string;
}

export const MarketTabList: React.FC<MarketTabListProps> = ({ activeTab }) => {
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="market" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span>Market Overview</span>
      </TabsTrigger>
      <TabsTrigger value="positions" className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        <span>Positions</span>
      </TabsTrigger>
      <TabsTrigger value="transactions" className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        <span>Transactions</span>
      </TabsTrigger>
    </TabsList>
  );
};
