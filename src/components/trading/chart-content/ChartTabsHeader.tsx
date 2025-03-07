
import React from "react";
import { Activity, CandlestickChart, BarChart2 } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const ChartTabsHeader = () => {
  return (
    <TabsList className="bg-background/50 backdrop-blur-md">
      <TabsTrigger value="price" className="gap-2">
        <CandlestickChart className="w-4 h-4" />
        Price
      </TabsTrigger>
      <TabsTrigger value="volume" className="gap-2">
        <BarChart2 className="w-4 h-4" />
        Volume
      </TabsTrigger>
      <TabsTrigger value="indicators" className="gap-2">
        <Activity className="w-4 h-4" />
        Indicators
      </TabsTrigger>
    </TabsList>
  );
};

export default ChartTabsHeader;
