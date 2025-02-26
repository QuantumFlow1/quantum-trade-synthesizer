
import { CloudUpload, Database, Filter, Waves } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketTabContent } from "./MarketTabContent";
import { MarketData } from "@/components/market/types";
import { MarketFilters } from "./MarketFilters";
import { MarketDataTable } from "./MarketDataTable";

interface MarketTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isLoading: boolean;
  selectedMarket: string;
  setSelectedMarket: (value: string) => void;
  sortDirection: "asc" | "desc";
  toggleSortDirection: () => void;
  sortField: string;
  handleSortChange: (field: string) => void;
  sortedAndFilteredData: MarketData[];
  uniqueMarkets: string[];
}

export const MarketTabs = ({
  activeTab,
  setActiveTab,
  isLoading,
  selectedMarket,
  setSelectedMarket,
  sortDirection,
  toggleSortDirection,
  sortField,
  handleSortChange,
  sortedAndFilteredData,
  uniqueMarkets,
}: MarketTabsProps) => {
  return (
    <Tabs defaultValue="api" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="mb-4 bg-background/50 backdrop-blur-md">
        <TabsTrigger value="api" className="gap-2">
          <span className="w-4 h-4">📊</span>
          API Integration
        </TabsTrigger>
        <TabsTrigger value="database" className="gap-2">
          <Database className="w-4 h-4" />
          Database Storage
        </TabsTrigger>
        <TabsTrigger value="streaming" className="gap-2">
          <Waves className="w-4 h-4" />
          Streaming Data
        </TabsTrigger>
        <TabsTrigger value="sampling" className="gap-2">
          <Filter className="w-4 h-4" />
          Data Sampling
        </TabsTrigger>
        <TabsTrigger value="cloud" className="gap-2">
          <CloudUpload className="w-4 h-4" />
          Cloud Storage
        </TabsTrigger>
      </TabsList>

      <TabsContent value="api" className="space-y-4">
        <MarketFilters
          selectedMarket={selectedMarket}
          onMarketChange={setSelectedMarket}
          sortDirection={sortDirection}
          onSortDirectionToggle={toggleSortDirection}
          uniqueMarkets={uniqueMarkets}
        />

        <MarketDataTable
          isLoading={isLoading}
          data={sortedAndFilteredData}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      </TabsContent>

      <TabsContent value="database" className="space-y-4">
        <MarketTabContent
          icon={<Database className="h-4 w-4" />}
          title="Database Storage Solution"
          description={[
            "This implementation stores large market datasets in optimized database tables with the following benefits:",
            "Efficient querying and indexing on timestamp, symbol, and market",
            "Data partitioning for improved performance with historical data",
            "Background data processing for minimal application impact",
            "Scheduled cleanup of old data to prevent database bloat",
          ]}
          buttonText="Configure Database Storage"
        />
      </TabsContent>

      <TabsContent value="streaming" className="space-y-4">
        <MarketTabContent
          icon={<Waves className="h-4 w-4" />}
          title="Streaming Data Processing"
          description={[
            "Process large datasets as continuous streams with these capabilities:",
            "Real-time data processing using chunked data streams",
            "Incremental analysis without loading the entire dataset",
            "WebSocket integration for live market updates",
            "Memory-efficient data handling for very large datasets",
          ]}
          buttonText="Configure Streaming Processing"
        />
      </TabsContent>

      <TabsContent value="sampling" className="space-y-4">
        <MarketTabContent
          icon={<Filter className="h-4 w-4" />}
          title="Data Sampling Techniques"
          description={[
            "Use statistical sampling to work with representative subsets of your data:",
            "Random sampling with configurable sample sizes",
            "Stratified sampling to maintain market representation",
            "Time-series specific sampling methods",
            "Confidence interval calculations for sample accuracy",
          ]}
          buttonText="Configure Data Sampling"
        />
      </TabsContent>

      <TabsContent value="cloud" className="space-y-4">
        <MarketTabContent
          icon={<CloudUpload className="h-4 w-4" />}
          title="Cloud Storage Integration"
          description={[
            "Leverage cloud storage for virtually unlimited market data capacity:",
            "Direct integration with cloud storage providers",
            "Secure, encrypted data storage and retrieval",
            "Cost-effective storage for historical market data",
            "Automated synchronization with local caching",
          ]}
          buttonText="Configure Cloud Storage"
        />
      </TabsContent>
    </Tabs>
  );
};
