
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, Activity, Database, CloudUpload, Waves, Filter, ArrowDownUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const MarketPage = () => {
  const [activeTab, setActiveTab] = useState<string>("api");
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("market");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [uniqueMarkets, setUniqueMarkets] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Type assertion to ensure data is treated as MarketData[]
        setMarketData(data as MarketData[]);
        
        // Extract unique markets with proper type handling
        const marketsArray = data as MarketData[];
        const markets = [...new Set(marketsArray.map((item) => item.market))];
        setUniqueMarkets(markets);
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const sortData = (data: MarketData[]) => {
    return [...data].sort((a, b) => {
      // Handle numeric fields
      if (["price", "volume", "change24h", "high24h", "low24h"].includes(sortField)) {
        const aValue = a[sortField as keyof MarketData] as number;
        const bValue = b[sortField as keyof MarketData] as number;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string fields
      const aValue = String(a[sortField as keyof MarketData]);
      const bValue = String(b[sortField as keyof MarketData]);
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = marketData.filter(item => 
    selectedMarket === "all" || item.market === selectedMarket
  );
  
  const sortedAndFilteredData = sortData(filteredData);

  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Activity className="w-5 h-5 mr-2" /> Market Data Integration
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchMarketData}
            disabled={isLoading}
          >
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="api" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-background/50 backdrop-blur-md">
            <TabsTrigger value="api" className="gap-2">
              <Activity className="w-4 h-4" />
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Real-time market data fetched from API.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedMarket}
                  onValueChange={setSelectedMarket}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by market" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Markets</SelectItem>
                    {uniqueMarkets.map((market) => (
                      <SelectItem key={market} value={market}>{market}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSortDirection}
                  className="flex items-center gap-1"
                >
                  <ArrowDownUp className="h-4 w-4" />
                  <span>{sortDirection === "asc" ? "Ascending" : "Descending"}</span>
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <Skeleton className="h-12 w-[250px]" />
                    <Skeleton className="h-12 w-[150px]" />
                    <Skeleton className="h-12 w-[150px]" />
                    <Skeleton className="h-12 w-[150px]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20" 
                        onClick={() => handleSortChange("market")}
                      >
                        Market {renderSortIcon("market")}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20" 
                        onClick={() => handleSortChange("symbol")}
                      >
                        Symbol {renderSortIcon("symbol")}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20 text-right" 
                        onClick={() => handleSortChange("price")}
                      >
                        Price {renderSortIcon("price")}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20 text-right" 
                        onClick={() => handleSortChange("volume")}
                      >
                        Volume {renderSortIcon("volume")}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20 text-right" 
                        onClick={() => handleSortChange("change24h")}
                      >
                        24h Change {renderSortIcon("change24h")}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20 text-right" 
                        onClick={() => handleSortChange("high24h")}
                      >
                        24h High {renderSortIcon("high24h")}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-secondary/20 text-right" 
                        onClick={() => handleSortChange("low24h")}
                      >
                        24h Low {renderSortIcon("low24h")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredData.length > 0 ? (
                      sortedAndFilteredData.map((item) => (
                        <TableRow key={`${item.market}-${item.symbol}`}>
                          <TableCell>{item.market}</TableCell>
                          <TableCell>{item.symbol}</TableCell>
                          <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.volume.toLocaleString()}</TableCell>
                          <TableCell 
                            className={`text-right ${item.change24h > 0 ? 'text-green-500' : item.change24h < 0 ? 'text-red-500' : ''}`}
                          >
                            {item.change24h > 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-right">{item.high24h.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{item.low24h.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No market data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Database Storage Solution</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  This implementation stores large market datasets in optimized database tables with the following benefits:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Efficient querying and indexing on timestamp, symbol, and market</li>
                  <li>Data partitioning for improved performance with historical data</li>
                  <li>Background data processing for minimal application impact</li>
                  <li>Scheduled cleanup of old data to prevent database bloat</li>
                </ul>
                <Button className="mt-4" variant="outline">
                  Configure Database Storage
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="streaming" className="space-y-4">
            <Alert>
              <Waves className="h-4 w-4" />
              <AlertTitle>Streaming Data Processing</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Process large datasets as continuous streams with these capabilities:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Real-time data processing using chunked data streams</li>
                  <li>Incremental analysis without loading the entire dataset</li>
                  <li>WebSocket integration for live market updates</li>
                  <li>Memory-efficient data handling for very large datasets</li>
                </ul>
                <Button className="mt-4" variant="outline">
                  Configure Streaming Processing
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="sampling" className="space-y-4">
            <Alert>
              <Filter className="h-4 w-4" />
              <AlertTitle>Data Sampling Techniques</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Use statistical sampling to work with representative subsets of your data:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Random sampling with configurable sample sizes</li>
                  <li>Stratified sampling to maintain market representation</li>
                  <li>Time-series specific sampling methods</li>
                  <li>Confidence interval calculations for sample accuracy</li>
                </ul>
                <Button className="mt-4" variant="outline">
                  Configure Data Sampling
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="cloud" className="space-y-4">
            <Alert>
              <CloudUpload className="h-4 w-4" />
              <AlertTitle>Cloud Storage Integration</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  Leverage cloud storage for virtually unlimited market data capacity:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Direct integration with cloud storage providers</li>
                  <li>Secure, encrypted data storage and retrieval</li>
                  <li>Cost-effective storage for historical market data</li>
                  <li>Automated synchronization with local caching</li>
                </ul>
                <Button className="mt-4" variant="outline">
                  Configure Cloud Storage
                </Button>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
