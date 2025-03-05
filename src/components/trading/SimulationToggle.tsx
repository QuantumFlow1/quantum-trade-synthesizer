
import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Lightbulb, BookOpen, CheckCircle2, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SimulationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const SimulationToggle = ({ enabled, onToggle }: SimulationToggleProps) => {
  const [isEnglish, setIsEnglish] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const guideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const lang = localStorage.getItem('preferredLanguage');
    setIsEnglish(lang !== 'nl');
    
    const hasSeenGuide = localStorage.getItem('hasSeenSimulationGuide');
    setShowGuide(!hasSeenGuide && enabled);
    
    if (enabled && !hasSeenGuide) {
      localStorage.setItem('hasSeenSimulationGuide', 'true');
      
      // Clear any existing timer
      if (guideTimerRef.current) {
        clearTimeout(guideTimerRef.current);
      }
      
      // Set new timer
      guideTimerRef.current = setTimeout(() => setShowGuide(false), 10000);
    }
    
    // Cleanup
    return () => {
      if (guideTimerRef.current) {
        clearTimeout(guideTimerRef.current);
      }
    };
  }, [enabled]);

  const handleToggle = (value: boolean) => {
    onToggle(value);
    if (value) {
      setShowGuide(true);
      
      // Clear any existing timer
      if (guideTimerRef.current) {
        clearTimeout(guideTimerRef.current);
      }
      
      // Set new timer
      guideTimerRef.current = setTimeout(() => setShowGuide(false), 10000);
    }
  };

  const getBackgroundStyle = () => {
    const baseClasses = "flex items-center space-x-2 p-3 rounded-md transition-all duration-500";
    
    if (enabled) {
      return `${baseClasses} bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/40 shadow-md shadow-green-500/10`;
    }
    
    return `${baseClasses} bg-gradient-to-r from-green-500/5 to-green-400/5 border border-green-500/20`;
  };

  return (
    <div className={getBackgroundStyle()}>
      <motion.div 
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          id="simulation-mode"
          className={enabled ? "bg-green-500" : ""}
        />
      </motion.div>
      
      <Label htmlFor="simulation-mode" className="cursor-pointer font-medium">
        {isEnglish ? "Simulation Mode" : "Simulatiemodus"}
      </Label>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              
              <AnimatePresence>
                {enabled && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="ml-2 flex items-center text-xs text-green-600 font-medium"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {isEnglish ? "Active" : "Actief"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-slate-900/90 backdrop-blur-sm border-slate-800 text-slate-200">
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {isEnglish ? "Simulation Mode" : "Simulatiemodus"}
              </h4>
              <p className="text-xs">
                {isEnglish 
                  ? "In simulation mode, orders are not actually executed. Ideal for testing strategies without risk. Our AI Hedge Fund guide recommends starting with simulations to develop effective trading strategies."
                  : "In simulatiemodus worden orders niet echt uitgevoerd. Ideaal om strategieën te testen zonder risico. Onze AI Hedge Fund gids raadt aan om te beginnen met simulaties om effectieve handelsstrategieën te ontwikkelen."}
              </p>
              <div className="pt-1 border-t border-slate-700/50">
                <p className="text-xs italic text-slate-400">
                  {isEnglish 
                    ? "All profits and losses are simulated."
                    : "Alle winsten en verliezen worden gesimuleerd."}
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <AnimatePresence>
        {showGuide && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute top-full left-0 right-0 mt-2 p-3 bg-gradient-to-br from-green-50 to-green-100/70 dark:from-green-900/20 dark:to-green-800/10 backdrop-blur-md border border-green-200 dark:border-green-800 rounded-md shadow-xl z-10"
          >
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm text-green-800 dark:text-green-300">
                  {isEnglish ? "Simulation Mode Activated" : "Simulatiemodus geactiveerd"}
                </h4>
                <p className="text-xs mt-1 text-green-700 dark:text-green-400">
                  {isEnglish 
                    ? "Best practices from our AI Hedge Fund guide:" 
                    : "Best practices uit onze AI Hedge Fund gids:"}
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-start gap-2 bg-white/40 dark:bg-green-900/40 p-2 rounded-md">
                    <BarChart3 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-800 dark:text-green-300">
                      {isEnglish 
                        ? "Test various entry and exit strategies" 
                        : "Test verschillende in- en uitstapstrategieën"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/40 dark:bg-green-900/40 p-2 rounded-md">
                    <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-800 dark:text-green-300">
                      {isEnglish 
                        ? "Monitor AI agent recommendations" 
                        : "Monitor AI-agent aanbevelingen"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/40 dark:bg-green-900/40 p-2 rounded-md">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-800 dark:text-green-300">
                      {isEnglish 
                        ? "Analyze trading results before using real funds" 
                        : "Analyseer handelsresultaten voordat je echt geld gebruikt"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
