
import React, { useState } from "react";
import { ModelList, ModelItem } from "./ModelList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LLMModelForm } from "./LLMModelForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Mock data for demonstration purposes
const initialModels: ModelItem[] = [
  {
    id: "1",
    name: "GPT-4",
    description: "OpenAI's GPT-4 model voor geavanceerde tekstgeneratie",
    isActive: true,
    type: "openai"
  },
  {
    id: "2",
    name: "Claude 3 Opus",
    description: "Anthropic's Claude 3 Opus model voor nauwkeurige tekstgeneratie",
    isActive: true,
    type: "anthropic"
  },
  {
    id: "3",
    name: "Llama 3 70B",
    description: "Meta's Llama 3 70B model geïntegreerd via Ollama",
    isActive: false,
    type: "ollama"
  }
];

export const LLMModelsList = () => {
  const [models, setModels] = useState<ModelItem[]>(initialModels);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelItem | null>(null);

  const handleEdit = (id: string) => {
    const modelToEdit = models.find(model => model.id === id);
    if (modelToEdit) {
      setCurrentModel(modelToEdit);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setModels(models.filter(model => model.id !== id));
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, isActive: active } : model
    ));
  };

  const handleAddNew = () => {
    setCurrentModel(null);
    setIsDialogOpen(true);
  };

  const handleSaveModel = (model: ModelItem) => {
    if (currentModel) {
      // Update existing model
      setModels(models.map(m => 
        m.id === model.id ? model : m
      ));
    } else {
      // Add new model
      const newModel = {
        ...model,
        id: Date.now().toString(), // Simple ID generation
      };
      setModels([...models, newModel]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">LLM Modellen</h3>
        <Button onClick={handleAddNew} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Nieuw Model
        </Button>
      </div>
      
      <ModelList 
        models={models}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>
            {currentModel ? "Model Bewerken" : "Nieuw Model"}
          </DialogTitle>
          <LLMModelForm 
            model={currentModel}
            onSave={handleSaveModel}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
