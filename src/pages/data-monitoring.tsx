
import { useState } from "react";
import Head from "next/head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingDataMonitor } from "@/components/monitoring/TradingDataMonitor";
import { AdvancedIndicatorsDemo } from "@/components/advanced-indicators/AdvancedIndicatorsDemo";
import { BacktestingSimulationPanel } from "@/components/backtesting/BacktestingSimulationPanel";
import { PerformanceMetricsViewer } from "@/components/advanced-indicators/PerformanceMetricsViewer";

export default function DataMonitoringPage() {
  const [activeTab, setActiveTab] = useState("monitor");

  return (
    <>
      <Head>
        <title>Trading System Monitoring</title>
        <meta name="description" content="Advanced data monitoring and system performance tracking" />
      </Head>

      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Trading System Monitoring</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="monitor">System Monitor</TabsTrigger>
            <TabsTrigger value="indicators">Advanced Indicators</TabsTrigger>
            <TabsTrigger value="backtesting">Backtesting</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="w-full">
            <TradingDataMonitor />
          </TabsContent>

          <TabsContent value="indicators" className="w-full">
            <AdvancedIndicatorsDemo />
          </TabsContent>

          <TabsContent value="backtesting" className="w-full">
            <BacktestingSimulationPanel />
          </TabsContent>

          <TabsContent value="performance" className="w-full">
            <PerformanceMetricsViewer />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
