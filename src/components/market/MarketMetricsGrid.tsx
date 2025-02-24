
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
    if (isAnalyzing) {
      toast({
        title: "Analysis in Progress",
        description: "Please wait for the current analysis to complete",
        duration: 3000,
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      console.log('Starting market analysis for:', market.name);
      
      const { data: analysisData, error, status } = await supabase.functions.invoke('market-analysis', {
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

      console.log('Response from market-analysis function:', { analysisData, error, status });

      if (error) {
        console.error('Market analysis error:', error);
        throw error;
      }

      if (!analysisData?.analysis) {
        console.error('Invalid analysis response:', analysisData);
        throw new Error('Could not generate market analysis at this time');
      }

      const { recommendation, confidence, reason } = analysisData.analysis;
      
      toast({
        title: `${market.name} Analysis`,
        description: `${recommendation} (${Math.round(confidence * 100)}% confidence)\n${reason}`,
        duration: 8000,
      });
    } catch (error) {
      console.error('Failed to analyze market:', error);
      
      let errorMessage = "Could not complete market analysis";
      
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          errorMessage = "Analysis service is currently busy. Please try again in a few moments.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
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
