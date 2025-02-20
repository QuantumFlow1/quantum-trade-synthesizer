
import { TrendingUp, AlertCircle, Book, BarChart2, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const FinancialAdvice = () => {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");

  const generateAIAdvice = async () => {
    setIsLoadingAI(true);
    try {
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
        title: "Error",
        description: "Kon geen AI analyse genereren",
        variant: "destructive",
      });
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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateAIAdvice}
          disabled={isLoadingAI}
        >
          <Brain className="w-4 h-4 mr-2" />
          {isLoadingAI ? "AI Analyseert..." : "Genereer AI Analyse"}
        </Button>
      </div>

      {/* AI Inzichten */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400">AI Trading Inzichten</span>
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
                Klik op "Genereer AI Analyse" voor gepersonaliseerd advies.
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
