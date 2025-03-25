
import React from 'react';
import { Card } from '@/components/ui/card';

const PortfolioPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Portfolio Management</h1>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
        <p>Your portfolio details will be displayed here.</p>
      </Card>
    </div>
  );
};

export default PortfolioPage;
