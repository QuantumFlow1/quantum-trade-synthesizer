
import React from "react";
import { ApiKeyList } from "./api-keys/ApiKeyList";
import { ApiKeyForm } from "./api-keys/ApiKeyForm";
import { useApiKeyManagement } from "./api-keys/useApiKeyManagement";

const ApiKeyManagement: React.FC = () => {
  const {
    apiKeys,
    loading,
    formData,
    setFormData,
    handleSubmit,
    handleStatusChange,
  } = useApiKeyManagement();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">API Key Management</h2>
        <ApiKeyForm 
          formData={formData} 
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Active API Keys</h3>
        <ApiKeyList 
          apiKeys={apiKeys}
          loading={loading}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default ApiKeyManagement;
