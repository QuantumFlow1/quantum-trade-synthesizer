
import { useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { checkPermission } from "@/utils/auth-utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { useApiKeyManagement } from "./useApiKeyManagement";
import { ApiKeyForm } from "./ApiKeyForm";
import { ApiKeyList } from "./ApiKeyList";

const ApiKeyManagement = () => {
  const { userProfile } = useAuth();
  const { 
    apiKeys, 
    loading, 
    formData, 
    setFormData, 
    fetchApiKeys, 
    updateApiKeyStatus, 
    handleFormSubmit 
  } = useApiKeyManagement();
  
  // Check if user has super_admin permission
  const isSuperAdmin = checkPermission(userProfile, 'super_admin');

  useEffect(() => {
    if (isSuperAdmin) {
      fetchApiKeys();
    }
  }, [isSuperAdmin]);

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
          <ApiKeyForm 
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleFormSubmit}
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Existing API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiKeyList 
            apiKeys={apiKeys}
            loading={loading}
            onStatusChange={updateApiKeyStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyManagement;
