
import { EnvironmentType, EnvironmentLearningPath, UserProgress, UserBadge } from '@/types/virtual-environment';
import { defaultLearningModules } from '@/data/default-learning-modules';

// Create initial learning paths
export function createInitialLearningPaths(): Record<EnvironmentType, EnvironmentLearningPath> {
  const paths: Record<EnvironmentType, EnvironmentLearningPath> = {} as Record<EnvironmentType, EnvironmentLearningPath>;
  
  Object.entries(defaultLearningModules).forEach(([envId, modules]) => {
    const environmentId = envId as EnvironmentType;
    const totalPoints = modules.reduce((sum, module) => sum + module.points, 0);
    
    paths[environmentId] = {
      environmentId,
      modules,
      completedModules: 0,
      totalModules: modules.length,
      totalPoints,
      earnedPoints: 0
    };
  });
  
  return paths;
}

// Initialize default user progress
export const initialUserProgress: UserProgress = {
  level: 1,
  totalPoints: 0,
  completedEnvironments: [],
  learningPaths: createInitialLearningPaths(),
  badges: []
};

// Calculate user level based on points
export const calculateLevel = (points: number): number => {
  // Simple level calculation: Level = 1 + points / 100 (rounded down)
  return 1 + Math.floor(points / 100);
};

// Create a badge for completing an environment
export const createEnvironmentBadge = (environmentId: EnvironmentType): UserBadge => {
  return {
    id: `${environmentId}-mastery`,
    name: `${environmentId.replace('-', ' ')} Mastery`,
    description: `Completed all learning modules in the ${environmentId.replace('-', ' ')} environment`,
    icon: 'trophy',
    dateEarned: new Date().toISOString()
  };
};
