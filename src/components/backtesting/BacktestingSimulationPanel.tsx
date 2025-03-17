
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import { Play, Pause, RotateCcw, Save, FileDown, ChevronsRight, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for backtesting
interface BacktestResult {
  equity: number[];
  returns: number[];
  drawdowns: number[];
  trades: {
    entryDate: string;
    exitDate: string;
    entryPrice: number;
    exitPrice: number;
    profitLoss: number;
    profitLossPercent: number;
    direction: 'long' | 'short';
  }[];
  metrics: {
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    winRate: number;
    profitFactor: number;
    averageTrade: number;
    averageWin: number;
    averageLoss: number;
    totalTrades: number;
  };
}

export function BacktestingSimulationPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('movingAverageCross');
  const [timeframe, setTimeframe] = useState('1d');
  const [initialCapital, setInitialCapital] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(1); // percentage
  const [optimizationLevel, setOptimizationLevel] = useState(50);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const { toast } = useToast();
  
  // Mock strategies
  const strategies = [
    { value: 'movingAverageCross', label: 'Moving Average Crossover' },
    { value: 'rsiBounce', label: 'RSI Bounce Strategy' },
    { value: 'bollingerBreakout', label: 'Bollinger Band Breakout' },
    { value: 'ichimokuCloud', label: 'Ichimoku Cloud Strategy' },
    { value: 'macdCrossover', label: 'MACD Crossover Strategy' },
    { value: 'meanReversion', label: 'Mean Reversion Strategy' },
  ];
  
  // Run backtest simulation
  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    
    toast({
      title: "Backtest Started",
      description: `Running ${strategies.find(s => s.value === selectedStrategy)?.label} on ${timeframe} timeframe`,
    });
    
    // Simulate progress
    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalId);
          setIsRunning(false);
          // Generate mock result when complete
          generateMockBacktestResult();
          return 100;
        }
        return prev + 2;
      });
    }, 150);
  };
  
  const stopBacktest = () => {
    setIsRunning(false);
    toast({
      title: "Backtest Stopped",
      description: "Backtest simulation has been stopped",
      variant: "destructive"
    });
  };
  
  const resetBacktest = () => {
    setIsRunning(false);
    setProgress(0);
    setBacktestResult(null);
  };
  
  // Generate a mock backtest result
  const generateMockBacktestResult = () => {
    // Mock equity curve
    const equity = [initialCapital];
    const returns = [0];
    const drawdowns = [0];
    
    // Generate mock equity curve with some randomness
    for (let i = 1; i <= 100; i++) {
      const changePercent = (Math.random() * 2 - 0.5) * 0.8; // -0.5% to 1.5%
      const newEquity = equity[i-1] * (1 + changePercent / 100);
      equity.push(newEquity);
      
      // Calculate return
      const dailyReturn = (newEquity / equity[i-1] - 1) * 100;
      returns.push(dailyReturn);
      
      // Mock drawdown calculation
      const maxEquity = Math.max(...equity);
      const drawdown = ((maxEquity - newEquity) / maxEquity) * 100;
      drawdowns.push(drawdown);
    }
    
    // Generate mock trades
    const trades = [];
    let currentEquity = initialCapital;
    
    for (let i = 0; i < 20; i++) {
      const isProfit = Math.random() > 0.4; // 60% win rate
      const entryPrice = Math.random() * 1000 + 5000; // Random price between 5000-6000
      const percentChange = (Math.random() * 4 + 1) * (isProfit ? 1 : -1); // 1-5% change
      const exitPrice = entryPrice * (1 + percentChange / 100);
      const profitLoss = currentEquity * (percentChange / 100);
      
      trades.push({
        entryDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        exitDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        entryPrice,
        exitPrice,
        profitLoss,
        profitLossPercent: percentChange,
        direction: Math.random() > 0.3 ? 'long' : 'short'
      });
      
      currentEquity += profitLoss;
    }
    
    // Sort trades by date
    trades.sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime());
    
    // Generate metrics
    const winningTrades = trades.filter(t => t.profitLoss > 0);
    const losingTrades = trades.filter(t => t.profitLoss <= 0);
    
    const metrics = {
      totalReturn: (equity[equity.length - 1] / initialCapital - 1) * 100,
      maxDrawdown: Math.max(...drawdowns),
      sharpeRatio: (Math.random() * 1 + 0.5).toFixed(2),
      winRate: (winningTrades.length / trades.length) * 100,
      profitFactor: Math.abs(
        winningTrades.reduce((sum, t) => sum + t.profitLoss, 0) / 
        losingTrades.reduce((sum, t) => sum + t.profitLoss, -1)
      ),
      averageTrade: trades.reduce((sum, t) => sum + t.profitLoss, 0) / trades.length,
      averageWin: winningTrades.reduce((sum, t) => sum + t.profitLoss, 0) / winningTrades.length,
      averageLoss: losingTrades.reduce((sum, t) => sum + t.profitLoss, 0) / losingTrades.length,
      totalTrades: trades.length
    };
    
    const result: BacktestResult = {
      equity,
      returns,
      drawdowns,
      trades,
      metrics
    };
    
    setBacktestResult(result);
    
    toast({
      title: "Backtest Complete",
      description: `Total Return: ${result.metrics.totalReturn.toFixed(2)}%, Win Rate: ${result.metrics.winRate.toFixed(2)}%`,
    });
  };
  
  // Generate data for charts
  const generateEquityChartData = () => {
    if (!backtestResult) return [];
    
    return backtestResult.equity.map((value, index) => ({
      index,
      equity: value,
      return: index > 0 ? backtestResult.returns[index] : 0,
      drawdown: backtestResult.drawdowns[index]
    }));
  };
  
  const equityChartData = generateEquityChartData();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Strategy Backtesting Simulator
          </div>
          <div className="space-x-2">
            {isRunning ? (
              <Button variant="destructive" size="sm" onClick={stopBacktest}>
                <Pause className="h-4 w-4 mr-1" /> Stop
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={runBacktest} disabled={progress === 100 && backtestResult !== null}>
                <Play className="h-4 w-4 mr-1" /> Run Backtest
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={resetBacktest}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trading Strategy</label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Capital</label>
              <Input 
                type="number" 
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                min={1000}
                max={1000000}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Per Trade (%)</label>
              <div className="pt-2">
                <Slider
                  value={[riskPerTrade]}
                  min={0.1}
                  max={10}
                  step={0.1}
                  onValueChange={(values) => setRiskPerTrade(values[0])}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>0.1%</span>
                  <span>{riskPerTrade}%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select defaultValue="1y">
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                  <SelectItem value="5y">Last 5 Years</SelectItem>
                  <SelectItem value="all">All Available Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimization Level</label>
              <div className="pt-2">
                <Slider
                  value={[optimizationLevel]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={(values) => setOptimizationLevel(values[0])}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>None</span>
                  <span>{optimizationLevel}%</span>
                  <span>Max</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        {progress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Backtest Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Results section */}
        {backtestResult && (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total Return</div>
                  <div className={`text-xl font-bold ${backtestResult.metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {backtestResult.metrics.totalReturn.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-xl font-bold">
                    {backtestResult.metrics.winRate.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  <div className="text-xl font-bold text-red-500">
                    {backtestResult.metrics.maxDrawdown.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Profit Factor</div>
                  <div className="text-xl font-bold">
                    {backtestResult.metrics.profitFactor.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Equity curve chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equity Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={equityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="index" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#4ade80" 
                      dot={false} 
                      name="Equity" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drawdown chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Drawdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={equityChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="index" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="drawdown" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        dot={false} 
                        name="Drawdown %" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Returns distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Returns Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={equityChartData.filter((_, i) => i > 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="index" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip />
                      <Bar 
                        dataKey="return" 
                        name="Return %" 
                        fill={(entry) => entry.return >= 0 ? "#4ade80" : "#ef4444"}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Trades table */}
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Trade History</CardTitle>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-1" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-xs font-medium text-left p-2">Entry Date</th>
                          <th className="text-xs font-medium text-left p-2">Exit Date</th>
                          <th className="text-xs font-medium text-left p-2">Direction</th>
                          <th className="text-xs font-medium text-left p-2">Entry Price</th>
                          <th className="text-xs font-medium text-left p-2">Exit Price</th>
                          <th className="text-xs font-medium text-left p-2">P/L</th>
                          <th className="text-xs font-medium text-left p-2">P/L %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backtestResult.trades.slice(0, 10).map((trade, index) => (
                          <tr key={index} className="border-t border-muted">
                            <td className="text-xs p-2">{trade.entryDate}</td>
                            <td className="text-xs p-2">{trade.exitDate}</td>
                            <td className="text-xs p-2">
                              <Badge variant={trade.direction === 'long' ? 'default' : 'secondary'}>
                                {trade.direction}
                              </Badge>
                            </td>
                            <td className="text-xs p-2">${trade.entryPrice.toFixed(2)}</td>
                            <td className="text-xs p-2">${trade.exitPrice.toFixed(2)}</td>
                            <td className={`text-xs p-2 ${trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ${trade.profitLoss.toFixed(2)}
                            </td>
                            <td className={`text-xs p-2 ${trade.profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {trade.profitLossPercent.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {backtestResult.trades.length > 10 && (
                    <div className="flex items-center justify-center p-2 border-t border-muted text-xs text-muted-foreground">
                      <Button variant="ghost" size="sm">
                        View All Trades <ChevronsRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
