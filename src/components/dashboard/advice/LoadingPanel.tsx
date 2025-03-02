
import { Card } from "@/components/ui/card";
import { Brain, RefreshCw } from "lucide-react";

export function LoadingPanel() {
  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="w-5 h-5 mr-2" /> Trading Inzicht
        </h2>
        <div className="flex items-center text-blue-400 text-sm">
          <RefreshCw size={16} className="mr-1 animate-spin" />
          <span>Verbinden...</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center">
          <RefreshCw size={24} className="animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">AI-advies wordt geladen...</p>
        </div>
      </div>
    </Card>
  );
}
