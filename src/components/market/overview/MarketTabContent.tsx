
import { TabsContent } from "@/components/ui/tabs";
import { MarketCharts } from "../MarketCharts";

interface MarketTabContentProps {
  market: string;
  data: any[];
  isLoading: boolean;
}

export const MarketTabContent = ({ market, data, isLoading }: MarketTabContentProps) => {
  return (
    <TabsContent 
      key={market}
      value={market} 
      className="mt-0 h-full animate-in fade-in-50 duration-500 ease-out"
    >
      <MarketCharts 
        data={data || []} 
        isLoading={isLoading} 
        type="overview" 
      />
    </TabsContent>
  );
};
