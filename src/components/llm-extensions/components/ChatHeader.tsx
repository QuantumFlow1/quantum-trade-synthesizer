
import React from 'react';
import { CardTitle } from '@/components/ui/card';

interface ChatHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: React.ReactNode;
}

export function ChatHeader({
  title,
  description,
  icon,
  actions
}: ChatHeaderProps) {
  return (
    <div className="px-4 py-3 border-b flex items-center justify-between">
      <div>
        <CardTitle className="text-lg font-medium flex items-center">
          {icon}
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex gap-2">
        {actions}
      </div>
    </div>
  );
}
