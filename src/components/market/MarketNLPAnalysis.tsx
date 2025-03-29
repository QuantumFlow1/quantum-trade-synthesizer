
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Send, RefreshCw } from "lucide-react";
import { MarketData } from "./types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface MarketNLPAnalysisProps {
  marketData?: MarketData;
}

export const MarketNLPAnalysis: React.FC<MarketNLPAnalysisProps> = ({ marketData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hallo! Vraag me iets over marktomstandigheden of trading strategieën. Bijvoorbeeld: 'Wat zijn de beste cryptocurrencies om vandaag te kopen?' of 'Hoe ziet de trend in Bitcoin eruit?'",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real implementation, we would call an API to process the user's question
      // For now, we'll use a simulated response based on some basic patterns
      let aiResponse = "";
      
      // Call our edge function or mock the response
      const userLanguage = "nl"; // Dutch language
      let response;
      
      try {
        // Try to use the OpenAI edge function
        response = await supabase.functions.invoke("openai-response", {
          body: {
            message: `
              Je bent een financiële analist die vragen beantwoordt over marktomstandigheden.
              Beantwoord de volgende vraag in het Nederlands, gebaseerd op de volgende marktgegevens:
              
              Symbol: ${marketData?.symbol}
              Prijs: ${marketData?.price}
              24u Verandering: ${marketData?.change24h}%
              Volume: ${marketData?.volume}
              24u Hoogste: ${marketData?.high24h}
              24u Laagste: ${marketData?.low24h}
              Markt: ${marketData?.market}
              
              Vraag: ${input}
            `,
            model: "gpt-4o-mini",
          }
        });
        
        if (response.error) throw new Error(response.error.message);
        aiResponse = response.data?.response || "";
      } catch (error) {
        console.error("Error calling OpenAI:", error);
        
        // Fall back to simulated responses
        if (input.toLowerCase().includes("kopen") || input.toLowerCase().includes("beste")) {
          aiResponse = `Gebaseerd op de huidige marktgegevens voor ${marketData?.symbol}, zien we een ${marketData?.change24h && marketData.change24h > 0 ? 'positieve' : 'negatieve'} trend van ${marketData?.change24h}% in de afgelopen 24 uur. Bij het overwegen van aankopen is het belangrijk om te kijken naar volume en prijsstabiliteit. Het 24-uurs volume van ${marketData?.volume?.toLocaleString()} is ${marketData?.volume && marketData.volume > 1000000 ? 'relatief hoog' : 'gemiddeld'}.`;
        } else if (input.toLowerCase().includes("trend") || input.toLowerCase().includes("analyse")) {
          aiResponse = `De trend voor ${marketData?.symbol} is momenteel ${marketData?.change24h && marketData.change24h > 0 ? 'opwaarts' : 'neerwaarts'} met een prijsverandering van ${marketData?.change24h}% in de afgelopen 24 uur. De prijs heeft een bereik van $${marketData?.low24h} tot $${marketData?.high24h} gezien. Dit wijst op ${Math.abs(marketData?.high24h - marketData?.low24h) > (marketData?.price * 0.05) ? 'aanzienlijke' : 'beperkte'} volatiliteit.`;
        } else if (input.toLowerCase().includes("voorspel") || input.toLowerCase().includes("verwacht")) {
          aiResponse = `Hoewel ik geen specifieke prijsvoorspellingen kan geven, suggereert de huidige marktactiviteit voor ${marketData?.symbol} ${marketData?.change24h && marketData.change24h > 0 ? 'potentiële verdere groei mits het marktsentiment positief blijft' : 'mogelijke uitdagingen op korte termijn'}. Bedenk wel dat alle investeringen risico's met zich meebrengen en historische prestaties geen garantie bieden voor toekomstige resultaten.`;
        } else {
          aiResponse = `Op basis van de beschikbare marktgegevens voor ${marketData?.symbol}, zien we een huidige prijs van $${marketData?.price} met een 24-uurs verandering van ${marketData?.change24h}%. Het handelsvolume bedraagt ${marketData?.volume?.toLocaleString()}, wat duidt op ${marketData?.volume > 1000000 ? 'actieve' : 'gematigde'} marktdeelname. Voor gedetailleerdere informatie, stel specifiekere vragen over prijs, volume, of trendanalyse.`;
        }
      }

      // Add AI response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Fout bij het verwerken van uw vraag",
        description: "Er is een probleem opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hallo! Vraag me iets over marktomstandigheden of trading strategieën. Bijvoorbeeld: 'Wat zijn de beste cryptocurrencies om vandaag te kopen?' of 'Hoe ziet de trend in Bitcoin eruit?'",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <Card className="h-[500px] shadow-md">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-xl font-medium flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          Markt Analyse Assistent
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100%-70px)]">
        <div className="flex-grow overflow-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            disabled={isLoading}
            className="shrink-0"
            title="Reset gesprek"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Stel een vraag over marktcondities..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button
            disabled={!input.trim() || isLoading}
            onClick={handleSendMessage}
            className="shrink-0"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
