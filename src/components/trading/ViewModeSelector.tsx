
import { FC } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ViewModeType = "standard" | "combined";

interface ViewModeSelectorProps {
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
}

export const ViewModeSelector: FC<ViewModeSelectorProps> = ({ viewMode, setViewMode }) => {
  return (
    <Card className="flex justify-between items-center p-2 backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <div className="text-sm font-medium ml-2">View Mode:</div>
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewModeType)}>
        <TabsList>
          <TabsTrigger value="standard" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Standard</span>
          </TabsTrigger>
          <TabsTrigger value="combined" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Combined</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Card>
  );
};
