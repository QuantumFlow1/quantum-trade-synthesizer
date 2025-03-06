
import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';
import { LearningPathHeader } from './LearningPathHeader';
import { ModulesList } from './ModulesList';

export const EnvironmentLearningPath: React.FC = () => {
  const { selectedEnvironment, currentEnvironment, userProgress } = useEnvironment();
  
  const learningPath = userProgress.learningPaths[selectedEnvironment];
  
  if (!learningPath) {
    return <div>No learning path available for this environment</div>;
  }
  
  return (
    <div className="space-y-4">
      <LearningPathHeader 
        environmentName={currentEnvironment.name}
        completedModules={learningPath.completedModules}
        totalModules={learningPath.totalModules}
        earnedPoints={learningPath.earnedPoints}
        totalPoints={learningPath.totalPoints}
      />
      
      <Progress 
        value={(learningPath.completedModules / learningPath.totalModules) * 100} 
        className="h-2 mb-6"
      />
      
      <ModulesList 
        modules={learningPath.modules}
        environmentId={selectedEnvironment}
      />
    </div>
  );
};
