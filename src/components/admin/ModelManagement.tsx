
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdviceModelsTab } from "./models/AdviceModelsTab";
import { LLMModelsTab } from "./models/LLMModelsTab";

export const ModelManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("advice_models");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Advies en AI Modellen Beheer</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="advice_models">Advies Modellen</TabsTrigger>
            <TabsTrigger value="llm_models">AI Chat Modellen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="advice_models" className="space-y-6">
            <AdviceModelsTab />
          </TabsContent>
          
          <TabsContent value="llm_models" className="space-y-6">
            <LLMModelsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModelManagement;
