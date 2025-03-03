
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { ChartData } from "./types";
import { Button } from "../ui/button";

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketName: string | null;
  marketData: ChartData[];
}

export const MarketDetailModal = ({
  isOpen,
  onClose,
  marketName,
  marketData
}: MarketDetailModalProps) => {
  const [currentTab, setCurrentTab] = useState<string>("chart");

  useEffect(() => {
    // Reset tab to chart when opening modal
    if (isOpen) {
      setCurrentTab("chart");
    }
  }, [isOpen]);

  if (!marketName || !marketData.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{marketName}</h2>
          <p className="text-sm text-muted-foreground">Market details and charts</p>
        </div>

        <Tabs defaultValue="chart" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="chart">Price & Chart</TabsTrigger>
            <TabsTrigger value="info">Market Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-6">
            <div className="h-[300px] bg-secondary/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart view for {marketName}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Detailed market information for {marketName}
              </p>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
