
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ApiKeyTabInput } from './ApiKeyTabInput';

interface ApiKeyTabContentProps {
  tabId: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  description: string;
}

export const ApiKeyTabContent = ({
  tabId,
  label,
  placeholder,
  value,
  onChange,
  description
}: ApiKeyTabContentProps) => {
  return (
    <TabsContent value={tabId} className="space-y-4">
      <ApiKeyTabInput
        id={`${tabId}-key`}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        description={description}
      />
    </TabsContent>
  );
};
