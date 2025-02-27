
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiKeyFormData, API_KEY_TYPES } from "./types";

interface ApiKeyFormProps {
  formData: ApiKeyFormData;
  onFormChange: (data: ApiKeyFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ApiKeyForm = ({ formData, onFormChange, onSubmit }: ApiKeyFormProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    onFormChange({ ...formData, is_active: checked });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  );
};
