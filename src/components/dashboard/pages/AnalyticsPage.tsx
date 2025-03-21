
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, Brain, Atom, BookOpen, TrendingUp, Briefcase, AreaChart } from 'lucide-react';
import { AIMarketAnalysis } from '@/components/market/AIMarketAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketData } from '@/components/market/types';
import { QuantumPortfolioDisplay } from '@/components/market/ai-analysis/QuantumPortfolioDisplay';
import { Agent } from '@/types/agent';
import { otherAgent1 } from '@/components/trading/portfolio/data/otherAgent1';
import { useAgents } from '@/hooks/use-agents';

export const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('market');
  const { agents } = useAgents();
  
  // Find specific agents by type and name
  const valueInvestor = otherAgent1;
  
  // Find financial advisor and portfolio optimizer from available agents
  const financialAdvisor = agents.find(agent => 
    agent.type === 'advisor' && agent.name.toLowerCase().includes('advisor')) || {
    id: "financial-advisor",
    name: "Financial Advisor",
    status: "active",
    type: "advisor",
    description: "Investment advice and financial planning specialist",
    performance: {
      successRate: 89.2,
      tasksCompleted: 728
    }
  };
  
  const portfolioOptimizer = agents.find(agent => 
    agent.name.toLowerCase().includes('optimizer') || 
    agent.name.toLowerCase().includes('portfolio')) || {
    id: "portfolio-optimizer",
    name: "Portfolio Optimizer",
    status: "active",
    type: "portfolio_manager",
    description: "Balances portfolio risk and optimizes asset allocation",
    performance: {
      successRate: 92.1,
      tasksCompleted: 531
    }
  };
  
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
              <div className="grid grid-cols-1 gap-6 mb-6">
                <Card className="bg-muted/40 border border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      AI Advisor Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <AgentInsightCard 
                        agent={valueInvestor}
                        icon={<AreaChart className="h-5 w-5 text-emerald-500" />}
                        insight="Current market conditions suggest focusing on assets with strong fundamentals and cash flow. Consider a value-based approach to current volatility."
                      />
                      <AgentInsightCard 
                        agent={financialAdvisor}
                        icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                        insight="Portfolio diversification across asset classes is recommended. Monitor market correlation patterns to minimize risk exposure."
                      />
                      <AgentInsightCard 
                        agent={portfolioOptimizer}
                        icon={<BarChart className="h-5 w-5 text-purple-500" />}
                        insight="Optimal allocation suggests 60% blue-chip assets, 30% growth potential, and 10% hedge positions based on current conditions."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

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

// Agent Insight Card Component
interface AgentInsightCardProps {
  agent: any;
  icon: React.ReactNode;
  insight: string;
}

const AgentInsightCard = ({ agent, icon, insight }: AgentInsightCardProps) => {
  return (
    <Card className="border border-primary/10">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-medium text-sm">{agent.name}</h4>
          </div>
          <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {agent.specialization || agent.type}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground">{insight}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            Confidence: {agent.confidence || (agent.performance?.successRate ?? 0)}%
          </div>
          <div className="bg-green-500/10 text-green-600 text-xs px-2 py-0.5 rounded-full">
            Active
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
