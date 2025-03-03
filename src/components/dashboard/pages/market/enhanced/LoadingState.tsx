
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[350px] w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
};
