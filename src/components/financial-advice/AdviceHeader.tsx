
import { Book, Wifi, WifiOff, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdviceHeaderProps {
  isOnline: boolean;
  isLoadingAI: boolean;
  onGenerateAdvice: () => void;
}

export const AdviceHeader = ({ isOnline, isLoadingAI, onGenerateAdvice }: AdviceHeaderProps) => {
  return (
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
          onClick={onGenerateAdvice}
          disabled={isLoadingAI}
        >
          <Brain className="w-4 h-4 mr-2" />
          {isLoadingAI ? "AI Analyseert..." : isOnline ? "Genereer AI Analyse" : "Genereer Lokaal Advies"}
        </Button>
      </div>
    </div>
  );
};
