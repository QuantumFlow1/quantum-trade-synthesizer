
import React from "react";
import { Loader2 } from "lucide-react";

export const MarketLoading: React.FC = () => {
  return (
    <div className="w-full h-[200px] flex items-center justify-center bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Marktdata wordt geladen...</p>
      </div>
    </div>
  );
};
