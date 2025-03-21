
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdviceModelsTab } from "./models/AdviceModelsTab";
import { LLMModelsTab } from "./models/LLMModelsTab";
import { ModelManagementHeader } from "./models/ModelManagementHeader";
import { LLMExtensions } from "../llm-extensions/LLMExtensions";

export const ModelManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("llm_models"); // Default to LLM models tab

  // Log active tab state to debug
  console.log("ModelManagement active tab:", activeTab);

  return (
    <div className="space-y-6">
      <ModelManagementHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="advice_models">Advies Modellen</TabsTrigger>
          <TabsTrigger value="llm_models" className="font-medium">AI Chat Modellen</TabsTrigger>
          <TabsTrigger value="extensions" className="font-medium">LLM Extensions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="advice_models" className="space-y-6">
          <AdviceModelsTab />
        </TabsContent>
        
        <TabsContent value="llm_models" className="space-y-6">
          <LLMModelsTab />
        </TabsContent>

        <TabsContent value="extensions" className="space-y-6">
          <LLMExtensions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelManagement;
