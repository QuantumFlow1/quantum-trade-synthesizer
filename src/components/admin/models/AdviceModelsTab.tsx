
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AdviceModel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { NewAdviceModelForm } from "./NewAdviceModelForm";
import { AdviceModelList } from "./AdviceModelList";

export const AdviceModelsTab = () => {
  const { toast } = useToast();
  const [models, setModels] = useState<AdviceModel[]>([]);
  
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

  return (
    <div className="space-y-6">
      {/* Nieuw model formulier */}
      <NewAdviceModelForm onModelAdded={fetchModels} />

      {/* Bestaande modellen lijst */}
      <AdviceModelList 
        models={models} 
        onModelsUpdated={fetchModels} 
      />
    </div>
  );
};
