
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketDataTable } from './enhanced/MarketDataTable';
import { MarketAnalysisCard } from './enhanced/MarketAnalysisCard';
import { MarketPositionsPage } from './positions/MarketPositionsPage';
import { MarketTransactionsPage } from './transactions/MarketTransactionsPage';
import { LineChart, MessageCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EnhancedMarketTabProps {
  marketData: any[];
  isLoading: boolean;
}

export const EnhancedMarketTab: React.FC<EnhancedMarketTabProps> = ({ marketData, isLoading }) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [currentPositionsPage, setCurrentPositionsPage] = useState(1);
  const [currentTransactionsPage, setCurrentTransactionsPage] = useState(1);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', role: 'assistant', content: 'Hello! I can help you analyze market data and provide insights. What would you like to know?' }
  ]);
  const itemsPerPage = 5;

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const userMessage = { id: Date.now().toString(), role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `I've analyzed ${selectedAsset || 'the market'}. Based on current trends, ${getRandomInsight()}`
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setChatInput('');
  };

  const getRandomInsight = () => {
    const insights = [
      "volume is increasing which could indicate growing interest from traders.",
      "there's a bearish divergence forming on the RSI indicator.",
      "the moving averages suggest a potential uptrend forming.",
      "market sentiment appears to be shifting to a more bullish outlook.",
      "volatility has decreased over the past few sessions.",
      "the asset is testing a key resistance level."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Market Chart</h3>
                {selectedAsset && (
                  <div className="bg-accent/30 text-accent-foreground px-2 py-1 rounded text-sm">
                    {selectedAsset}
                  </div>
                )}
              </div>
              {!selectedAsset ? (
                <div className="flex flex-col items-center justify-center h-[300px] bg-secondary/20 rounded-md">
                  <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Select an asset from the table below to view its chart</p>
                </div>
              ) : (
                <div className="h-[300px] bg-secondary/20 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Chart for {selectedAsset}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <MarketAnalysisCard marketData={marketData} isLoading={isLoading} />
        </div>
      </div>

      {/* New AI Chat Interface Section */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-primary" />
            AI Market Insights Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[250px] pr-4 mb-4">
            <div className="space-y-4">
              {chatMessages.map(message => (
                <div 
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about market trends, specific assets, or trading strategies..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="market-data">
        <TabsList className="mb-2">
          <TabsTrigger value="market-data">Market Data</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="market-data" className="mt-0">
          <MarketDataTable 
            data={marketData}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="positions" className="mt-0">
          <MarketPositionsPage
            currentPage={currentPositionsPage}
            itemsPerPage={itemsPerPage}
            onNextPage={() => setCurrentPositionsPage(prev => prev + 1)}
            onPreviousPage={() => setCurrentPositionsPage(prev => Math.max(1, prev - 1))}
          />
        </TabsContent>
        <TabsContent value="transactions" className="mt-0">
          <MarketTransactionsPage
            currentPage={currentTransactionsPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentTransactionsPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
