
import { supabase } from "@/lib/supabase";

export const generateLocalAdvice = async () => {
  try {
    const { data: models, error } = await supabase
      .from('advice_models')
      .select('*')
      .eq('is_active', true)
      .limit(1);

    if (error) throw error;

    if (models && models.length > 0) {
      return models[0].content;
    }

    return `Lokaal Gegenereerd Advies:

1. Trading Strategie:
- Spreid je investeringen over verschillende assets
- Gebruik stop-loss orders voor risicobeheer
- Handel niet meer dan 2% van je portfolio per trade

2. Risico Management:
- Hou altijd een emergency fund aan
- Diversifieer over verschillende sectoren
- Vermijd overmatige leverage

3. Portfolio Allocatie:
- 40% grote bedrijven (blue chips)
- 30% obligaties voor stabiliteit
- 20% groeiende markten
- 10% cash reserve`;
  } catch (error) {
    console.error('Error fetching local model:', error);
    throw error;
  }
};

export const generateAIAdvice = async () => {
  const { data, error } = await supabase.functions.invoke('generate-ai-response', {
    body: {
      prompt: `Analyseer de huidige marktcondities en geef advies:
        - BTC/USD: $45,234
        - ETH/USD: $2,845
        - Markt Sentiment: Bullish
        - Volatiliteit: Hoog
        
        Geef specifiek advies over:
        1. Trading strategie
        2. Risico management
        3. Portfolio allocatie`
    }
  });

  if (error) throw error;
  return data.generatedText;
};
