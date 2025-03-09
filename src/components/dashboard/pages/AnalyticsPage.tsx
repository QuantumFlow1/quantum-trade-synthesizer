
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, Brain } from 'lucide-react';
import { PortfolioManager } from '@/components/trading/PortfolioManager';
import { AIMarketAnalysis } from '@/components/market/AIMarketAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketData } from '@/components/market/types';

export const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('market');
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  
  // Sample market data for demonstration
  const marketData: MarketData = {
    symbol: 'BTC',
    price: 62549.23,
    change24h: 2.34,
    marketCap: 1.21,
    volume: 32500000000,
    timestamp: Date.now(),
    high: 63100.50,
    low: 61800.75,
    high24h: 63100.50,
    low24h: 61800.75
  };
  
  const handleSimulationToggle = (enabled: boolean) => {
    setIsSimulationMode(enabled);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Center</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Market Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI Agents</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <AIMarketAnalysis marketData={marketData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Trading Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioManager 
                isSimulationMode={isSimulationMode}
                onSimulationToggle={handleSimulationToggle}
                currentData={marketData}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Agent Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Accuracy and success rates of AI trading agents</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Trading History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Historical trading decisions and outcomes</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
