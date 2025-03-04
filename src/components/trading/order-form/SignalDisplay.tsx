
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SignalDisplayProps {
  signal: any;
  apiAvailable: boolean;
  onApply: () => void;
}

export const SignalDisplay = ({ signal, apiAvailable, onApply }: SignalDisplayProps) => {
  if (!signal) return null;
  
  return (
    <div className="p-3 bg-primary/10 rounded-lg mt-2">
      <div className="text-sm font-medium mb-1 flex justify-between">
        <span>{signal.direction} Signaal ({signal.confidence}% vertrouwen)</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={onApply}
          disabled={!apiAvailable}
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Toepassen
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Redenering: {signal.reasoning}
      </div>
    </div>
  );
};
