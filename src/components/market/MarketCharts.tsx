
import { useEffect, useState } from 'react';
import { MarketChartView } from './MarketChartView';
import { MarketDetailModal } from './MarketDetailModal';
import { Button } from '../ui/button';
import { ExternalLink, Maximize2, BarChart } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface ChartProps {
  data: any[];
  isLoading: boolean;
  type: 'overview' | 'volume' | 'price';
}

export const MarketCharts = ({ data, isLoading, type }: ChartProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  const handleShowDetails = (marketName: string) => {
    setSelectedMarket(marketName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[350px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center border border-dashed border-white/20 rounded-lg">
        <div className="text-center text-muted-foreground">
          <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Geen marktgegevens beschikbaar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          size="sm"
          variant="ghost"
          className="bg-background/50 backdrop-blur-md hover:bg-background/80"
          onClick={() => handleShowDetails(data[0]?.name || "Unknown")}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Details
        </Button>
      </div>

      <div onClick={() => handleShowDetails(data[0]?.name || "Unknown")} className="cursor-pointer">
        <MarketChartView data={data} type={type} />
      </div>

      <MarketDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        marketName={selectedMarket}
        marketData={data}
      />
    </div>
  );
};
