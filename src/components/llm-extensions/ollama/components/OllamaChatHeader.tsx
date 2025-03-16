
import React from 'react';
import { MessageSquare, Settings, Trash2, Server } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaChatHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
  models: OllamaModel[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  clearChat: () => void;
}

export function OllamaChatHeader({
  activeTab,
  setActiveTab,
  isConnected,
  models,
  selectedModel,
  setSelectedModel,
  clearChat
}: OllamaChatHeaderProps) {
  return (
    <div className="flex p-3 border-b bg-muted/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {isConnected && models.length > 0 && (
              <>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.name} value={model.name}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="h-8"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </>
            )}
            
            {isConnected && (
              <Badge 
                variant="success" 
                className="flex items-center gap-1"
              >
                <Server className="h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
