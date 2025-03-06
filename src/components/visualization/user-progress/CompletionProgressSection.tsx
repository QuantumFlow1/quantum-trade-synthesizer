
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/types/virtual-environment';

interface CompletionProgressSectionProps {
  userProgress: UserProgress;
}

export const CompletionProgressSection: React.FC<CompletionProgressSectionProps> = ({ userProgress }) => {
  // Calculate total progress across all environments
  const totalModules = Object.values(userProgress.learningPaths).reduce(
    (sum, path) => sum + path.totalModules, 0
  );
  
  const completedModules = Object.values(userProgress.learningPaths).reduce(
    (sum, path) => sum + path.completedModules, 0
  );
  
  const totalCompletionPercentage = totalModules > 0 
    ? Math.round((completedModules / totalModules) * 100) 
    : 0;
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>Overall Completion</span>
        <span>{completedModules} / {totalModules} Modules</span>
      </div>
      <Progress value={totalCompletionPercentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {userProgress.completedEnvironments.length} of {Object.keys(userProgress.learningPaths).length} environments mastered
      </p>
    </div>
  );
};
