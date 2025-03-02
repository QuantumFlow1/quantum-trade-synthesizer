
import { Card } from "@/components/ui/card";
import { Brain, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIKeyConfigSheet } from "./AIKeyConfigSheet";
import { useState } from "react";

interface UnavailablePanelProps {
  isCheckingKeys: boolean;
  onManualCheck: () => void;
}

export function UnavailablePanel({ isCheckingKeys, onManualCheck }: UnavailablePanelProps) {
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="w-5 h-5 mr-2" /> Trading Inzicht
        </h2>
        <div className="flex items-center text-red-400 text-sm">
          <WifiOff size={16} className="mr-1" />
          <span>Offline</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-md text-sm text-muted-foreground">
          <h3 className="font-medium text-red-300 mb-1">AI Service niet beschikbaar</h3>
          <p>Er zijn geen API sleutels geconfigureerd of de service is tijdelijk niet beschikbaar.</p>
        </div>
        
        <div className="bg-card/50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Wat u kunt doen:</h3>
          <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
            <li>Controleer of u API sleutels heeft ingesteld in het admin paneel</li>
            <li>Stel uw eigen API sleutels in via de instellingen</li>
            <li>Controleer uw internetverbinding</li>
          </ul>
        </div>
        
        <AIKeyConfigSheet
          isOpen={isKeySheetOpen}
          onOpenChange={setIsKeySheetOpen}
          onSave={() => {}}
          onManualCheck={onManualCheck}
        />
        
        <Button 
          className="w-full" 
          variant="secondary" 
          size="sm"
          onClick={onManualCheck}
          disabled={isCheckingKeys}
        >
          {isCheckingKeys ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Controleren...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Opnieuw proberen
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
