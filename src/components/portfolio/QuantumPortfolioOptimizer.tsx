
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/lib/supabase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { RotateCw, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function QuantumPortfolioOptimizer() {
  // Portfolio weights
  const [weights, setWeights] = useState({
    returnWeight: 1,
    budgetWeight: 2,
    diversificationWeight: 0.5
  });

  // Budget
  const [budget, setBudget] = useState(100000);
  
  // Fetch portfolio data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['portfolio-optimization', weights, budget],
    queryFn: async () => {
      const assets = [
        { symbol: 'BTC', price: 83924, expectedReturn: 0.15 },
        { symbol: 'ETH', price: 1964.32, expectedReturn: 0.09 },
        { symbol: 'XRP', price: 2.40, expectedReturn: 0.08 },
        { symbol: 'BNB', price: 635.18, expectedReturn: 0.10 },
        { symbol: 'SOL', price: 126.35, expectedReturn: 0.12 }
      ];
      
      const { data, error } = await supabase.functions.invoke('quantum-portfolio', {
        body: { assets, budget, weights }
      });
      
      if (error) throw new Error(error.message);
      if (!data.success) throw new Error(data.error || 'Unknown error occurred');
      
      // Process portfolio allocation data
      const portfolio = data.solution.selectedAssets.map((symbol: string, idx: number) => {
        const asset = assets.find(a => a.symbol === symbol);
        const quantity = data.solution.binaryVector[idx];
        return {
          symbol,
          allocation: (asset?.price || 0) / data.solution.totalCost * 100,
          quantity,
          price: asset?.price || 0,
          expectedReturn: asset?.expectedReturn || 0
        };
      });
      
      return {
        portfolio,
        solution: data.solution,
        qubo: data.qubo,
        metrics: {
          totalCost: data.solution.totalCost,
          expectedReturn: data.solution.expectedReturn,
          budgetUtilization: (data.solution.totalCost / budget) * 100
        }
      };
    }
  });
  
  // Handle refetch button click
  const handleRefetch = () => {
    refetch();
  };
  
  // Update weights
  const updateWeight = (weightType: keyof typeof weights, value: number[]) => {
    setWeights(prev => ({
      ...prev,
      [weightType]: value[0]
    }));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Optimization Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Return Weight: {weights.returnWeight}</Label>
            <Slider 
              value={[weights.returnWeight]} 
              min={0.1} 
              max={3} 
              step={0.1} 
              onValueChange={(value) => updateWeight('returnWeight', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Budget Weight: {weights.budgetWeight}</Label>
            <Slider 
              value={[weights.budgetWeight]} 
              min={0.1} 
              max={3} 
              step={0.1} 
              onValueChange={(value) => updateWeight('budgetWeight', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Diversification Weight: {weights.diversificationWeight}</Label>
            <Slider 
              value={[weights.diversificationWeight]} 
              min={0.1} 
              max={3} 
              step={0.1} 
              onValueChange={(value) => updateWeight('diversificationWeight', value)}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => handleRefetch()} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Optimize Portfolio
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to optimize portfolio'}
          </AlertDescription>
        </Alert>
      )}
      
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.portfolio}
                    dataKey="allocation"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ symbol, allocation }) => `${symbol} (${allocation.toFixed(2)}%)`}
                  >
                    {data.portfolio.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {data.portfolio.map((asset: any) => (
                  <div key={asset.symbol} className="flex justify-between">
                    <span>{asset.symbol}</span>
                    <span>${asset.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Total Cost</h3>
                  <p className="text-2xl font-bold">${data.metrics.totalCost.toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Expected Return</h3>
                  <p className={`text-2xl font-bold ${data.metrics.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(data.metrics.expectedReturn * 100).toFixed(2)}%
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Budget Utilization</h3>
                  <p className="text-2xl font-bold">{data.metrics.budgetUtilization.toFixed(2)}%</p>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Asset Allocation</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.portfolio}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="symbol" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)}%`, 'Allocation']} />
                      <Bar dataKey="allocation" fill="#8884d8">
                        {data.portfolio.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
