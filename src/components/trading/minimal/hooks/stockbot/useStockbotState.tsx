
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

export const useStockbotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  };
};
