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
import { AlertCircle, Info, RefreshCw, CheckCircle, XCircle } from "lucide-react";
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

  const isSuperAdmin = userProfile && checkPermission(userProfile, 'super_admin');

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
        toast({
          title: "Error",
          description: "Failed to check API key status.",
          variant: "destructive"
        });
        return;
      }
      
      if (data?.allKeys) {
        setAdminApiKeyStatus(data.allKeys);
        console.log('Admin API key status:', data.allKeys);
      }
    } catch (error: any) {
      console.error('Error checking admin API keys:', error);
      toast({
        title: "Error",
        description: `Failed to check API key status: ${error.message}`,
        variant: "destructive"
      });
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
    setApiKeys(prev => 
      prev.map(key => 
        key.id === id ? { ...key, is_active: checked } : key
      )
    );

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
      
      checkAdminApiKeys();
    } catch (error) {
      console.error('Error updating API key status:', error);
      toast({
        title: "Error",
        description: "Failed to update API key status.",
        variant: "destructive"
      });
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
      if (!userProfile?.id) {
        toast({
          title: "Auth Error",
          description: "Unable to identify the current user. Please sign in again.",
          variant: "destructive"
        });
        return;
      }

      const existingKey = apiKeys.find(key => key.key_type === formData.key_type);
      
      let response;
      if (existingKey) {
        response = await supabase
          .from('admin_api_keys')
          .update({ 
            api_key: formData.api_key,
            is_active: formData.is_active,
            created_by: userProfile.id
          })
          .eq('id', existingKey.id);
      } else {
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

      setFormData({
        key_type: 'openai',
        api_key: '',
        is_active: true
      });
      fetchApiKeys();
      checkAdminApiKeys();
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
          <CardTitle className="flex justify-between items-center text-gray-900 dark:text-white">
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
          <CardDescription className="text-gray-700 dark:text-gray-300">
            Current status of API keys available in Supabase environment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checkingAdminKeys ? (
            <div className="text-center py-2">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-700 dark:text-gray-300">Checking API keys...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(adminApiKeyStatus).map(([key, value]) => (
                <div key={key} className={`p-3 rounded-md border flex items-center ${value ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  {value ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400 mr-2" />
                  )}
                  <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">{key}</span>
                  <span className={`text-xs ml-auto ${value ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                    {value ? 'Active' : 'Not Set'}
                  </span>
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
          <CardTitle className="text-gray-900 dark:text-white">API Key Management</CardTitle>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            Manage global API keys that will be used when users don't have their own keys.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key_type" className="text-gray-900 dark:text-white">API Type</Label>
              <select 
                id="key_type"
                name="key_type"
                value={formData.key_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white dark:text-white dark:bg-gray-800"
              >
                {API_KEY_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api_key" className="text-gray-900 dark:text-white">API Key</Label>
              <Input 
                id="api_key"
                name="api_key"
                type="password"
                placeholder="Enter API key"
                value={formData.api_key}
                onChange={handleInputChange}
                className="text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                checked={formData.is_active}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_active" className="text-gray-900 dark:text-white">Active</Label>
            </div>
            
            <Button type="submit" className="w-full">
              Save API Key
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Existing API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-700 dark:text-gray-300">Loading API keys...</div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-4 text-gray-600 dark:text-gray-400">No API keys found.</div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map(key => (
                <div key={key.id} className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{getKeyTypeName(key.key_type)}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {renderApiKeyMasked(key.api_key)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={key.is_active} 
                      onCheckedChange={(checked) => handleEditSwitchChange(key.id, checked)}
                    />
                    <span className={`text-sm ${key.is_active ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
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
