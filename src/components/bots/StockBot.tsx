
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bot, BrainCircuit, TrendingUp, ArrowUpRight, ArrowDownRight, RotateCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "../ui/skeleton";

interface StockBotResponse {
  recommendation: string;
  confidence: number;
  analysis: string;
  targetPrice?: number;
  stopLoss?: number;
  timeframe?: string;
}

export const StockBot = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ask');
  const [results, setResults] = useState<StockBotResponse | null>(null);
  const [recentSymbols, setRecentSymbols] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load recent symbols from localStorage
    const savedSymbols = localStorage.getItem('recentStockSymbols');
    if (savedSymbols) {
      try {
        setRecentSymbols(JSON.parse(savedSymbols));
      } catch (e) {
        console.error('Error parsing recent symbols', e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Please enter a stock symbol or question",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if it's a stock symbol query
      const isSymbolQuery = /^[A-Z]{1,5}$/.test(query.trim());
      
      if (isSymbolQuery) {
        // Save to recent symbols
        const newRecentSymbols = [query.trim(), ...recentSymbols.filter(s => s !== query.trim())].slice(0, 5);
        setRecentSymbols(newRecentSymbols);
        localStorage.setItem('recentStockSymbols', JSON.stringify(newRecentSymbols));
      }

      // For now we'll simulate a response, in production this would call your backend
      setTimeout(() => {
        const mockResponse: StockBotResponse = {
          recommendation: ["BUY", "SELL", "HOLD"][Math.floor(Math.random() * 3)],
          confidence: Math.round(Math.random() * 100),
          analysis: `Analysis for ${query}: The stock is showing ${Math.random() > 0.5 ? 'positive' : 'negative'} momentum with key support at $${(Math.random() * 100).toFixed(2)} and resistance at $${(Math.random() * 200).toFixed(2)}. Recent earnings were ${Math.random() > 0.5 ? 'above' : 'below'} analyst expectations.`,
          targetPrice: parseFloat((Math.random() * 200 + 50).toFixed(2)),
          stopLoss: parseFloat((Math.random() * 50 + 20).toFixed(2)),
          timeframe: ["Short-term", "Medium-term", "Long-term"][Math.floor(Math.random() * 3)]
        };
        
        setResults(mockResponse);
        setIsLoading(false);
      }, 1500);
      
      // In production, you would use:
      /*
      const { data, error } = await supabase.functions.invoke('stock-bot-analysis', {
        body: { query }
      });
      
      if (error) throw error;
      setResults(data);
      */
    } catch (error) {
      console.error('Error querying stock bot:', error);
      toast({
        title: "Error analyzing stock",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (recommendation?: string) => {
    if (!recommendation) return "bg-gray-500";
    if (recommendation === "BUY") return "bg-green-500";
    if (recommendation === "SELL") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <CardTitle>StockBot</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setResults(null)}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          AI-powered stock analysis assistant
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="ask">Ask about a stock</TabsTrigger>
            <TabsTrigger value="recent">Recent stocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ask" className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Enter a stock symbol (e.g., AAPL) or ask a question"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
            
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
            
            {!isLoading && results && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`${getRecommendationColor(results.recommendation)} p-2 rounded-md text-white font-medium`}>
                      {results.recommendation}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Confidence: {results.confidence}%
                    </span>
                  </div>
                  
                  {results.recommendation === "BUY" ? (
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                  ) : results.recommendation === "SELL" ? (
                    <ArrowDownRight className="h-5 w-5 text-red-500" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                
                <div className="text-sm bg-secondary/30 p-3 rounded-md">
                  {results.analysis}
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {results.targetPrice && (
                    <div className="bg-secondary/20 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Target Price</div>
                      <div className="font-medium">${results.targetPrice}</div>
                    </div>
                  )}
                  
                  {results.stopLoss && (
                    <div className="bg-secondary/20 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Stop Loss</div>
                      <div className="font-medium">${results.stopLoss}</div>
                    </div>
                  )}
                  
                  {results.timeframe && (
                    <div className="bg-secondary/20 p-2 rounded-md">
                      <div className="text-xs text-muted-foreground">Timeframe</div>
                      <div className="font-medium">{results.timeframe}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            {recentSymbols.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No recent stock queries
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {recentSymbols.map((symbol) => (
                  <Button 
                    key={symbol} 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => {
                      setQuery(symbol);
                      setActiveTab('ask');
                    }}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {symbol}
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        Powered by AI market data analysis
      </CardFooter>
    </Card>
  );
};
