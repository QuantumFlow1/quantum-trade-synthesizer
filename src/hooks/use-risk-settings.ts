
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RiskSettings, defaultRiskSettings } from "@/types/risk";

export const useRiskSettings = (userId: string | undefined) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<RiskSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRiskSettings = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('risk_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newSettings, error: createError } = await supabase
          .from('risk_settings')
          .insert([{ 
            user_id: userId,
            ...defaultRiskSettings
          }])
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
        
        toast({
          title: "Risk Settings Created",
          description: "Default risk settings have been created for your account",
        });
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading risk settings:', error);
      toast({
        title: "Error",
        description: "Could not load risk settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRiskSettings = async (newSettings: RiskSettings) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('risk_settings')
        .upsert({
          user_id: userId,
          ...newSettings
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Risk settings updated successfully",
      });
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Error saving risk settings:', error);
      toast({
        title: "Error",
        description: "Could not save risk settings",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      loadRiskSettings();
    }
  }, [userId]);

  return { settings, isLoading, saveRiskSettings, setSettings };
};

