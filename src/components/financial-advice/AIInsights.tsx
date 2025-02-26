
import { Sparkles } from "lucide-react";

interface AIInsightsProps {
  isOnline: boolean;
  aiAdvice: string;
}

export const AIInsights = ({ isOnline, aiAdvice }: AIInsightsProps) => {
  return (
    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 min-h-[200px] flex flex-col">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span className="text-blue-400">{isOnline ? "AI Trading Inzichten" : "Trading Inzichten (Offline)"}</span>
      </h3>
      <div className="space-y-3 flex-1">
        {aiAdvice ? (
          <div className="p-3 rounded bg-blue-500/5 h-full">
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {aiAdvice}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded bg-blue-500/5 h-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground text-center">
              {isOnline 
                ? "Klik op \"Genereer AI Analyse\" voor gepersonaliseerd advies."
                : "AI service is momenteel offline. Probeer het later opnieuw."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
