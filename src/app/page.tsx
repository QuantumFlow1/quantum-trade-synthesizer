
import { GlobalMarketMetrics } from '@/components/market/GlobalMarketMetrics';
import { DetailedMarketCharts } from '@/components/market/DetailedMarketCharts';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Market Overview</h1>
      
      <div className="space-y-6">
        <GlobalMarketMetrics />
        <DetailedMarketCharts />
      </div>
    </div>
  );
}
