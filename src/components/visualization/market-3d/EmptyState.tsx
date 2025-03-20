
import React from 'react';
import { Card } from '@/components/ui/card';

export const EmptyState: React.FC = () => {
  return (
    <Card className="h-[500px] flex items-center justify-center">
      <p className="text-muted-foreground">No data available for 3D visualization</p>
    </Card>
  );
};
