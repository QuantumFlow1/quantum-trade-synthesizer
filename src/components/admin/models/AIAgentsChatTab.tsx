
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatHistorySection } from "@/components/admin/voice-assistant/ChatHistorySection";
import { ChatMessage } from "@/components/admin/types/chat-types";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const AGENTS = [
  { id: "advisor", name: "Financial Advisor", description: "Helps with investment advice and financial planning" },
  { id: "trader", name: "Trader Assistant", description: "Assists with trading strategies and market analysis" },
  { id: "analyst", name: "Data Analyst", description: "Provides data-driven insights and trend analysis" },
  { id: "support", name: "Technical Support", description: "Helps with technical issues and platform questions" },
  { id: "receptionist", name: "Receptionist", description: "General information and guidance about the platform" }
];

export const AIAgentsChatTab: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState("advisor");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus on input when agent changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedAgent]);
  
  // Load initial message from selected agent
  useEffect(() => {
    // Skip if we already have messages
    if (chatHistory.length > 0) return;
    
    const currentAgent = AGENTS.find(agent => agent.id === selectedAgent);
    if (currentAgent) {
      setChatHistory([{
        id: uuidv4(),
        role: 'assistant',
        content: `Hello, I'm your ${currentAgent.name}. ${currentAgent.description}. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [selectedAgent, chatHistory.length]);
  
  const handleAgentChange = (value: string) => {
    setSelectedAgent(value);
    // Clear chat when changing agents
    setChatHistory([]);
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    // Simulated response delay
    setTimeout(() => {
      const currentAgent = AGENTS.find(agent => agent.id === selectedAgent);
      let responseMessage = "I'll help you with that.";
      
      // Customize response based on agent type
      switch (selectedAgent) {
        case "advisor":
          responseMessage = "As your financial advisor, I recommend analyzing your portfolio diversity. Would you like me to review your current investments?";
          break;
        case "trader":
          responseMessage = "Looking at the current market conditions, there are interesting opportunities in tech and renewable energy sectors. Would you like more specific trading insights?";
          break;
        case "analyst":
          responseMessage = "Based on the data trends, I can provide analytics on market performance over the last quarter. What specific metrics are you interested in?";
          break;
        case "support":
          responseMessage = "I can help troubleshoot any technical issues you're experiencing with the platform. What specific problem are you encountering?";
          break;
        case "receptionist":
          responseMessage = "Welcome to our platform! I can guide you through our features and services. What would you like to know about?";
          break;
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: responseMessage,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Chat with AI Agents</h3>
        <div className="flex items-center space-x-2">
          <Select value={selectedAgent} onValueChange={handleAgentChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <span>{agent.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearChat}
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border rounded-lg">
        <CardContent className="p-4 space-y-4">
          {/* Chat history section */}
          <div className="h-[350px] overflow-y-auto border rounded-md bg-background p-4">
            {chatHistory.map((message) => (
              <div 
                key={message.id} 
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : `${AGENTS.find(a => a.id === selectedAgent)?.name || 'AI'}`}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="h-2 w-12 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input section */}
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask your ${AGENTS.find(a => a.id === selectedAgent)?.name || 'AI assistant'}...`}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
