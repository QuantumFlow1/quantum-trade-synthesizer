
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { checkPermission } from "@/utils/auth-utils";

type ApiKey = {
  id: string;
  key_type: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
};

type ApiKeyFormData = {
  key_type: string;
  api_key: string;
  is_active: boolean;
};

const API_KEY_TYPES = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'claude', name: 'Claude' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'deepseek', name: 'DeepSeek' }
];

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const { userProfile } = useAuth();
  
  const [formData, setFormData] = useState<ApiKeyFormData>({
    key_type: 'openai',
    api_key: '',
    is_active: true
  });

  // Check if user has super_admin permission
  const isSuperAdmin = checkPermission(userProfile, 'super_admin');

  useEffect(() => {
    if (isSuperAdmin) {
      fetchApiKeys();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };

  const handleEditSwitchChange = (id: string, checked: boolean) => {
    // Update the local state first for immediate UI feedback
    setApiKeys(prev => 
      prev.map(key => 
        key.id === id ? { ...key, is_active: checked } : key
      )
    );

    // Then update in the database
    updateApiKeyStatus(id, checked);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        description: `${existingKey ? 'Updated' : 'Added'} ${getKeyTypeName(formData.key_type)} API key successfully.`,
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

  const getKeyTypeName = (type: string): string => {
    const keyType = API_KEY_TYPES.find(t => t.id === type);
    return keyType ? keyType.name : type;
  };

  const renderApiKeyMasked = (apiKey: string): string => {
    if (apiKey.length <= 8) return '••••••••';
    return apiKey.substring(0, 4) + '••••••••' + apiKey.substring(apiKey.length - 4);
  };

  if (!isSuperAdmin) {
    return (
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            You don't have permission to access this feature.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
          <CardDescription>
            Manage global API keys that will be used when users don't have their own keys.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key_type">API Type</Label>
              <select 
                id="key_type"
                name="key_type"
                value={formData.key_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                {API_KEY_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input 
                id="api_key"
                name="api_key"
                type="password"
                placeholder="Enter API key"
                value={formData.api_key}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            
            <Button type="submit" className="w-full">
              Save API Key
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Existing API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading API keys...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No API keys found.</div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{getKeyTypeName(key.key_type)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {renderApiKeyMasked(key.api_key)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={key.is_active} 
                      onCheckedChange={(checked) => handleEditSwitchChange(key.id, checked)}
                    />
                    <span className="text-sm">
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
