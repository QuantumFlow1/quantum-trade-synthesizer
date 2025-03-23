
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface MarketTabListProps {
  activeTab: string;
}

export const MarketTabList: React.FC<MarketTabListProps> = ({ activeTab }) => {
  console.log("MarketTabList rendering with activeTab:", activeTab);
  
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger 
        value="market" 
        className="flex items-center gap-2"
        data-state={activeTab === 'market' ? 'active' : 'inactive'}
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Market Overview</span>
        <span className="sm:hidden">Market</span>
      </TabsTrigger>
      <TabsTrigger 
        value="positions" 
        className="flex items-center gap-2"
        data-state={activeTab === 'positions' ? 'active' : 'inactive'}
      >
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline">Positions</span>
        <span className="sm:hidden">Positions</span>
      </TabsTrigger>
      <TabsTrigger 
        value="transactions" 
        className="flex items-center gap-2"
        data-state={activeTab === 'transactions' ? 'active' : 'inactive'}
      >
        <Activity className="h-4 w-4" />
        <span className="hidden sm:inline">Transactions</span>
        <span className="sm:hidden">Tx</span>
      </TabsTrigger>
    </TabsList>
  );
};
