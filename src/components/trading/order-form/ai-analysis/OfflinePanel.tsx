
import { Brain, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OfflinePanelProps {
  onConnectClick: () => void;
}

export const OfflinePanel = ({ onConnectClick }: OfflinePanelProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">AI Trading Analyse</h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <p className="text-sm text-muted-foreground">
          AI analyse is momenteel niet beschikbaar. Verbind met de API om AI-analyses en aanbevelingen te ontvangen.
        </p>
        <div className="text-xs text-muted-foreground/70 space-y-1">
          <p>• Realtime marktupdates elke 5-15 seconden</p>
          <p>• AI-gestuurde handelsaanbevelingen</p>
          <p>• Risico- en winstanalyse per trade</p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mb-4"
        onClick={onConnectClick}
      >
        Verbind met AI Service
      </Button>
    </>
  );
};
