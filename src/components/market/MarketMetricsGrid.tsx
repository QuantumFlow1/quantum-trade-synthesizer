
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
    setIsAnalyzing(true);
    try {
      console.log('Starting market analysis for:', market.name);
      console.log('Request payload:', {
        data: {
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
      
      const { data: analysisData, error } = await supabase.functions.invoke('market-analysis', {
        body: {
          data: {
            symbol: market.name,
            market: market.name,
            price: market.price,
            volume: market.volume,
            change24h: market.change,
            high24h: market.high,
            low24h: market.low,
            timestamp: Date.now()
          }
        }
      });

      console.log('Response from market-analysis function:', { analysisData, error });

      if (error) {
        console.error('Market analysis error:', error);
        throw error;
      }

      if (!analysisData) {
        console.error('No analysis data received');
        throw new Error('No analysis data received');
      }

      console.log('Market analysis result:', analysisData);
      
      toast({
        title: "Market Analysis Complete",
        description: `${market.name}: ${analysisData.analysis.recommendation} - ${analysisData.analysis.reason}`,
      });
    } catch (error) {
      console.error('Failed to analyze market:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not complete market analysis",
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
