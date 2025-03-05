
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Box, LayoutGrid } from "lucide-react";

type ViewMode = "standard" | "3d" | "combined";

interface ViewModeTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}

export const ViewModeTabs: React.FC<ViewModeTabsProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex justify-end mb-2">
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => onViewModeChange(value as ViewMode)}
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
