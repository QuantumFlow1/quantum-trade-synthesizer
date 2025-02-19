
import { Button } from "@/components/ui/button";

interface IndicatorSelectorProps {
  currentIndicator: string;
  onIndicatorChange: (indicator: "sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx") => void;
}

export const IndicatorSelector = ({ currentIndicator, onIndicatorChange }: IndicatorSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={currentIndicator === "sma" ? "default" : "outline"}
        onClick={() => onIndicatorChange("sma")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        SMA
      </Button>
      <Button
        variant={currentIndicator === "ema" ? "default" : "outline"}
        onClick={() => onIndicatorChange("ema")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        EMA
      </Button>
      <Button
        variant={currentIndicator === "rsi" ? "default" : "outline"}
        onClick={() => onIndicatorChange("rsi")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        RSI
      </Button>
      <Button
        variant={currentIndicator === "macd" ? "default" : "outline"}
        onClick={() => onIndicatorChange("macd")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        MACD
      </Button>
      <Button
        variant={currentIndicator === "bollinger" ? "default" : "outline"}
        onClick={() => onIndicatorChange("bollinger")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        Bollinger
      </Button>
      <Button
        variant={currentIndicator === "stochastic" ? "default" : "outline"}
        onClick={() => onIndicatorChange("stochastic")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        Stochastic
      </Button>
      <Button
        variant={currentIndicator === "adx" ? "default" : "outline"}
        onClick={() => onIndicatorChange("adx")}
        className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
      >
        ADX
      </Button>
    </div>
  );
};
