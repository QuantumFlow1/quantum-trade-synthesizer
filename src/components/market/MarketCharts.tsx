
import { useEffect, useState } from 'react';
import { MarketChartView } from './MarketChartView';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { ExternalLink, Maximize2, BarChart, RefreshCw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { MarketData } from './types';

interface ChartProps {
  data: any[];
  isLoading: boolean;
  type: 'overview' | 'volume' | 'price';
  onRefresh?: () => void;
}

export const MarketCharts = ({ data, isLoading, type, onRefresh }: ChartProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // Process data when it changes to catch any errors
  useEffect(() => {
    try {
      if (Array.isArray(data) && data.length > 0) {
        setChartData(data);
        setError(null);
      } else if (data && 'error' in data) {
        setError(data.error);
        setChartData([]);
      } else if (!data || data.length === 0) {
        setError("No data available");
        setChartData([]);
      }
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError(err instanceof Error ? err.message : "Unknown error processing data");
      setChartData([]);
    }
  }, [data]);

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

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <div className="flex justify-between items-start">
          <div>
            <AlertTitle>Error loading chart data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </div>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </Alert>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center border border-dashed border-white/20 rounded-lg">
        <div className="text-center text-muted-foreground">
          <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Geen marktgegevens beschikbaar</p>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Vernieuwen
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {onRefresh && (
          <Button
            size="sm"
            variant="ghost"
            className="bg-background/50 backdrop-blur-md hover:bg-background/80"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="bg-background/50 backdrop-blur-md hover:bg-background/80"
          onClick={() => handleShowDetails(chartData[0]?.name || "Unknown")}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Details
        </Button>
      </div>

      <div onClick={() => handleShowDetails(chartData[0]?.name || "Unknown")} className="cursor-pointer">
        <MarketChartView data={chartData} type={type} />
      </div>

      {showModal && selectedMarket && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-4xl">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">{selectedMarket} Details</h2>
              <p className="text-muted-foreground">
                Detailed information and charts for {selectedMarket} will appear here.
              </p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
