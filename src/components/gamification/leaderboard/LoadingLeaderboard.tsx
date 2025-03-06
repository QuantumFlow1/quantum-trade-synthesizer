
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingLeaderboard: React.FC = () => {
  return (
    <>
      {Array(5).fill(0).map((_, index) => (
        <div key={index} className="flex items-center p-3 border-b border-secondary/20">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="ml-3 space-y-1 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </>
  );
};
