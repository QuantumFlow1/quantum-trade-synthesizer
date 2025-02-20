
import { TrendingUp, AlertCircle, Book, BarChart2, Sparkles, Brain, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { checkSupabaseConnection } from "@/lib/supabase";

const FinancialAdvice = () => {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const generateLocalAdvice = () => {
    // Basis lokaal advies gebaseerd op vaste regels
    const localAdvice = `Lokaal Gegenereerd Advies:

1. Trading Strategie:
- Spreid je investeringen over verschillende assets
- Gebruik stop-loss orders voor risicobeheer
- Handel niet meer dan 2% van je portfolio per trade

2. Risico Management:
- Hou altijd een emergency fund aan
- Diversifieer over verschillende sectoren
- Vermijd overmatige leverage

3. Portfolio Allocatie:
- 40% grote bedrijven (blue chips)
- 30% obligaties voor stabiliteit
- 20% groeiende markten
- 10% cash reserve`;

    setAiAdvice(localAdvice);
    toast({
      title: "Lokaal Advies Gegenereerd",
      description: "Basis advies regels toegepast",
    });
  };

  const generateAIAdvice = async () => {
    setIsLoadingAI(true);
    try {
      // Check connection first
      const isConnected = await checkSupabaseConnection();
      setIsOnline(isConnected);

      if (!isConnected) {
        generateLocalAdvice();
        setIsLoadingAI(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: {
          prompt: `Analyseer de huidige marktcondities en geef advies:
            - BTC/USD: $45,234
            - ETH/USD: $2,845
            - Markt Sentiment: Bullish
            - Volatiliteit: Hoog
            
            Geef specifiek advies over:
            1. Trading strategie
            2. Risico management
            3. Portfolio allocatie`
        }
      });

      if (error) throw error;

      setAiAdvice(data.generatedText);
      toast({
        title: "AI Analyse Gereed",
        description: "Nieuwe inzichten beschikbaar",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Offline Modus",
        description: "Schakel over naar lokaal advies",
        variant: "destructive",
      });
      generateLocalAdvice();
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Financieel Advies Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-yellow-500" />
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateAIAdvice}
            disabled={isLoadingAI}
          >
            <Brain className="w-4 h-4 mr-2" />
            {isLoadingAI ? "AI Analyseert..." : isOnline ? "Genereer AI Analyse" : "Genereer Lokaal Advies"}
          </Button>
        </div>
      </div>

      {/* AI/Lokale Inzichten */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400">{isOnline ? "AI Trading Inzichten" : "Lokale Trading Inzichten"}</span>
        </h3>
        <div className="space-y-3">
          {aiAdvice ? (
            <div className="p-3 rounded bg-blue-500/5">
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {aiAdvice}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded bg-blue-500/5">
              <div className="text-sm text-muted-foreground">
                Klik op "{isOnline ? 'Genereer AI Analyse' : 'Genereer Lokaal Advies'}" voor {isOnline ? 'gepersonaliseerd' : 'basis'} advies.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Diversificatie */}
      <div className="p-4 rounded-lg bg-secondary/50">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          Portfolio Diversificatie
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Aandelen</div>
            <div className="text-lg font-medium">40%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Obligaties</div>
            <div className="text-lg font-medium">30%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Crypto</div>
            <div className="text-lg font-medium">20%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Grondstoffen</div>
            <div className="text-lg font-medium">10%</div>
          </div>
        </div>
      </div>

      {/* Risico-Rendement Analyse */}
      <div className="p-4 rounded-lg bg-secondary/50">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Risico-Rendement Analyse
        </h3>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Verwacht Rendement (Jaar)</div>
            <div className="text-lg font-medium text-green-400">+12.5%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Risico Score</div>
            <div className="text-lg font-medium text-yellow-400">7/10</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Sharpe Ratio</div>
            <div className="text-lg font-medium">1.8</div>
          </div>
        </div>
      </div>

      {/* Aanbevelingen */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Aanbevelingen
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Overweeg obligatie allocatie te verhogen voor meer stabiliteit</li>
          <li>• Crypto exposure verminderen gezien huidige marktvolatiliteit</li>
          <li>• Spreid aandelen positie over meerdere sectoren</li>
          <li>• Implementeer stop-loss orders voor risicovolle posities</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancialAdvice;
