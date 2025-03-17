
import React, { useState } from "react";
import { LLMModelsList } from "./LLMModelsList"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Server, Bot, Key, Settings } from "lucide-react";
import { OllamaDockerConnect } from "./OllamaDockerConnect";
import { AIAgentsChatTab } from "./AIAgentsChatTab";
import { APIKeysTab } from "./APIKeysTab";

export const LLMModelsTab = () => {
  const [activeTab, setActiveTab] = useState("llm_models");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            AI Chat Modellen Beheer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-4"> {/* Added pb-4 for better spacing */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 px-6 pt-4"> {/* Added padding for better spacing */}
              <TabsTrigger value="llm_models">Modellen</TabsTrigger>
              <TabsTrigger value="ai_agents">
                <Bot className="h-4 w-4 mr-1" /> 
                AI Agenten Chat
              </TabsTrigger>
              <TabsTrigger value="docker_connect">
                <Server className="h-4 w-4 mr-1" /> 
                Docker Connect
              </TabsTrigger>
              <TabsTrigger value="api_keys">
                <Key className="h-4 w-4 mr-1" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-1" />
                Instellingen
              </TabsTrigger>
            </TabsList>
            
            <div className="px-6"> {/* Added padding wrapper for consistent content spacing */}
              <TabsContent value="llm_models">
                <LLMModelsList />
              </TabsContent>
              
              <TabsContent value="ai_agents">
                <AIAgentsChatTab />
              </TabsContent>
              
              <TabsContent value="docker_connect">
                <OllamaDockerConnect />
              </TabsContent>
              
              <TabsContent value="api_keys">
                <APIKeysTab />
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="p-4 text-center text-muted-foreground">
                  Model instellingen functionaliteit komt binnenkort beschikbaar.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
