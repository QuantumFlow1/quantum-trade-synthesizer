
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, PieChart, TrendingUp } from "lucide-react";

interface MarketTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MarketTabs = ({ activeTab, onTabChange }: MarketTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-4">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="enhanced" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Enhanced View</span>
        </TabsTrigger>
        <TabsTrigger value="tokens" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          <span className="hidden sm:inline">My Tokens</span>
        </TabsTrigger>
        <TabsTrigger value="testnet" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Testnet</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
