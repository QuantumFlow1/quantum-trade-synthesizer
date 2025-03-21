
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioAsset {
  symbol: string;
  price: number;
  expectedReturn: number;
  allocation?: number;
  quantity?: number;
}

interface PortfolioOptimizationResultsProps {
  portfolio: PortfolioAsset[];
  metrics: {
    expectedReturn: number;
    totalCost: number;
    objectiveValue: number;
  };
  budget: number;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#A4DE6C', '#D0ED57', '#FAACC5', '#F06292'
];

export const PortfolioOptimizationResults: React.FC<PortfolioOptimizationResultsProps> = ({ 
  portfolio, 
  metrics, 
  budget 
}) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Optimization Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No optimized portfolio available. Run optimization first.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for pie chart
  const pieData = portfolio.map((asset, index) => ({
    name: asset.symbol,
    value: asset.allocation,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate budget utilization as a percentage
  const budgetUtilization = (metrics.totalCost / budget) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Optimal Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio.map((asset) => (
              <div key={asset.symbol} className="space-y-1">
                <div className="font-medium">{asset.symbol}</div>
                <div className="text-sm text-muted-foreground">Price: ${asset.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div className="text-sm">
                  <span className="font-medium">Allocation: </span>
                  {asset.allocation?.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="font-medium">${metrics.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Expected Return</div>
                <div className={`font-medium ${metrics.expectedReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.expectedReturn.toFixed(2)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Budget Utilization</div>
                <div className="font-medium">{budgetUtilization.toFixed(2)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value.toFixed(2)}%`, 'Allocation']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QUBO Formulation</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="mb-4">
            The portfolio was optimized using a Quantum-inspired approach with the following QUBO formulation:
          </p>
          <pre className="p-4 bg-muted rounded-md overflow-x-auto">
            {`f(x) = -θ₁∑ᵢxᵢrᵢ + θ₂(∑ᵢxᵢpᵢ - b)² + θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ`}
          </pre>
          <p className="mt-4">Where:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>xᵢ ∈ {'{0,1}'} are binary variables (1 = buy, 0 = don't buy)</li>
            <li>rᵢ = expected return of asset i</li>
            <li>pᵢ = price of asset i</li>
            <li>b = budget constraint (${budget.toLocaleString()})</li>
            <li>θ₁, θ₂, θ₃ = weights for returns, budget, and diversification</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
