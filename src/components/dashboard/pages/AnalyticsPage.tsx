
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, Brain, Atom, BookOpen } from 'lucide-react';
import { AIMarketAnalysis } from '@/components/market/AIMarketAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketData } from '@/components/market/types';
import { QuantumPortfolioDisplay } from '@/components/market/ai-analysis/QuantumPortfolioDisplay';

export const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('market');
  
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
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quantalytics Center</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Market Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="quantum" className="flex items-center gap-2">
            <Atom className="h-4 w-4" />
            <span>Quantum Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="traditional" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Traditional Strategies</span>
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
        
        <TabsContent value="quantum" className="space-y-6">
          <QuantumPortfolioDisplay />
        </TabsContent>
        
        <TabsContent value="traditional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traditional Strategy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Value Investing</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-2">Analysis of undervalued assets based on fundamentals</p>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">AI Insights:</h4>
                      <p className="text-xs text-muted-foreground">
                        Current market conditions suggest focusing on assets with strong cash flow and low debt ratios.
                        Consider BTC and ETH as value investments in the current market.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Growth Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-2">Analysis of high-growth potential assets</p>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">AI Insights:</h4>
                      <p className="text-xs text-muted-foreground">
                        Layer-2 solutions and AI-related tokens showing significant growth potential.
                        Monitor SOL and AVAX for potential breakout opportunities.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Dollar Cost Averaging</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-2">Systematic investment strategy analysis</p>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">AI Insights:</h4>
                      <p className="text-xs text-muted-foreground">
                        Optimal DCA interval for current market volatility: Weekly investments.
                        Focus on blue-chip cryptocurrencies: BTC, ETH, and BNB for long-term accumulation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Contrarian Strategy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground mb-2">Opportunities in oversold or unpopular assets</p>
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">AI Insights:</h4>
                      <p className="text-xs text-muted-foreground">
                        Several privacy coins appear oversold based on sentiment analysis.
                        Consider small positions in XMR with strict stop-loss orders.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
