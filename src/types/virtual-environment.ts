
export type EnvironmentType = 
  | 'trading-floor'
  | 'office-tower'
  | 'financial-garden'
  | 'command-center'
  | 'educational-campus'
  | 'personal-office'
  | 'trading-hub';

export interface VirtualEnvironment {
  id: EnvironmentType;
  name: string;
  description: string;
  thumbnailIcon: React.ElementType;
  theme?: 'dark' | 'light';
}

// Learning path types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes: number;
  points: number;
  completed: boolean;
  contentUrl?: string;
}

export interface EnvironmentLearningPath {
  environmentId: EnvironmentType;
  modules: LearningModule[];
  completedModules: number;
  totalModules: number;
  totalPoints: number;
  earnedPoints: number;
}

export interface UserProgress {
  level: number;
  totalPoints: number;
  completedEnvironments: EnvironmentType[];
  learningPaths: Record<EnvironmentType, EnvironmentLearningPath>;
  badges: UserBadge[];
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: string;
}
