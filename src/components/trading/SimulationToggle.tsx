
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, Lightbulb, BookOpen, CheckCircle2 } from "lucide-react";

interface SimulationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const SimulationToggle = ({ enabled, onToggle }: SimulationToggleProps) => {
  const [isEnglish, setIsEnglish] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  
  useEffect(() => {
    const lang = localStorage.getItem('preferredLanguage');
    setIsEnglish(lang !== 'nl');
    
    const hasSeenGuide = localStorage.getItem('hasSeenSimulationGuide');
    setShowGuide(!hasSeenGuide && enabled);
    
    if (enabled && !hasSeenGuide) {
      localStorage.setItem('hasSeenSimulationGuide', 'true');
      setTimeout(() => setShowGuide(false), 10000);
    }
  }, [enabled]);

  const handleToggle = (value: boolean) => {
    onToggle(value);
    if (value) {
      setShowGuide(true);
      setTimeout(() => setShowGuide(false), 10000);
    }
  };

  return (
    <div className={`flex items-center space-x-2 p-3 ${enabled ? 'bg-green-500/20' : 'bg-green-500/10'} border ${enabled ? 'border-green-500/30' : 'border-green-500/20'} rounded-md transition-colors duration-300 relative`}>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        id="simulation-mode"
        className={enabled ? "bg-green-500" : ""}
      />
      <Label htmlFor="simulation-mode" className="cursor-pointer font-medium">
        {isEnglish ? "Simulation Mode" : "Simulatiemodus"}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              {enabled && (
                <div className="ml-2 flex items-center text-xs text-green-600 font-medium">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {isEnglish ? "Active" : "Actief"}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              {isEnglish 
                ? "In simulation mode, orders are not actually executed. Ideal for testing strategies without risk. Our AI Hedge Fund guide recommends starting with simulations to develop effective trading strategies."
                : "In simulatiemodus worden orders niet echt uitgevoerd. Ideaal om strategieën te testen zonder risico. Onze AI Hedge Fund gids raadt aan om te beginnen met simulaties om effectieve handelsstrategieën te ontwikkelen."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showGuide && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md shadow-lg z-10">
          <div className="flex items-start gap-2">
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
              <ul className="mt-1 space-y-1">
                <li className="flex items-start gap-1 text-xs text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    {isEnglish 
                      ? "Test various entry and exit strategies" 
                      : "Test verschillende in- en uitstapstrategieën"}
                  </span>
                </li>
                <li className="flex items-start gap-1 text-xs text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    {isEnglish 
                      ? "Monitor AI agent recommendations" 
                      : "Monitor AI-agent aanbevelingen"}
                  </span>
                </li>
                <li className="flex items-start gap-1 text-xs text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    {isEnglish 
                      ? "Analyze trading results before using real funds" 
                      : "Analyseer handelsresultaten voordat je echt geld gebruikt"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
