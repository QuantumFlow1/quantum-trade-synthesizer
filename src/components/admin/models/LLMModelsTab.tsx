
import React from "react";
import { LLMModelsList } from "./LLMModelsList"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

export const LLMModelsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            AI Chat Modellen Beheer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="llm_models">
            <TabsList className="mb-4">
              <TabsTrigger value="llm_models">Modellen</TabsTrigger>
              <TabsTrigger value="api_keys">API Keys</TabsTrigger>
              <TabsTrigger value="settings">Instellingen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="llm_models">
              <LLMModelsList />
            </TabsContent>
            
            <TabsContent value="api_keys">
              <div className="p-4 text-center text-muted-foreground">
                API keys beheer functionaliteit komt binnenkort beschikbaar.
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="p-4 text-center text-muted-foreground">
                Model instellingen functionaliteit komt binnenkort beschikbaar.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
