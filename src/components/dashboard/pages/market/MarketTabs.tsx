
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, PieChart, TrendingUp, LineChart, BarChart } from "lucide-react";

interface MarketTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MarketTabs = ({ activeTab, onTabChange }: MarketTabsProps) => {
  const handleTabClick = (tab: string) => {
    console.log("Tab selected:", tab);
    onTabChange(tab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabClick} className="mb-6">
      <TabsList className="grid grid-cols-3 bg-secondary/20 backdrop-blur-sm p-1 rounded-lg">
        <TabsTrigger 
          value="enhanced" 
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg"
        >
          <LineChart className="h-4 w-4" />
          <span className="hidden sm:inline">Market Data</span>
          <span className="sm:hidden">Markets</span>
        </TabsTrigger>
        <TabsTrigger 
          value="tokens" 
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg"
        >
          <PieChart className="h-4 w-4" />
          <span className="hidden sm:inline">My Portfolio</span>
          <span className="sm:hidden">Portfolio</span>
        </TabsTrigger>
        <TabsTrigger 
          value="testnet" 
          className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg"
        >
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Testnet</span>
          <span className="sm:hidden">Test</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
