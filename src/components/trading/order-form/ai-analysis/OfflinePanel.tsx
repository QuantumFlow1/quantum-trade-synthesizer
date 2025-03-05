
import { useState } from "react";
import { WifiOff, Brain, RefreshCw, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TradingTips } from "./TradingTips";
import { ApiKeySheet } from "./ApiKeySheet";

interface OfflinePanelProps {
  isKeySheetOpen: boolean;
  setIsKeySheetOpen: (open: boolean) => void;
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  claudeKey: string;
  setClaudeKey: (key: string) => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  deepseekKey: string;
  setDeepseekKey: (key: string) => void;
  saveApiKeys: () => void;
  handleManualUpdate: () => void;
  isChecking: boolean;
}

export const OfflinePanel = ({ 
  isKeySheetOpen,
  setIsKeySheetOpen,
  openaiKey,
  setOpenaiKey,
  claudeKey,
  setClaudeKey,
  geminiKey,
  setGeminiKey,
  deepseekKey,
  setDeepseekKey,
  saveApiKeys,
  handleManualUpdate,
  isChecking
}: OfflinePanelProps) => {
  const [showTips, setShowTips] = useState(false);

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-medium text-muted-foreground">AI Trading Analyse</h3>
        </div>
        <div className="flex items-center gap-2 text-red-400">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline</span>
        </div>
      </div>
      
      <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-md mb-4">
        <p className="text-sm text-muted-foreground">
          De AI analyseservice is momenteel niet beschikbaar. Dit kan komen door een ontbrekende API sleutel of een tijdelijke onderbreking van de service.
        </p>
      </div>

      <div className="space-y-2">
        <ApiKeySheet 
          isOpen={isKeySheetOpen}
          onOpenChange={setIsKeySheetOpen}
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          claudeKey={claudeKey}
          setClaudeKey={setClaudeKey}
          geminiKey={geminiKey}
          setGeminiKey={setGeminiKey}
          deepseekKey={deepseekKey}
          setDeepseekKey={setDeepseekKey}
          onSave={saveApiKeys}
        />

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-2" 
          onClick={() => setIsKeySheetOpen(true)}
        >
          <Key className="w-4 h-4 mr-2" />
          API Sleutels Configureren
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={toggleTips}
        >
          {showTips ? "Verberg" : "Toon"} handmatige trading tips
        </Button>
        
        {showTips && <TradingTips />}
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full" 
          onClick={handleManualUpdate}
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Verbinding controleren...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Probeer opnieuw te verbinden
            </>
          )}
        </Button>
      </div>
    </>
  );
};
