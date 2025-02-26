
import { Book, Wifi, WifiOff, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdviceHeaderProps {
  isOnline: boolean;
  isLoadingAI: boolean;
  onGenerateAdvice: () => void;
}

export const AdviceHeader = ({ isOnline, isLoadingAI, onGenerateAdvice }: AdviceHeaderProps) => {
  return (
    <div className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 rounded-lg p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] overflow-hidden group mb-4">
      {/* Morphing background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:translate-x-4 transition-transform duration-700" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:translate-x-4 transition-transform duration-700" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-2">
          <Book className="w-5 h-5 text-primary/80" />
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
            Financieel Advies Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-yellow-500 animate-pulse" />
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGenerateAdvice}
            disabled={isLoadingAI}
            className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group-hover:translate-y-[-2px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Brain className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">
              {isLoadingAI ? "AI Analyseert..." : isOnline ? "Genereer AI Analyse" : "Genereer Lokaal Advies"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
