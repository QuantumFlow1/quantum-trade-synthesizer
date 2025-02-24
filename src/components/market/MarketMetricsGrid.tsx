
import { useState } from 'react';
import { MarketCard } from './MarketCard';
import { ChartData } from './types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface MarketMetricsGridProps {
  data: ChartData[];
  onMarketClick: (market: string) => void;
}

export const MarketMetricsGrid = ({ data, onMarketClick }: MarketMetricsGridProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyzeMarket = async (market: ChartData) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      console.log('Starting market analysis for:', market.name);
      
      const { data: analysisData, error } = await supabase.functions.invoke('market-analysis', {
        body: {
          symbol: market.name,
          market: market.name,
          price: market.price,
          volume: market.volume,
          change24h: market.change,
          high24h: market.high,
          low24h: market.low,
          timestamp: Date.now()
        }
      });

      console.log('Response from market-analysis function:', { analysisData, error });

      if (error) {
        console.error('Market analysis error:', error);
        throw error;
      }

      if (!analysisData?.analysis) {
        throw new Error('Invalid analysis response');
      }

      const { recommendation, confidence, reason } = analysisData.analysis;
      
      toast({
        title: `${market.name} Analysis`,
        description: `${recommendation} (${Math.round(confidence * 100)}% confidence)\n${reason}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to analyze market:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not complete market analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 animate-in fade-in duration-700">
      {data.map((item, index) => (
        <MarketCard
          key={item.name}
          name={item.name}
          price={item.price}
          change={item.change}
          volume={item.volume}
          high={item.high}
          low={item.low}
          index={index}
          onClick={() => {
            onMarketClick(item.name);
            handleAnalyzeMarket(item);
          }}
        />
      ))}
    </div>
  );
};
