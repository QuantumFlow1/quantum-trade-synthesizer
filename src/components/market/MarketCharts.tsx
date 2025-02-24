
import { LoadingChart } from './LoadingChart';
import { MarketMetricsGrid } from './MarketMetricsGrid';
import { MarketChartView } from './MarketChartView';
import { ChartData } from './types';
import { useToast } from "@/hooks/use-toast";

interface MarketChartsProps {
  data: ChartData[];
  isLoading: boolean;
  type: 'overview' | 'volume' | 'price';
}

export const MarketCharts = ({ data, isLoading, type }: MarketChartsProps) => {
  const { toast } = useToast();

  if (isLoading) return <LoadingChart />;

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-lg">
        <p className="text-sm text-muted-foreground">Geen marktdata beschikbaar</p>
      </div>
    );
  }

  const handleMarketClick = (market: string) => {
    const tabTrigger = document.querySelector(`[role="tab"][data-state="active"]`);
    if (tabTrigger) {
      const tabPanelId = tabTrigger.getAttribute('aria-controls');
      const tabPanel = document.getElementById(tabPanelId || '');
      
      if (tabPanel) {
        const marketElement = tabPanel.querySelector(`[data-market="${market}"]`);
        if (marketElement) {
          marketElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
          
          toast({
            title: "Navigatie",
            description: `Navigeren naar ${market}...`,
          });
        }
      }
    }
  };

  return (
    <div className="h-full w-full space-y-6 animate-in fade-in duration-1000">
      <MarketMetricsGrid data={data} onMarketClick={handleMarketClick} />
      <MarketChartView data={data} type={type} />
    </div>
  );
};
