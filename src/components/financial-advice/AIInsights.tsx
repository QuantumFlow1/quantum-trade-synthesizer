
import { useState } from "react";
import { Sparkles, RefreshCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AIInsightsProps {
  isOnline: boolean;
  aiAdvice: string;
}

export const AIInsights = ({ isOnline, aiAdvice }: AIInsightsProps) => {
  const [advice, setAdvice] = useState<string>(aiAdvice);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { toast } = useToast();

  const generateNewAdvice = async () => {
    if (!isOnline) {
      toast({
        title: "AI Service Offline",
        description: "The AI service is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
        body: { market: "crypto", timeframe: "short" }
      });
      
      if (error) throw error;
      
      if (data && data.advice) {
        setAdvice(data.advice);
        toast({
          title: "AI Analysis Generated",
          description: "New trading insights have been successfully generated.",
        });
      }
    } catch (error) {
      console.error("Error generating AI advice:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate AI analysis. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 min-h-[200px] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400">{isOnline ? "AI Trading Insights" : "Trading Insights (Offline)"}</span>
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-blue-400 hover:text-blue-500 hover:bg-blue-500/10"
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            <span className="text-xs">{expanded ? "Less" : "More"}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-blue-400 hover:text-blue-500 hover:bg-blue-500/10 border-blue-400/30"
            onClick={generateNewAdvice}
            disabled={isLoading || !isOnline}
          >
            <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Generate</span>
          </Button>
        </div>
      </div>
      
      <div className={`space-y-3 flex-1 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[800px]' : 'max-h-[145px]'}`}>
        {advice ? (
          <div className="p-3 rounded bg-blue-500/5 h-full overflow-y-auto">
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {advice}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded bg-blue-500/5 h-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground text-center">
              {isOnline 
                ? "Click \"Generate\" for personalized advice."
                : "AI service is currently offline. Please try again later."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
