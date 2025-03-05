
import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  language: "nl" | "en";
  onLanguageChange: (language: "nl" | "en") => void;
}

export const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  return (
    <div className="flex items-center gap-1 text-xs">
      <Button 
        size="sm" 
        variant={language === "nl" ? "default" : "ghost"} 
        className="h-6 px-2 text-xs"
        onClick={() => onLanguageChange("nl")}
      >
        NL
      </Button>
      <Button 
        size="sm" 
        variant={language === "en" ? "default" : "ghost"} 
        className="h-6 px-2 text-xs"
        onClick={() => onLanguageChange("en")}
      >
        EN
      </Button>
    </div>
  );
};
