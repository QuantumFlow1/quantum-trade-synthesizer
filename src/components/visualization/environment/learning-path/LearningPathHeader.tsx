
import React from 'react';
import { Trophy } from 'lucide-react';

interface LearningPathHeaderProps {
  environmentName: string;
  completedModules: number;
  totalModules: number;
  earnedPoints: number;
  totalPoints: number;
}

export const LearningPathHeader: React.FC<LearningPathHeaderProps> = ({
  environmentName,
  completedModules,
  totalModules,
  earnedPoints,
  totalPoints
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-bold">{environmentName} Learning Path</h2>
        <p className="text-sm text-muted-foreground">
          {completedModules} of {totalModules} modules completed
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <span className="font-bold">{earnedPoints}/{totalPoints} Points</span>
      </div>
    </div>
  );
};
