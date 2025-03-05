
import { useState } from 'react';

export type ViewMode = "standard" | "3d" | "combined";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("standard");

  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
  };

  return {
    viewMode,
    handleViewModeChange
  };
}
