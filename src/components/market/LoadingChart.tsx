
import { Loader2 } from "lucide-react";

export const LoadingChart = () => (
  <div className="h-full w-full flex items-center justify-center bg-secondary/20 rounded-lg">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mb-2 mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Marktdata wordt geladen...</p>
    </div>
  </div>
);
