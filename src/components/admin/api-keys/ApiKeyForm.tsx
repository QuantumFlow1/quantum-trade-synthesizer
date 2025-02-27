
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiKeyFormData, API_KEY_TYPES } from "./types";

interface ApiKeyFormProps {
  formData: ApiKeyFormData;
  setFormData: (data: ApiKeyFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 border rounded-md">
      <div className="space-y-2">
        <Label htmlFor="key-type">API Key Type</Label>
        <Select
          value={formData.key_type}
          onValueChange={(value) => setFormData({ ...formData, key_type: value })}
        >
          <SelectTrigger id="key-type">
            <SelectValue placeholder="Select key type" />
          </SelectTrigger>
          <SelectContent>
            {API_KEY_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key">API Key</Label>
        <Input
          id="api-key"
          type="text"
          value={formData.api_key}
          onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
          placeholder="Enter API key"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is-active" className="cursor-pointer">Active</Label>
        <Switch
          id="is-active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      <Button type="submit" className="w-full">
        Add API Key
      </Button>
    </form>
  );
};
