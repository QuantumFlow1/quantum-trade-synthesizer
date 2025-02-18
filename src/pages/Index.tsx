
import React from 'react';
import MarketOverview from '@/components/MarketOverview';
import TradeControls from '@/components/TradeControls';
import RiskManagement from '@/components/RiskManagement';
import AutoTrading from '@/components/AutoTrading';

const Index = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <MarketOverview />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TradeControls />
        <RiskManagement />
      </div>
      
      <AutoTrading />
    </div>
  );
};

export default Index;
