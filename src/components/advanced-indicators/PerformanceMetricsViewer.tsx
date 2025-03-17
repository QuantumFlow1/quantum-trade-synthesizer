import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, TrendingUp, BarChart3, Share2, RefreshCw, Wallet, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function PerformanceMetricsViewer() {
  // Sample performance data
  const performanceData = {
    tradingPerformance: {
      totalReturn: 42.8,
      month1Return: 3.6,
      month3Return: 12.4,
      month6Return: 24.5,
      yearToDate: 36.2,
      maxDrawdown: 15.2,
      sharpeRatio: 1.8,
      volatility: 9.6,
      winRate: 65.2,
      winLossRatio: 2.3,
      averageWin: 4.8,
      averageLoss: -2.1,
      profitFactor: 2.8,
      dailyReturns: [0.2, -0.3, 0.5, 0.7, -0.2, 0.4, 0.1, -0.8, 0.6, 0.3, -0.1, 0.2, 0.4, -0.2, 0.5],
      monthlyReturns: [
        { name: 'Jan', return: 2.6 },
        { name: 'Feb', return: 3.5 },
        { name: 'Mar', return: -1.8 },
        { name: 'Apr', return: 4.2 },
        { name: 'May', return: 3.6 },
        { name: 'Jun', return: 1.2 }
      ],
      assetAllocation: [
        { name: 'Stocks', value: 45 },
        { name: 'Crypto', value: 25 },
        { name: 'Forex', value: 20 },
        { name: 'Commodities', value: 10 }
      ],
      tradingStrategies: [
        { name: 'Trend Following', winRate: 72, return: 18.5 },
        { name: 'Mean Reversion', winRate: 58, return: 12.2 },
        { name: 'Breakout', winRate: 52, return: 8.4 },
        { name: 'Volatility', winRate: 65, return: 10.5 }
      ]
    }
  };
  
  // Colors for charts
  const COLORS = ['#4ade80', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  
  // Generate data for equity curve chart
  const generateEquityCurveData = () => {
    const data = [];
    let equity = 10000; // Starting equity
    
    for (let i = 0; i < 180; i++) {
      const change = (Math.random() * 2 - 0.6) * 0.5; // Daily change between -0.6% and 1.4%
      equity = equity * (1 + change / 100);
      
      data.push({
        day: i,
        equity: equity
      });
    }
    
    return data;
  };
  
  const equityCurveData = generateEquityCurveData();
  
  // Helper function to get color based on value
  const getReturnColor = (value: number) => {
    return value >= 0 ? "#4ade80" : "#ef4444";
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            Performance Metrics Dashboard
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="returns">Returns Analysis</TabsTrigger>
            <TabsTrigger value="strategies">Strategy Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Key metrics summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Return</p>
                      <p className="text-2xl font-bold text-green-500">
                        +{performanceData.tradingPerformance.totalReturn}%
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-2xl font-bold">
                        {performanceData.tradingPerformance.sharpeRatio}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <BarChart className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-2xl font-bold">
                        {performanceData.tradingPerformance.winRate}%
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Max Drawdown</p>
                      <p className="text-2xl font-bold text-red-500">
                        -{performanceData.tradingPerformance.maxDrawdown}%
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-red-500" />
                    </div>
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
                  <LineChart data={equityCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="#888888" />
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
            
            {/* Asset allocation & performance metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={performanceData.tradingPerformance.assetAllocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {performanceData.tradingPerformance.assetAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span>{performanceData.tradingPerformance.winRate}%</span>
                    </div>
                    <Progress value={performanceData.tradingPerformance.winRate} max={100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profit Factor</span>
                      <span>{performanceData.tradingPerformance.profitFactor}</span>
                    </div>
                    <Progress 
                      value={Math.min(performanceData.tradingPerformance.profitFactor * 25, 100)} 
                      max={100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sharpe Ratio</span>
                      <span>{performanceData.tradingPerformance.sharpeRatio}</span>
                    </div>
                    <Progress 
                      value={Math.min(performanceData.tradingPerformance.sharpeRatio * 33, 100)} 
                      max={100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maximum Drawdown</span>
                      <span>{performanceData.tradingPerformance.maxDrawdown}%</span>
                    </div>
                    <Progress 
                      value={100 - performanceData.tradingPerformance.maxDrawdown} 
                      max={100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="returns" className="space-y-6">
            {/* Returns by timeframe */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">1 Month Return</p>
                    <p className={`text-2xl font-bold ${performanceData.tradingPerformance.month1Return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performanceData.tradingPerformance.month1Return >= 0 ? '+' : ''}
                      {performanceData.tradingPerformance.month1Return}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">3 Month Return</p>
                    <p className={`text-2xl font-bold ${performanceData.tradingPerformance.month3Return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performanceData.tradingPerformance.month3Return >= 0 ? '+' : ''}
                      {performanceData.tradingPerformance.month3Return}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Year to Date</p>
                    <p className={`text-2xl font-bold ${performanceData.tradingPerformance.yearToDate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performanceData.tradingPerformance.yearToDate >= 0 ? '+' : ''}
                      {performanceData.tradingPerformance.yearToDate}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Monthly returns chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData.tradingPerformance.monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar 
                      dataKey="return" 
                      name="Return %" 
                    >
                      {performanceData.tradingPerformance.monthlyReturns.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.return >= 0 ? "#4ade80" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Return distribution & volatility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Return Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { range: '<-3%', count: 2 },
                      { range: '-3% to -2%', count: 3 },
                      { range: '-2% to -1%', count: 5 },
                      { range: '-1% to 0%', count: 8 },
                      { range: '0% to 1%', count: 12 },
                      { range: '1% to 2%', count: 9 },
                      { range: '2% to 3%', count: 4 },
                      { range: '>3%', count: 2 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="range" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" name="Number of Days" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Volatility Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Volatility</span>
                      <span>{(performanceData.tradingPerformance.volatility / Math.sqrt(252)).toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={(performanceData.tradingPerformance.volatility / Math.sqrt(252)) * 10} 
                      max={10} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Annualized Volatility</span>
                      <span>{performanceData.tradingPerformance.volatility.toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={performanceData.tradingPerformance.volatility} 
                      max={30} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Return-to-Risk Ratio</span>
                      <span>{(performanceData.tradingPerformance.totalReturn / performanceData.tradingPerformance.volatility).toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={Math.min((performanceData.tradingPerformance.totalReturn / performanceData.tradingPerformance.volatility) * 20, 100)} 
                      max={100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calmar Ratio</span>
                      <span>{(performanceData.tradingPerformance.totalReturn / performanceData.tradingPerformance.maxDrawdown).toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={Math.min((performanceData.tradingPerformance.totalReturn / performanceData.tradingPerformance.maxDrawdown) * 20, 100)} 
                      max={100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-6">
            {/* Strategy performance comparison */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Strategy Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={performanceData.tradingPerformance.tradingStrategies}
                    layout="vertical"
                    margin={{ left: 120 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#888888" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#888888" 
                      width={120}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="return" name="Return %" fill="#4ade80" />
                    <Bar dataKey="winRate" name="Win Rate %" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Strategy metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceData.tradingPerformance.tradingStrategies.map((strategy, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{strategy.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Return</p>
                        <p className="text-xl font-bold text-green-500">+{strategy.return}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="text-xl font-bold">{strategy.winRate}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Performance Score</span>
                        <span>{((strategy.return * 0.7) + (strategy.winRate * 0.3) / 100 * 100).toFixed(0)}/100</span>
                      </div>
                      <Progress 
                        value={((strategy.return * 0.7) + (strategy.winRate * 0.3) / 100 * 100)} 
                        max={100} 
                        className="h-1.5" 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Strategy allocation */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Strategy Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width={250} height={250}>
                    <PieChart>
                      <Pie
                        data={performanceData.tradingPerformance.tradingStrategies}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="return"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {performanceData.tradingPerformance.tradingStrategies.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
