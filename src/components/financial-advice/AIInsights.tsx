
import { Sparkles } from "lucide-react";

interface AIInsightsProps {
  isOnline: boolean;
  aiAdvice: string;
}

export const AIInsights = ({ isOnline, aiAdvice }: AIInsightsProps) => {
  return (
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
  );
};
