
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartArea, Layers, AlertCircle } from 'lucide-react';
import { TradeSignal, MarketData } from './types';
import { analyzeMarket } from '@/utils/marketAnalysis';
import { useToast } from '@/hooks/use-toast';

const TradingDashboard: React.FC = () => {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePosition, setActivePosition] = useState<TradeSignal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const cleanup = initializeMarketData();
    return () => cleanup();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartArea className="w-5 h-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#888888"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#4ade80" 
                  dot={false} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trading Signals and Active Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Active Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signals.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No active signals available
                  </AlertDescription>
                </Alert>
              ) : (
                signals.map((signal, index) => (
                  <div 
                    key={index}
                    className="p-4 border rounded-lg flex justify-between items-center bg-card/50"
                  >
                    <div className="space-y-1">
                      <span className={`font-bold ${
                        signal.type === 'LONG' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {signal.type}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        Entry: {signal.entry.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => executeTrade(signal)}
                    >
                      Execute
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Active Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePosition ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <p className={`font-medium ${
                      activePosition.type === 'LONG' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {activePosition.type}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Entry</span>
                    <p className="font-medium">{activePosition.entry.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Stop Loss</span>
                    <p className="font-medium text-red-500">{activePosition.stopLoss.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Take Profit</span>
                    <p className="font-medium text-green-500">{activePosition.takeProfit.toFixed(2)}</p>
                  </div>
                </div>
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={closePosition}
                >
                  Close Position
                </Button>
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No active position
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
            </Button>
            <Button
              variant="outline"
              onClick={resetSystem}
              className="w-full"
            >
              Reset System
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Trading Functions
  function initializeMarketData() {
    const interval = setInterval(() => {
      setMarketData(current => [
        ...current,
        {
          timestamp: Date.now(),
          price: Math.random() * 100 + 100,
          volume: Math.random() * 1000,
          high: Math.random() * 100 + 105,
          low: Math.random() * 100 + 95
        }
      ].slice(-100));
    }, 1000);

    return () => clearInterval(interval);
  }

  async function startAnalysis() {
    setIsAnalyzing(true);
    try {
      const newSignals = await analyzeMarket(marketData);
      setSignals(newSignals);
      toast({
        title: "Analysis Complete",
        description: `Found ${newSignals.length} new trading signals`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not complete market analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function executeTrade(signal: TradeSignal) {
    if (activePosition) {
      toast({
        title: "Trade Execution Failed",
        description: "Please close the current position first",
        variant: "destructive",
      });
      return;
    }
    setActivePosition(signal);
    setSignals(current => current.filter(s => s !== signal));
    toast({
      title: "Trade Executed",
      description: `Opened ${signal.type} position at ${signal.entry.toFixed(2)}`,
    });
  }

  function closePosition() {
    if (!activePosition) return;
    toast({
      title: "Position Closed",
      description: `Closed ${activePosition.type} position`,
    });
    setActivePosition(null);
  }

  function resetSystem() {
    setSignals([]);
    setActivePosition(null);
    setMarketData([]);
    toast({
      title: "System Reset",
      description: "All trading data has been cleared",
    });
  }
};

export default TradingDashboard;
