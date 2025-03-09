
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
import { AlertCircle, Info, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

type AdminApiKeyStatus = {
  openai: boolean;
  claude: boolean;
  gemini: boolean;
  grok3: boolean;
  groq: boolean;
  deepseek: boolean;
};

const API_KEY_TYPES = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'claude', name: 'Claude' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'groq', name: 'Groq' },
  { id: 'deepseek', name: 'DeepSeek' }
];

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [adminApiKeyStatus, setAdminApiKeyStatus] = useState<AdminApiKeyStatus>({
    openai: false,
    claude: false,
    gemini: false,
    grok3: false,
    groq: false,
    deepseek: false
  });
  const [checkingAdminKeys, setCheckingAdminKeys] = useState(false);
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
      checkAdminApiKeys();
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

  const checkAdminApiKeys = async () => {
    try {
      setCheckingAdminKeys(true);
      
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: {}
      });
      
      if (error) {
        console.error('Error checking admin API keys:', error);
        return;
      }
      
      if (data?.allKeys) {
        setAdminApiKeyStatus(data.allKeys);
        console.log('Admin API key status:', data.allKeys);
      }
    } catch (error) {
      console.error('Error checking admin API keys:', error);
    } finally {
      setCheckingAdminKeys(false);
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
      
      // Refresh the admin API key status
      checkAdminApiKeys();
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
      checkAdminApiKeys(); // Also refresh the admin key status
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
          <CardTitle className="flex justify-between items-center">
            <span>Admin API Keys Status</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkAdminApiKeys}
              disabled={checkingAdminKeys}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${checkingAdminKeys ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Current status of API keys available in Supabase environment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checkingAdminKeys ? (
            <div className="text-center py-2">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Checking API keys...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(adminApiKeyStatus).map(([key, value]) => (
                <div key={key} className={`p-2 rounded-md border flex items-center ${value ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`w-3 h-3 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <span className="text-xs ml-auto text-muted-foreground">{value ? 'Active' : 'Not Set'}</span>
                </div>
              ))}
            </div>
          )}
          
          <Alert className="mt-4 bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription className="text-xs">
              These keys are stored in Supabase Edge Function secrets. They're used when users don't have their own API keys.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

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
