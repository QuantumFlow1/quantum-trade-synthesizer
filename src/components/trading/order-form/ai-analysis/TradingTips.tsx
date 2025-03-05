
import { LanguageToggle } from "./LanguageToggle";
import { useState } from "react";

export const TradingTips = () => {
  const [language, setLanguage] = useState<"nl" | "en">("nl");
  
  return (
    <div className="mt-4 p-3 bg-primary/5 rounded-md text-sm text-muted-foreground">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Basis Trading Tips:</h4>
        <LanguageToggle 
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
      {language === "nl" ? (
        <ul className="list-disc pl-4 space-y-1">
          <li>Zet altijd een stop-loss om verliezen te beperken</li>
          <li>Handel niet met meer dan 2% van je portfolio per trade</li>
          <li>Let op marktvolatiliteit voor het bepalen van in- en uitstappunten</li>
          <li>Overweeg technische indicatoren zoals RSI en MACD</li>
          <li>Volg de markttrend en trend niet tegen de algemene richting in</li>
        </ul>
      ) : (
        <ul className="list-disc pl-4 space-y-1">
          <li>Always set a stop-loss to limit losses</li>
          <li>Don't trade with more than 2% of your portfolio per trade</li>
          <li>Pay attention to market volatility when determining entry and exit points</li>
          <li>Consider technical indicators like RSI and MACD</li>
          <li>Follow market trends and don't trade against the general direction</li>
        </ul>
      )}
    </div>
  );
};
