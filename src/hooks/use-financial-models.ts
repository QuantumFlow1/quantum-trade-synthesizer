
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface FinancialModel {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface FinancialMetric {
  id: string;
  model_id: string;
  metric_type: string;
  value: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export const useFinancialModels = () => {
  const {
    data: models,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["financial-models"],
    queryFn: async () => {
      console.log("Fetching financial models...");
      const { data, error } = await supabase
        .from("financial_models")
        .select("*, financial_metrics(*)");

      if (error) {
        console.error("Error fetching financial models:", error);
        throw error;
      }

      return data as (FinancialModel & { financial_metrics: FinancialMetric[] })[];
    },
  });

  const createModel = async (model: Omit<FinancialModel, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("financial_models")
      .insert(model)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateModel = async (id: string, updates: Partial<FinancialModel>) => {
    const { data, error } = await supabase
      .from("financial_models")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return {
    models,
    isLoading,
    error,
    createModel,
    updateModel,
  };
};

