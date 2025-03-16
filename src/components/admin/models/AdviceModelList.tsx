
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Edit2, Save } from "lucide-react";
import { AdviceModel } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AdviceModelListProps {
  models: AdviceModel[];
  onModelsUpdated: () => void;
}

export const AdviceModelList = ({ models, onModelsUpdated }: AdviceModelListProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedModels, setEditedModels] = useState<AdviceModel[]>(models);

  // Update local state when props change
  if (JSON.stringify(models) !== JSON.stringify(editedModels) && editingId === null) {
    setEditedModels(models);
  }

  const handleSave = async (model: AdviceModel) => {
    const { error } = await supabase
      .from('advice_models')
      .update({
        name: model.name,
        content: model.content,
        is_active: model.is_active
      })
      .eq('id', model.id);

    if (error) {
      toast({
        title: "Error",
        description: "Kon model niet opslaan",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Model opgeslagen",
    });
    setEditingId(null);
    onModelsUpdated();
  };

  return (
    <div className="space-y-4">
      {editedModels.map((model) => (
        <div key={model.id} className="p-4 border rounded-lg space-y-4">
          {editingId === model.id ? (
            <>
              <Input
                value={model.name}
                onChange={(e) => setEditedModels(editedModels.map(m => 
                  m.id === model.id ? { ...m, name: e.target.value } : m
                ))}
              />
              <Textarea
                value={model.content}
                onChange={(e) => setEditedModels(editedModels.map(m => 
                  m.id === model.id ? { ...m, content: e.target.value } : m
                ))}
                rows={10}
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={model.is_active}
                  onCheckedChange={(checked) => setEditedModels(editedModels.map(m => 
                    m.id === model.id ? { ...m, is_active: checked } : m
                  ))}
                />
                <span>Actief</span>
              </div>
              <Button onClick={() => handleSave(model)}>
                <Save className="w-4 h-4 mr-2" />
                Opslaan
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{model.name}</h3>
                <Button variant="outline" onClick={() => setEditingId(model.id)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Bewerken
                </Button>
              </div>
              <pre className="whitespace-pre-wrap text-sm bg-secondary/50 p-4 rounded">
                {model.content}
              </pre>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${model.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>{model.is_active ? 'Actief' : 'Inactief'}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
