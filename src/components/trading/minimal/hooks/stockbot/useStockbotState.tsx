
import { useState } from "react";
import { StockbotMessage } from "./types";

type Message = {
  id: string;
  role: "user" | "assistant";
  sender: "user" | "assistant" | "system";
  content: string;
  text: string;
  timestamp: Date;
};

// Available AI models
const AVAILABLE_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3 70B', providerName: 'Groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', providerName: 'Groq' },
  { id: 'gemini-pro', name: 'Gemini Pro', providerName: 'Google' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', providerName: 'Anthropic' },
];

export const useStockbotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(AVAILABLE_MODELS[0].id);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      sender: "user",
      content: inputMessage.trim(),
      text: inputMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate a response
    setTimeout(() => {
      const botResponse: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        sender: "assistant",
        content: `Dit is een gesimuleerd antwoord op: "${userMessage.content}"`,
        text: `Dit is een gesimuleerd antwoord op: "${userMessage.content}"`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages: messages as StockbotMessage[],
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat,
    currentModel,
    setCurrentModel,
    availableModels: AVAILABLE_MODELS
  };
};
