
import React from 'react';
import { Card } from '@/components/ui/card';

const MarketPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Market Overview</h1>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Market Data</h2>
        <p>Market data and insights will be displayed here.</p>
      </Card>
    </div>
  );
};

export default MarketPage;
