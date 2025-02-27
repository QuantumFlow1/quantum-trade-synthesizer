
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ApiKey, ApiKeyFormData } from "./types";
import { useAuth } from "@/components/auth/AuthProvider";

export const useApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();
  
  const [formData, setFormData] = useState<ApiKeyFormData>({
    key_type: 'openai',
    api_key: '',
    is_active: true
  });

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_api_keys')
        .select('*')
        .order('key_type', { ascending: true });

      if (error) {
        throw error;
      }

      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Failed to fetch API keys.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApiKeyStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_api_keys')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setApiKeys(prev => 
        prev.map(key => 
          key.id === id ? { ...key, is_active: isActive } : key
        )
      );

      toast({
        title: "Success",
        description: `API key ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating API key status:', error);
      toast({
        title: "Error",
        description: "Failed to update API key status.",
        variant: "destructive"
      });
      // Revert the local state change if the database update failed
      fetchApiKeys();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.api_key) {
      toast({
        title: "Validation Error",
        description: "API key cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ensure we have the user's ID for ownership tracking
      if (!userProfile?.id) {
        toast({
          title: "Auth Error",
          description: "Unable to identify the current user. Please sign in again.",
          variant: "destructive"
        });
        return;
      }

      // Check if we already have a key of this type
      const existingKey = apiKeys.find(key => key.key_type === formData.key_type);
      
      let response;
      if (existingKey) {
        // Update existing key
        response = await supabase
          .from('admin_api_keys')
          .update({ 
            api_key: formData.api_key,
            is_active: formData.is_active,
            created_by: userProfile.id
          })
          .eq('id', existingKey.id);
      } else {
        // Insert new key
        response = await supabase
          .from('admin_api_keys')
          .insert({ 
            key_type: formData.key_type,
            api_key: formData.api_key,
            is_active: formData.is_active,
            created_by: userProfile.id
          });
      }

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Success",
        description: `${existingKey ? 'Updated' : 'Added'} API key successfully.`,
      });

      // Reset form and refresh the list
      setFormData({
        key_type: 'openai',
        api_key: '',
        is_active: true
      });
      fetchApiKeys();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error",
        description: "Failed to save API key.",
        variant: "destructive"
      });
    }
  };

  return {
    apiKeys,
    loading,
    formData,
    setFormData,
    fetchApiKeys,
    updateApiKeyStatus,
    handleFormSubmit
  };
};
