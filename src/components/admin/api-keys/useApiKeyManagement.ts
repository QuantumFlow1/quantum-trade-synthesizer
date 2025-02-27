
import { useState, useEffect } from "react";
import { ApiKey, ApiKeyFormData } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export const useApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ApiKeyFormData>({
    key_type: "openai",
    api_key: "",
    is_active: true,
  });

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      console.error("Error fetching API keys:", error.message);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Insert the new API key
      const { data, error } = await supabase
        .from("api_keys")
        .insert([formData])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "API key added successfully",
      });
      
      // Reset form data
      setFormData({
        key_type: "openai",
        api_key: "",
        is_active: true,
      });
      
      // Refresh the list
      fetchApiKeys();
    } catch (error: any) {
      console.error("Error adding API key:", error.message);
      toast({
        title: "Error",
        description: "Failed to add API key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      
      // Update the API key's active status
      const { error } = await supabase
        .from("api_keys")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `API key ${isActive ? "activated" : "deactivated"}`,
      });
      
      // Update the local state to reflect the change
      setApiKeys(prevKeys =>
        prevKeys.map(key =>
          key.id === id ? { ...key, is_active: isActive } : key
        )
      );
    } catch (error: any) {
      console.error("Error updating API key status:", error.message);
      toast({
        title: "Error",
        description: "Failed to update API key status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    apiKeys,
    loading,
    formData,
    setFormData,
    handleSubmit,
    handleStatusChange,
    fetchApiKeys,
  };
};
