
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AdminKeyRefreshProps {
  hasAccess: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export function AdminKeyRefresh({ hasAccess, isLoading, onRefresh }: AdminKeyRefreshProps) {
  if (!hasAccess) {
    return null;
  }
  
  return (
    <div className="flex justify-end mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        Admin sleutels verversen
      </Button>
    </div>
  );
}
