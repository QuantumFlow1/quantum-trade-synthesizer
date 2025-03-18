
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const useStockbotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate a response
    setTimeout(() => {
      const botResponse: Message = {
        role: "assistant",
        content: `Dit is een gesimuleerd antwoord op: "${userMessage.content}"`,
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat,
  };
};
