
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketData } from '@/components/market/types';
import { MarketAnalyzer } from '@/utils/marketAnalyzer';

interface MarketAnalysisCardProps {
  marketData: MarketData[];
  isLoading: boolean;
}

export const MarketAnalysisCard: React.FC<MarketAnalysisCardProps> = ({
  marketData,
  isLoading
}) => {
  const [analysisType, setAnalysisType] = React.useState('trend');
  
  const getTrendAnalysis = () => {
    try {
      // Use top markets data for trend analysis
      const sortedData = [...marketData]
        .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
        .slice(0, 10);
      
      if (sortedData.length < 5) {
        return { error: "Insufficient data for analysis" };
      }
      
      const analysis = MarketAnalyzer.analyzeMarketTrend(sortedData);
      return analysis;
    } catch (error) {
      console.error("Error analyzing market trends:", error);
      return { error: error instanceof Error ? error.message : "Failed to analyze trends" };
    }
  };
  
  const trendAnalysis = React.useMemo(() => getTrendAnalysis(), [marketData]);
  
  const getMarketSentiment = () => {
    if (!marketData.length) return { positive: 0, negative: 0, neutral: 0 };
    
    const sentiment = marketData.reduce(
      (acc, item) => {
        if (!item.change24h) return acc;
        
        if (item.change24h > 0.5) acc.positive++;
        else if (item.change24h < -0.5) acc.negative++;
        else acc.neutral++;
        
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0 }
    );
    
    // Calculate percentages
    const total = sentiment.positive + sentiment.negative + sentiment.neutral;
    return {
      positive: Math.round((sentiment.positive / total) * 100),
      negative: Math.round((sentiment.negative / total) * 100),
      neutral: Math.round((sentiment.neutral / total) * 100)
    };
  };
  
  const sentiment = React.useMemo(() => getMarketSentiment(), [marketData]);
  
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
            Market Analysis
          </CardTitle>
          
          <Tabs value={analysisType} onValueChange={setAnalysisType}>
            <TabsList className="bg-muted h-8">
              <TabsTrigger value="trend" className="text-xs px-3 py-1">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Trend
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="text-xs px-3 py-1">
                <BarChart3 className="h-3.5 w-3.5 mr-1" />
                Sentiment
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6 pt-2">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ) : (
          <>
            <TabsContent value="trend" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Market Trend</p>
                  {trendAnalysis.error ? (
                    <p className="text-red-500 text-sm">{trendAnalysis.error}</p>
                  ) : (
                    <div className={`flex items-center font-medium ${
                      trendAnalysis.trend === 'rising' ? 'text-green-500' : 
                      trendAnalysis.trend === 'falling' ? 'text-red-500' : 
                      'text-blue-500'
                    }`}>
                      {trendAnalysis.trend === 'rising' ? (
                        <ArrowUpRight className="h-5 w-5 mr-1" />
                      ) : trendAnalysis.trend === 'falling' ? (
                        <ArrowDownRight className="h-5 w-5 mr-1" />
                      ) : (
                        <BarChart3 className="h-5 w-5 mr-1" />
                      )}
                      <span className="capitalize">{trendAnalysis.trend}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Moving Average</p>
                  {trendAnalysis.error ? (
                    <p className="text-red-500 text-sm">N/A</p>
                  ) : (
                    <p className="font-medium">
                      {(trendAnalysis.currentMA || 0).toFixed(2)}
                    </p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Change</p>
                  {trendAnalysis.error ? (
                    <p className="text-red-500 text-sm">N/A</p>
                  ) : (
                    <p className={`font-medium ${(trendAnalysis.difference || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(trendAnalysis.difference || 0) >= 0 ? '+' : ''}
                      {((trendAnalysis.difference || 0) * 100).toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-medium mb-2">Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {trendAnalysis.error ? "Insufficient data to generate market analysis." : (
                    trendAnalysis.trend === 'rising' 
                      ? `The market is showing a bullish trend with an upward momentum of ${((trendAnalysis.difference || 0) * 100).toFixed(2)}%. Current moving average is ${(trendAnalysis.currentMA || 0).toFixed(2)} with consistent upward movement over the analyzed period.`
                      : trendAnalysis.trend === 'falling'
                      ? `The market is exhibiting a bearish trend with a downward momentum of ${(Math.abs(trendAnalysis.difference || 0) * 100).toFixed(2)}%. Current moving average is ${(trendAnalysis.currentMA || 0).toFixed(2)} with consistent downward movement over the analyzed period.`
                      : `The market is showing a neutral trend with minimal movement (${((trendAnalysis.difference || 0) * 100).toFixed(2)}%). Current moving average is ${(trendAnalysis.currentMA || 0).toFixed(2)} with sideways action over the analyzed period.`
                  )}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="sentiment" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Bullish</p>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${sentiment.positive}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-green-500">{sentiment.positive}%</p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Bearish</p>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500" 
                      style={{ width: `${sentiment.negative}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-red-500">{sentiment.negative}%</p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Neutral</p>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${sentiment.neutral}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-blue-500">{sentiment.neutral}%</p>
                </div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-medium mb-2">Sentiment Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {!marketData.length ? "No data available for sentiment analysis." : (
                    sentiment.positive > sentiment.negative 
                      ? `Market sentiment is predominantly bullish with ${sentiment.positive}% of assets showing positive price action. This indicates strong market confidence and potential for continued upward momentum.`
                      : sentiment.negative > sentiment.positive
                      ? `Market sentiment is predominantly bearish with ${sentiment.negative}% of assets showing negative price action. This suggests caution is warranted as downward pressure may continue.`
                      : `Market sentiment is balanced with ${sentiment.neutral}% of assets showing neutral price action. The market appears to be consolidating and waiting for a clear directional signal.`
                  )}
                </p>
              </div>
            </TabsContent>
          </>
        )}
      </CardContent>
    </Card>
  );
};
