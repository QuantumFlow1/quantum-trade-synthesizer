
import { useState } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LayoutGrid, 
  LayoutPanelTop, 
  LayoutPanelLeft,
  LayoutList,
  Maximize2,
  X
} from "lucide-react";
import { ChartViews } from "./ChartViews";

interface MultiChartLayoutProps {
  data: TradingDataPoint[];
  onClose?: () => void;
}

type ChartConfig = {
  id: string;
  view: "price" | "volume" | "indicators";
  indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx";
  chartType: "candles" | "line" | "area" | "bars";
  showDrawingTools: boolean;
};

type LayoutType = "2x1" | "1x2" | "2x2" | "1x1";

export const MultiChartLayout = ({ data, onClose }: MultiChartLayoutProps) => {
  const [layoutType, setLayoutType] = useState<LayoutType>("2x1");
  const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);
  
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([
    {
      id: "chart1",
      view: "price",
      indicator: "sma",
      chartType: "candles",
      showDrawingTools: false
    },
    {
      id: "chart2",
      view: "indicators",
      indicator: "rsi",
      chartType: "line",
      showDrawingTools: false
    },
    {
      id: "chart3",
      view: "volume",
      indicator: "sma",
      chartType: "bars",
      showDrawingTools: false
    },
    {
      id: "chart4",
      view: "indicators",
      indicator: "macd",
      chartType: "line",
      showDrawingTools: false
    }
  ]);
  
  const updateChartConfig = (id: string, config: Partial<ChartConfig>) => {
    setChartConfigs(prev => 
      prev.map(chart => 
        chart.id === id ? { ...chart, ...config } : chart
      )
    );
  };
  
  const getVisibleCharts = () => {
    if (fullscreenChart) {
      return chartConfigs.filter(chart => chart.id === fullscreenChart);
    }
    
    switch (layoutType) {
      case "1x1":
        return chartConfigs.slice(0, 1);
      case "2x1":
        return chartConfigs.slice(0, 2);
      case "1x2":
        return chartConfigs.slice(0, 2);
      case "2x2":
        return chartConfigs.slice(0, 4);
      default:
        return chartConfigs.slice(0, 2);
    }
  };
  
  const renderCharts = () => {
    const visibleCharts = getVisibleCharts();
    
    if (layoutType === "1x1" || fullscreenChart) {
      return (
        <div className="h-full">
          {renderChart(visibleCharts[0])}
        </div>
      );
    }
    
    if (layoutType === "2x1") {
      return (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            {renderChart(visibleCharts[0])}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            {renderChart(visibleCharts[1])}
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    }
    
    if (layoutType === "1x2") {
      return (
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            {renderChart(visibleCharts[0])}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            {renderChart(visibleCharts[1])}
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    }
    
    if (layoutType === "2x2") {
      return (
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                {renderChart(visibleCharts[0])}
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>
                {renderChart(visibleCharts[1])}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                {renderChart(visibleCharts[2])}
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>
                {renderChart(visibleCharts[3])}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    }
    
    return null;
  };
  
  const renderChart = (config: ChartConfig) => {
    return (
      <div className="relative h-full">
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          <Select 
            value={config.view}
            onValueChange={(value) => updateChartConfig(config.id, { view: value as any })}
          >
            <SelectTrigger className="h-7 w-[100px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="indicators">Indicators</SelectItem>
            </SelectContent>
          </Select>
          
          {config.view === "indicators" && (
            <Select 
              value={config.indicator}
              onValueChange={(value) => updateChartConfig(config.id, { indicator: value as any })}
            >
              <SelectTrigger className="h-7 w-[100px]">
                <SelectValue placeholder="Indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sma">SMA</SelectItem>
                <SelectItem value="ema">EMA</SelectItem>
                <SelectItem value="rsi">RSI</SelectItem>
                <SelectItem value="macd">MACD</SelectItem>
                <SelectItem value="bollinger">Bollinger</SelectItem>
                <SelectItem value="stochastic">Stochastic</SelectItem>
                <SelectItem value="adx">ADX</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => updateChartConfig(config.id, { showDrawingTools: !config.showDrawingTools })}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => setFullscreenChart(fullscreenChart ? null : config.id)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-full pt-10">
          <ChartViews
            data={data}
            view={config.view}
            indicator={config.indicator}
            chartType={config.chartType}
            showDrawingTools={config.showDrawingTools}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 flex items-center justify-between bg-secondary/10 border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant={layoutType === "1x1" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setLayoutType("1x1")}
          >
            <LayoutPanelTop className="h-4 w-4" />
          </Button>
          <Button
            variant={layoutType === "2x1" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setLayoutType("2x1")}
          >
            <LayoutPanelLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={layoutType === "1x2" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setLayoutType("1x2")}
          >
            <LayoutPanelLeft className="h-4 w-4 rotate-90" />
          </Button>
          <Button
            variant={layoutType === "2x2" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setLayoutType("2x2")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
        
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        {renderCharts()}
      </div>
    </div>
  );
};
