
import { Card } from "@/components/ui/card";
import { Brain, AlertCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvicePanelProps {
  advice: string | null;
  onRefresh: () => void;
}

export function AdvicePanel({ advice, onRefresh }: AdvicePanelProps) {
  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="w-5 h-5 mr-2" /> Trading Insight
        </h2>
        <div className="flex items-center text-green-400 text-sm">
          <Wifi size={16} className="mr-1" />
          <span>Online</span>
        </div>
      </div>
      
      {advice ? (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground">{advice}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6">
          <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No advice available. Please try again later.</p>
          <Button 
            variant="link" 
            size="sm" 
            onClick={onRefresh}
            className="mt-2"
          >
            Refresh
          </Button>
        </div>
      )}
    </Card>
  );
}
