
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AdviceModel } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Edit2, Save, Plus } from "lucide-react";

export const ModelManagement = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<AdviceModel[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newModel, setNewModel] = useState({
    name: "",
    content: "",
    is_active: false
  });

  const fetchModels = async () => {
    const { data, error } = await supabase
      .from('advice_models')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Kon modellen niet laden",
        variant: "destructive",
      });
      return;
    }

    setModels(data);
  };

  useEffect(() => {
    fetchModels();
  }, []);

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
    fetchModels();
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('advice_models')
      .insert([{
        name: newModel.name,
        content: newModel.content,
        is_active: newModel.is_active
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Kon model niet aanmaken",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Nieuw model aangemaakt",
    });
    setNewModel({ name: "", content: "", is_active: false });
    fetchModels();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Advies Modellen Beheer</h2>
        
        {/* Nieuw model formulier */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold">Nieuw Model Toevoegen</h3>
          <Input
            placeholder="Model naam"
            value={newModel.name}
            onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
          />
          <Textarea
            placeholder="Model inhoud (gebruik markdown voor formatting)"
            value={newModel.content}
            onChange={(e) => setNewModel({ ...newModel, content: e.target.value })}
            rows={10}
          />
          <div className="flex items-center gap-2">
            <Switch
              checked={newModel.is_active}
              onCheckedChange={(checked) => setNewModel({ ...newModel, is_active: checked })}
            />
            <span>Actief</span>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Model Toevoegen
          </Button>
        </div>

        {/* Bestaande modellen lijst */}
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model.id} className="p-4 border rounded-lg space-y-4">
              {editingId === model.id ? (
                <>
                  <Input
                    value={model.name}
                    onChange={(e) => setModels(models.map(m => 
                      m.id === model.id ? { ...m, name: e.target.value } : m
                    ))}
                  />
                  <Textarea
                    value={model.content}
                    onChange={(e) => setModels(models.map(m => 
                      m.id === model.id ? { ...m, content: e.target.value } : m
                    ))}
                    rows={10}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={model.is_active}
                      onCheckedChange={(checked) => setModels(models.map(m => 
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
      </div>
    </div>
  );
};

export default ModelManagement;
