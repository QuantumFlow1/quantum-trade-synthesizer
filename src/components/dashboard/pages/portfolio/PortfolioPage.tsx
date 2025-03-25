
import React from 'react';
import { Card } from '@/components/ui/card';
import { QuantumPortfolioOptimizer } from '@/components/portfolio/QuantumPortfolioOptimizer';
import { PortfolioOptimizationResults } from '@/components/portfolio/PortfolioOptimizationResults';

const PortfolioPage: React.FC = () => {
  // Start with some default portfolio metrics
  const defaultMetrics = {
    expectedReturn: 9.75,
    totalCost: 87240.25,
    objectiveValue: 0.876
  };
  
  // Default portfolio assets
  const defaultPortfolio = [
    { symbol: 'BTC', price: 83924, expectedReturn: 0.15, allocation: 48.2 },
    { symbol: 'ETH', price: 1964.32, expectedReturn: 0.09, allocation: 22.5 },
    { symbol: 'SOL', price: 126.35, expectedReturn: 0.12, allocation: 29.3 }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Portfolio Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Portfolio Optimization</h2>
          <QuantumPortfolioOptimizer />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Optimization Results</h2>
          <PortfolioOptimizationResults 
            portfolio={defaultPortfolio}
            metrics={defaultMetrics}
            budget={100000}
          />
        </Card>
      </div>
    </div>
  );
};

export default PortfolioPage;
