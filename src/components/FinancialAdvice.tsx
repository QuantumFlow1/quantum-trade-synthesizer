import { TrendingUp, AlertCircle, Book, BarChart2, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FinancialAdvice = () => {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const generateAIAdvice = async () => {
    setIsLoadingAI(true);
    try {
      const response = await fetch('https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          marketData: {
            btcPrice: 45234.12,
            ethPrice: 2845.67,
            marketSentiment: "bullish",
            volatilityIndex: "high"
          }
        })
      });

      if (!response.ok) throw new Error('AI analyse generatie mislukt');

      const data = await response.json();
      toast({
        title: "AI Analyse Gereed",
        description: "Nieuwe inzichten beschikbaar",
      });
    } catch (error) {
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
          <div className="p-3 rounded bg-blue-500/5">
            <div className="text-sm font-medium mb-1">Trend Analyse</div>
            <div className="text-sm text-muted-foreground">
              BTC toont bullish divergentie op 4H timeframe. Overweeg long positie met tight stop-loss.
            </div>
          </div>
          <div className="p-3 rounded bg-blue-500/5">
            <div className="text-sm font-medium mb-1">Sentiment Analyse</div>
            <div className="text-sm text-muted-foreground">
              Social sentiment indicators tonen toenemend optimisme. Volume ondersteunt de trend.
            </div>
          </div>
          <div className="p-3 rounded bg-blue-500/5">
            <div className="text-sm font-medium mb-1">Risk Assessment</div>
            <div className="text-sm text-muted-foreground">
              Huidige markt volatiliteit suggereert kleinere posities en wijdere stops.
            </div>
          </div>
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
        <Button variant="outline" size="sm" className="mt-4">
          Bekijk Gedetailleerd Advies
        </Button>
      </div>

      {/* Market Condities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-green-500/10">
          <div className="text-sm text-muted-foreground mb-1">Markt Sentiment</div>
          <div className="text-lg font-medium text-green-400">Bullish</div>
        </div>
        <div className="p-4 rounded-lg bg-yellow-500/10">
          <div className="text-sm text-muted-foreground mb-1">Volatiliteit Index</div>
          <div className="text-lg font-medium text-yellow-400">Verhoogd</div>
        </div>
        <div className="p-4 rounded-lg bg-blue-500/10">
          <div className="text-sm text-muted-foreground mb-1">Economische Cyclus</div>
          <div className="text-lg font-medium text-blue-400">Expansie</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAdvice;
