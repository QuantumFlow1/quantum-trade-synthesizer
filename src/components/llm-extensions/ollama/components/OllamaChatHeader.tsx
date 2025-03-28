
import React from 'react';
import { MessageSquare, Settings, Trash2, Server } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OllamaModel } from '../types/ollamaTypes';

interface OllamaChatHeaderProps {
  isConnected: boolean;
  models: OllamaModel[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  clearChat: () => void;
  toggleSettings?: () => void;
  toggleConnectionInfo?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function OllamaChatHeader({
  isConnected,
  models,
  selectedModel,
  setSelectedModel,
  toggleSettings,
  toggleConnectionInfo,
  clearChat,
  activeTab,
  setActiveTab
}: OllamaChatHeaderProps) {
  return (
    <div className="flex p-3 border-b bg-muted/30">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {toggleSettings && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSettings}
                className="flex items-center"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
            
            {toggleConnectionInfo && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleConnectionInfo}
                className="flex items-center"
              >
                <Server className="h-4 w-4 mr-2" />
                Connection
              </Button>
            )}
            
            {activeTab && setActiveTab && (
              <div className="border rounded-md">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
          
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
                variant="outline" 
                className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
              >
                <Server className="h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
