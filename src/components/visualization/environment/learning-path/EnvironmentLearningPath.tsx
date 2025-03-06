
import React from 'react';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { ModulesList } from './ModulesList';
import { LearningPathHeader } from './LearningPathHeader';
import { EnvironmentType } from '@/types/virtual-environment';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, TrendingUp, Brain, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const EnvironmentLearningPath: React.FC = () => {
  const { selectedEnvironment, userProgress } = useEnvironment();
  
  // Get the learning path for the selected environment
  const learningPath = userProgress.learningPaths[selectedEnvironment as EnvironmentType];
  
  if (!learningPath) {
    return (
      <div className="p-4 text-center">
        <p>No learning path available for this environment.</p>
      </div>
    );
  }
  
  // Calculate completion percentage
  const completionPercentage = Math.round(
    (learningPath.completedModules / learningPath.totalModules) * 100
  );
  
  // Check if environment is already mastered
  const isEnvironmentMastered = userProgress.completedEnvironments.includes(
    selectedEnvironment as EnvironmentType
  );
  
  // Get environment name for display
  const getEnvironmentDisplayName = (envId: EnvironmentType): string => {
    return envId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const environmentName = getEnvironmentDisplayName(selectedEnvironment as EnvironmentType);
  
  return (
    <div className="p-4 space-y-6">
      <LearningPathHeader 
        environmentName={environmentName}
        completedModules={learningPath.completedModules}
        totalModules={learningPath.totalModules}
        earnedPoints={learningPath.earnedPoints}
        totalPoints={learningPath.totalPoints}
      />
      
      {isEnvironmentMastered ? (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center mb-2">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-bold">Environment Mastered!</h3>
          </div>
          <p className="text-sm mb-3">
            Congratulations! You've completed all modules in the {environmentName} environment.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
              <Trophy className="h-3 w-3 mr-1" />
              {environmentName} Master
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">
              <Award className="h-3 w-3 mr-1" />
              +100 Achievement Points
            </Badge>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Environment Mastery Progress</h3>
            <span className="text-sm font-bold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2 mb-3" />
          <p className="text-sm">
            Complete all modules to master this environment and earn special badges and rewards!
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center mb-1">
            <Brain className="h-4 w-4 text-blue-500 mr-2" />
            <h3 className="font-medium">Skills You'll Develop</h3>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">Risk Analysis</Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">Technical Analysis</Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">Market Psychology</Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">Order Execution</Badge>
          </div>
        </div>
        
        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center mb-1">
            <Target className="h-4 w-4 text-green-500 mr-2" />
            <h3 className="font-medium">Learning Objectives</h3>
          </div>
          <ul className="text-sm space-y-1 mt-2">
            <li className="flex items-start">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1 mt-1" />
              <span>Master essential trading concepts</span>
            </li>
            <li className="flex items-start">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1 mt-1" />
              <span>Practice in risk-free simulations</span>
            </li>
            <li className="flex items-start">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1 mt-1" />
              <span>Develop your unique trading strategy</span>
            </li>
          </ul>
        </div>
      </div>
      
      <ModulesList 
        modules={learningPath.modules} 
        environmentId={selectedEnvironment as EnvironmentType} 
      />
    </div>
  );
};
