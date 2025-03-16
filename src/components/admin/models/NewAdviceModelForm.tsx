
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface NewAdviceModelFormProps {
  onModelAdded: () => void;
}

export const NewAdviceModelForm = ({ onModelAdded }: NewAdviceModelFormProps) => {
  const { toast } = useToast();
  const [newModel, setNewModel] = useState({
    name: "",
    content: "",
    is_active: false
  });

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
    onModelAdded();
  };

  return (
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
  );
};
