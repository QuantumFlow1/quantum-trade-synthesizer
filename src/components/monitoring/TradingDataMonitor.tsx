import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ActivitySquare, AlertCircle, ArrowDownUp, BarChart3, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { MarketAnalyzer } from "@/utils/marketAnalyzer";
import { AdvancedIndicatorResult, useAdvancedIndicators } from "@/hooks/trading/useAdvancedIndicators";

// Types specific to the monitoring dashboard
interface MonitoringMetrics {
  updates: number;
  processTime: number[];
  errors: {count: number, messages: string[]};
  dataPoints: number;
  calculationTime: number;
  memoryUsage: number;
  apiCalls: {success: number, failed: number};
  lastUpdate: Date;
}

interface ProcessMetric {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'error';
  lastExecutionTime: number;
  averageTime: number;
  errorCount: number;
  successCount: number;
}

export function TradingDataMonitor() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<MonitoringMetrics>({
    updates: 0,
    processTime: [],
    errors: {count: 0, messages: []},
    dataPoints: 0,
    calculationTime: 0,
    memoryUsage: 0,
    apiCalls: {success: 0, failed: 0},
    lastUpdate: new Date()
  });
  const [processes, setProcesses] = useState<ProcessMetric[]>([
    {
      id: 'data-fetch',
      name: 'Market Data Fetching',
      status: 'idle',
      lastExecutionTime: 0,
      averageTime: 0,
      errorCount: 0,
      successCount: 0
    },
    {
      id: 'indicator-calc',
      name: 'Technical Indicator Calculation',
      status: 'idle',
      lastExecutionTime: 0,
      averageTime: 0,
      errorCount: 0,
      successCount: 0
    },
    {
      id: 'backtesting',
      name: 'Strategy Backtesting',
      status: 'idle',
      lastExecutionTime: 0,
      averageTime: 0,
      errorCount: 0,
      successCount: 0
    },
    {
      id: 'ai-prediction',
      name: 'AI Prediction Generation',
      status: 'idle',
      lastExecutionTime: 0,
      averageTime: 0,
      errorCount: 0,
      successCount: 0
    }
  ]);
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const { toast } = useToast();
  
  // Use our advanced indicators hook
  const { results: advIndicatorResults, isCalculating, error, indicatorInfo } = 
    useAdvancedIndicators(data, 'supertrend');
  
  // Monitor for data changes
  useEffect(() => {
    const fetchData = () => {
      const startTime = performance.now();
      
      // Update process status
      updateProcessStatus('data-fetch', 'running');
      
      try {
        // Fetch data from service
        const newData = tradingDataService.getData();
        if (newData && newData.length > 0) {
          setData(newData);
          
          // Update metrics
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          
          setMetrics(prev => {
            const newProcessTime = [...prev.processTime, executionTime].slice(-20);
            const avgTime = newProcessTime.reduce((a, b) => a + b, 0) / newProcessTime.length;
            
            return {
              ...prev,
              updates: prev.updates + 1,
              processTime: newProcessTime,
              dataPoints: newData.length,
              calculationTime: avgTime,
              lastUpdate: new Date(),
              memoryUsage: Math.round(Math.random() * 40) + 60, // Mock memory usage for demo (60-100MB)
              apiCalls: {
                ...prev.apiCalls,
                success: prev.apiCalls.success + 1
              }
            };
          });
          
          // Update process metrics
          updateProcessMetrics('data-fetch', executionTime, true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        
        setMetrics(prev => ({
          ...prev,
          errors: {
            count: prev.errors.count + 1,
            messages: [...prev.errors.messages, errorMsg].slice(-10)
          },
          apiCalls: {
            ...prev.apiCalls,
            failed: prev.apiCalls.failed + 1
          }
        }));
        
        // Update process metrics with error
        updateProcessMetrics('data-fetch', performance.now() - startTime, false);
        
        toast({
          title: "Data Fetch Error",
          description: errorMsg,
          variant: "destructive"
        });
      } finally {
        updateProcessStatus('data-fetch', 'idle');
      }
    };
    
    // Initial fetch
    fetchData();
    
    // Set up interval for data refreshes
    const intervalId = setInterval(fetchData, 15000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  // Effect to simulate calculation processes
  useEffect(() => {
    if (data.length === 0) return;
    
    // Simulate indicator calculation process
    const simulateIndicatorCalc = () => {
      updateProcessStatus('indicator-calc', 'running');
      
      const startTime = performance.now();
      
      // Perform actual calculation
      try {
        if (data.length >= 10) {
          // Actually calculate a real indicator to simulate work
          MarketAnalyzer.analyzeMarketTrend(
            data.map(d => ({ 
              price: d.close, 
              symbol: 'BTC', 
              timestamp: d.timestamp,
              volume: d.volume || 0,
              high: d.high || d.close,
              low: d.low || d.close
            })), 
            10
          );
        }
        
        const endTime = performance.now();
        updateProcessMetrics('indicator-calc', endTime - startTime, true);
      } catch (error) {
        updateProcessMetrics('indicator-calc', performance.now() - startTime, false);
      } finally {
        updateProcessStatus('indicator-calc', 'idle');
      }
    };
    
    // Simulate backtesting process
    const simulateBacktesting = () => {
      // Only run occasionally
      if (Math.random() > 0.3) return;
      
      updateProcessStatus('backtesting', 'running');
      
      // Simulate longer processing time
      const startTime = performance.now();
      
      setTimeout(() => {
        const success = Math.random() > 0.1; // 10% chance of failure
        if (success) {
          updateProcessMetrics('backtesting', performance.now() - startTime, true);
          updateProcessStatus('backtesting', 'idle');
        } else {
          updateProcessMetrics('backtesting', performance.now() - startTime, false);
          updateProcessStatus('backtesting', 'error');
          
          // Add to error metrics
          setMetrics(prev => ({
            ...prev,
            errors: {
              count: prev.errors.count + 1,
              messages: [...prev.errors.messages, 'Backtesting process failed - timeout'].slice(-10)
            }
          }));
        }
      }, 2000 + Math.random() * 3000);
    };
    
    // Simulate AI prediction process
    const simulateAIPrediction = () => {
      // Only run occasionally
      if (Math.random() > 0.2) return;
      
      updateProcessStatus('ai-prediction', 'running');
      
      // Simulate processing
      const startTime = performance.now();
      
      setTimeout(() => {
        updateProcessMetrics('ai-prediction', performance.now() - startTime, true);
        updateProcessStatus('ai-prediction', 'idle');
      }, 1500 + Math.random() * 2000);
    };
    
    // Run simulations
    simulateIndicatorCalc();
    simulateBacktesting();
    simulateAIPrediction();
    
  }, [data]);
  
  // Helper function to update process status
  const updateProcessStatus = (id: string, status: 'running' | 'idle' | 'error') => {
    setProcesses(prev => prev.map(process => 
      process.id === id ? { ...process, status } : process
    ));
  };
  
  // Helper function to update process metrics
  const updateProcessMetrics = (id: string, executionTime: number, success: boolean) => {
    setProcesses(prev => prev.map(process => {
      if (process.id !== id) return process;
      
      const newSuccessCount = success ? process.successCount + 1 : process.successCount;
      const newErrorCount = success ? process.errorCount : process.errorCount + 1;
      const totalRuns = newSuccessCount + newErrorCount;
      
      // Calculate new average time (weighted)
      const newAverageTime = totalRuns <= 1 
        ? executionTime 
        : (process.averageTime * (totalRuns - 1) + executionTime) / totalRuns;
      
      return {
        ...process,
        lastExecutionTime: executionTime,
        averageTime: newAverageTime,
        successCount: newSuccessCount,
        errorCount: newErrorCount
      };
    }));
  };
  
  // Handler for manual refresh
  const handleRefresh = () => {
    const data = tradingDataService.refreshData();
    setData(data);
    
    toast({
      title: "Data Refreshed",
      description: `Loaded ${data.length} data points`,
    });
  };
  
  return (
    <Card className="w-full border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ActivitySquare className="w-5 h-5 text-primary" />
            Trading System Monitor
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="h-8">
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh Data
          </Button>
        </CardTitle>
        <CardDescription>
          Real-time monitoring of data processes and system performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="processes">Processes</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* System Status Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-xl font-bold">
                        {metrics.updates > 0 ? "Active" : "Initializing"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last update: {metrics.lastUpdate.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <ArrowDownUp className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Performance Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Memory Usage</span>
                    <span>{metrics.memoryUsage} MB</span>
                  </div>
                  <Progress value={metrics.memoryUsage} max={100} className="h-1" />
                  
                  <div className="flex justify-between text-xs mt-3">
                    <span>Avg. Processing Time</span>
                    <span>{metrics.calculationTime.toFixed(2)} ms</span>
                  </div>
                  <Progress 
                    value={Math.min(metrics.calculationTime / 10, 100)} 
                    max={100} 
                    className="h-1" 
                  />
                </CardContent>
              </Card>
              
              {/* Process Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Process Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {processes.map(process => (
                      <div key={process.id} className="flex justify-between items-center">
                        <span className="text-xs">{process.name}</span>
                        <Badge variant={
                          process.status === 'running' ? 'default' : 
                          process.status === 'error' ? 'destructive' : 
                          'outline'
                        }>
                          {process.status === 'running' ? 'Active' : 
                           process.status === 'error' ? 'Error' : 
                           'Idle'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Data Overview */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Data Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Data Points</p>
                    <p className="text-xl font-bold">{metrics.dataPoints}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Updates</p>
                    <p className="text-xl font-bold">{metrics.updates}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">API Success</p>
                    <p className="text-xl font-bold">{metrics.apiCalls.success}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">API Errors</p>
                    <p className="text-xl font-bold text-red-500">{metrics.apiCalls.failed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="processes" className="space-y-4">
            {/* Process Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processes.map(process => (
                <Card key={process.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>{process.name}</span>
                      <Badge variant={
                        process.status === 'running' ? 'default' : 
                        process.status === 'error' ? 'destructive' : 
                        'outline'
                      }>
                        {process.status === 'running' ? 'Active' : 
                         process.status === 'error' ? 'Error' : 
                         'Idle'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Last Execution</p>
                        <p className="text-base font-medium">{process.lastExecutionTime.toFixed(2)} ms</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Average Time</p>
                        <p className="text-base font-medium">{process.averageTime.toFixed(2)} ms</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Success Count</p>
                        <p className="text-base font-medium text-green-600">{process.successCount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Error Count</p>
                        <p className="text-base font-medium text-red-500">{process.errorCount}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                      <Progress 
                        value={
                          process.successCount + process.errorCount === 0 ? 
                          0 : 
                          (process.successCount / (process.successCount + process.errorCount)) * 100
                        } 
                        max={100} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="indicators" className="space-y-4">
            {/* Indicator Calculations */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Technical Indicator Results</span>
                    <Badge variant={isCalculating ? 'default' : 'outline'}>
                      {isCalculating ? 'Calculating' : 'Idle'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {error ? (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Indicator</p>
                          <p className="text-base font-medium">{indicatorInfo.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Formula</p>
                          <p className="text-xs font-medium">{indicatorInfo.formula}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{indicatorInfo.description}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Interpretation</p>
                        <p className="text-sm">{indicatorInfo.interpretation}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Latest Results</p>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 font-medium">Value</th>
                                <th className="text-left py-2 font-medium">Signal</th>
                                <th className="text-left py-2 font-medium">Trend</th>
                                <th className="text-left py-2 font-medium">Strength</th>
                              </tr>
                            </thead>
                            <tbody>
                              {advIndicatorResults.slice(-5).map((result, i) => (
                                <tr key={i} className="border-b border-muted">
                                  <td className="py-2">{result.value.toFixed(2)}</td>
                                  <td className="py-2">{result.signal?.toFixed(2) || 'N/A'}</td>
                                  <td className="py-2">
                                    <Badge variant={
                                      result.trend === 'bullish' ? 'default' : 
                                      result.trend === 'bearish' ? 'destructive' : 
                                      'outline'
                                    }>
                                      {result.trend || 'N/A'}
                                    </Badge>
                                  </td>
                                  <td className="py-2">{result.strength?.toFixed(2) || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            {/* System Logs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>System Logs</span>
                  <Badge variant="outline">{metrics.errors.count} Errors</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {metrics.errors.messages.length > 0 ? (
                      metrics.errors.messages.map((msg, i) => (
                        <div key={i} className="flex items-start gap-2 pb-3 border-b border-muted">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-red-500">{msg}</p>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-25" />
                        <p>No errors logged</p>
                      </div>
                    )}
                    
                    {/* General system logs */}
                    <div className="pt-2">
                      <h3 className="font-medium text-sm mb-2">Activity Log</h3>
                      {/* Add general activity logs here */}
                      <div className="flex items-start gap-2 pb-3 border-b border-muted">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">System started</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pb-3 border-b border-muted mt-3">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">Data fetch initialized</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pb-3 border-b border-muted mt-3">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm">Technical indicators loaded</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
