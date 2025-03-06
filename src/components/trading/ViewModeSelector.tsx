
import { FC } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Box, LayoutGrid } from "lucide-react";

export type ViewModeType = "standard" | "3d" | "combined";

interface ViewModeSelectorProps {
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
}

export const ViewModeSelector: FC<ViewModeSelectorProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end mb-2">
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as ViewModeType)}
        className="bg-background/40 backdrop-blur-sm border border-border/30 rounded-md"
      >
        <TabsList className="p-1">
          <TabsTrigger value="standard" className="flex items-center gap-1.5 px-3 py-1.5">
            <Activity className="h-4 w-4" />
            <span>Standard</span>
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-1.5 px-3 py-1.5">
            <Box className="h-4 w-4" />
            <span>3D View</span>
          </TabsTrigger>
          <TabsTrigger value="combined" className="flex items-center gap-1.5 px-3 py-1.5">
            <LayoutGrid className="h-4 w-4" />
            <span>Combined</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
