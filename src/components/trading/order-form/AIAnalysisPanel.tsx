
import { useState, useEffect } from "react";
import { Brain, TrendingUp, AlertTriangle, Users, Wifi, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AIAnalysisPanelProps {
  aiAnalysis?: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation: number;
    takeProfitRecommendation: number;
    collaboratingAgents: string[];
  };
  isOnline?: boolean;
}

export const AIAnalysisPanel = ({ aiAnalysis, isOnline = false }: AIAnalysisPanelProps) => {
  const { toast } = useToast();
  const [showTips, setShowTips] = useState(false);
  const [localIsOnline, setLocalIsOnline] = useState<boolean>(isOnline);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Als de prop verandert, werk dan de lokale status bij
  useEffect(() => {
    setLocalIsOnline(isOnline);
  }, [isOnline]);

  const defaultAnalysis = {
    confidence: 0,
    riskLevel: "Onbekend",
    recommendation: "Niet beschikbaar",
    expectedProfit: "Niet beschikbaar",
    stopLossRecommendation: 0,
    takeProfitRecommendation: 0,
    collaboratingAgents: ["Geen actieve agents"]
  };

  const analysis = aiAnalysis || defaultAnalysis;

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  const handleManualUpdate = async () => {
    setIsChecking(true);
    toast({
      title: "Handmatige verbinding",
      description: "Proberen te verbinden met de AI service...",
    });
    
    try {
      // Controleer de API-verbinding
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      
      // Als we hier komen, is de verbinding geslaagd
      setLocalIsOnline(true);
      toast({
        title: "Verbinding geslaagd",
        description: "De AI analyseservice is nu beschikbaar.",
      });
    } catch (error) {
      console.error("Fout bij verbinden met AI service:", error);
      setLocalIsOnline(false);
      toast({
        title: "Verbindingsstatus",
        description: "De AI analyseservice is momenteel niet beschikbaar. Controleer de API-status in het beheerdersdashboard.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Wanneer de status offline is, toon een alternatieve weergave
  if (!localIsOnline) {
    return (
      <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
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
            De AI analyseservice is momenteel niet beschikbaar. Dit kan komen door een ongeldige API sleutel of een tijdelijke onderbreking van de service.
          </p>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={toggleTips}
          >
            {showTips ? "Verberg" : "Toon"} handmatige trading tips
          </Button>
          
          {showTips && (
            <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">Basis Trading Tips:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Zet altijd een stop-loss om verliezen te beperken</li>
                <li>Handel niet met meer dan 2% van je portfolio per trade</li>
                <li>Let op marktvolatiliteit voor het bepalen van in- en uitstappunten</li>
                <li>Overweeg technische indicatoren zoals RSI en MACD</li>
                <li>Volg de markttrend en trend niet tegen de algemene richting in</li>
              </ul>
            </div>
          )}
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full" 
            onClick={handleManualUpdate}
            disabled={isChecking}
          >
            {isChecking ? "Verbinding controleren..." : "Probeer opnieuw te verbinden"}
          </Button>
        </div>
      </Card>
    );
  }

  // Normale weergave wanneer online
  return (
    <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">AI Trading Analyse</h3>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <Wifi className="w-4 h-4" />
          <span className="text-sm">Online</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Vertrouwen: {analysis.confidence}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span>Risico: {analysis.riskLevel}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>Verwachte winst: {analysis.expectedProfit}</div>
          <div>Aanbeveling: {analysis.recommendation}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>Samenwerkende AI Agents: {analysis.collaboratingAgents.join(", ")}</span>
      </div>
    </Card>
  );
};
