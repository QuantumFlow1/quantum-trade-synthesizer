
import { useLocalStorage } from './use-local-storage';
import { 
  EnvironmentType, 
  UserProgress
} from '@/types/virtual-environment';
import { 
  initialUserProgress, 
  calculateLevel,
  createEnvironmentBadge 
} from '@/utils/learning-path-utils';

export function useLearningProgress() {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>(
    'user-learning-progress',
    initialUserProgress
  );

  // Mark a module as completed
  const completeModule = (environmentId: EnvironmentType, moduleId: string) => {
    setUserProgress((currentProgress: UserProgress) => {
      const updatedPaths = { ...currentProgress.learningPaths };
      const path = { ...updatedPaths[environmentId] };
      const moduleIndex = path.modules.findIndex(m => m.id === moduleId);
      
      if (moduleIndex >= 0 && !path.modules[moduleIndex].completed) {
        const updatedModules = [...path.modules];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          completed: true
        };
        
        const modulePoints = updatedModules[moduleIndex].points;
        path.modules = updatedModules;
        path.completedModules += 1;
        path.earnedPoints += modulePoints;
        
        updatedPaths[environmentId] = path;
        
        const newTotalPoints = currentProgress.totalPoints + modulePoints;
        const newLevel = calculateLevel(newTotalPoints);
        
        // Check if environment is now completed
        let completedEnvironments = [...currentProgress.completedEnvironments];
        if (path.completedModules === path.totalModules && 
            !completedEnvironments.includes(environmentId)) {
          completedEnvironments.push(environmentId);
          
          // Add a badge for completing environment
          const newBadge = createEnvironmentBadge(environmentId);
          
          return {
            ...currentProgress,
            level: newLevel,
            totalPoints: newTotalPoints,
            completedEnvironments,
            learningPaths: updatedPaths,
            badges: [...currentProgress.badges, newBadge]
          };
        }
        
        return {
          ...currentProgress,
          level: newLevel,
          totalPoints: newTotalPoints,
          completedEnvironments,
          learningPaths: updatedPaths
        };
      }
      
      return currentProgress;
    });
  };

  return {
    userProgress,
    completeModule
  };
}
