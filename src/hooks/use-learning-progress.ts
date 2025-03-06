import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';
import { 
  EnvironmentType, 
  UserProgress, 
  LearningModule, 
  EnvironmentLearningPath,
  UserBadge 
} from '@/types/virtual-environment';

// Initial learning modules for each environment
const defaultLearningModules: Record<EnvironmentType, LearningModule[]> = {
  'trading-floor': [
    {
      id: 'tf-basic-navigation',
      title: 'Trading Floor Navigation',
      description: 'Learn to navigate the essential areas of a modern trading floor',
      difficulty: 'beginner',
      estimatedTimeMinutes: 5,
      points: 10,
      completed: false
    },
    {
      id: 'tf-market-data',
      title: 'Reading Market Data Displays',
      description: 'Understand how to interpret real-time market data visualizations',
      difficulty: 'beginner',
      estimatedTimeMinutes: 15,
      points: 25,
      completed: false
    },
    {
      id: 'tf-order-execution',
      title: 'Basic Order Execution',
      description: 'Learn how to execute your first simulated trade',
      difficulty: 'beginner',
      estimatedTimeMinutes: 20,
      points: 30,
      completed: false
    }
  ],
  'office-tower': [
    {
      id: 'ot-market-research',
      title: 'Market Research Basics',
      description: 'Learn how to conduct basic market research from your virtual office',
      difficulty: 'beginner',
      estimatedTimeMinutes: 25,
      points: 35,
      completed: false
    },
    {
      id: 'ot-report-analysis',
      title: 'Financial Report Analysis',
      description: 'Understand how to read and analyze financial reports',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 40,
      points: 50,
      completed: false
    }
  ],
  'financial-garden': [
    {
      id: 'fg-sustainable-investing',
      title: 'Sustainable Investing',
      description: 'Explore principles of ESG and sustainable investing strategies',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 30,
      points: 40,
      completed: false
    },
    {
      id: 'fg-mindful-trading',
      title: 'Mindful Trading Practices',
      description: 'Learn techniques to manage emotions and make mindful trading decisions',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 25,
      points: 45,
      completed: false
    }
  ],
  'command-center': [
    {
      id: 'cc-data-dashboards',
      title: 'Data Dashboard Mastery',
      description: 'Learn to use complex data dashboards to monitor markets',
      difficulty: 'advanced',
      estimatedTimeMinutes: 35,
      points: 55,
      completed: false
    },
    {
      id: 'cc-alert-systems',
      title: 'Setting Up Alert Systems',
      description: 'Configure personalized alerts for market conditions',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 20,
      points: 30,
      completed: false
    }
  ],
  'educational-campus': [
    {
      id: 'ec-trading-fundamentals',
      title: 'Trading Fundamentals',
      description: 'Learn the core concepts and terminology of trading',
      difficulty: 'beginner',
      estimatedTimeMinutes: 45,
      points: 40,
      completed: false
    },
    {
      id: 'ec-strategy-development',
      title: 'Strategy Development Workshop',
      description: 'Interactive workshop on developing your own trading strategy',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 60,
      points: 75,
      completed: false
    }
  ],
  'personal-office': [
    {
      id: 'po-portfolio-management',
      title: 'Personal Portfolio Management',
      description: 'Learn to manage and balance your trading portfolio',
      difficulty: 'intermediate',
      estimatedTimeMinutes: 40,
      points: 50,
      completed: false
    },
    {
      id: 'po-goal-setting',
      title: 'Trading Goal Setting',
      description: 'Define and track your personal trading goals',
      difficulty: 'beginner',
      estimatedTimeMinutes: 25,
      points: 35,
      completed: false
    }
  ],
  'trading-hub': [
    {
      id: 'th-community-engagement',
      title: 'Community Trading Insights',
      description: 'Learn from the community and share your own insights',
      difficulty: 'beginner',
      estimatedTimeMinutes: 30,
      points: 40,
      completed: false
    },
    {
      id: 'th-collaborative-analysis',
      title: 'Collaborative Market Analysis',
      description: 'Work with peers to analyze market conditions and opportunities',
      difficulty: 'advanced',
      estimatedTimeMinutes: 50,
      points: 65,
      completed: false
    }
  ]
};

// Create initial learning paths
function createInitialLearningPaths(): Record<EnvironmentType, EnvironmentLearningPath> {
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
const initialUserProgress: UserProgress = {
  level: 1,
  totalPoints: 0,
  completedEnvironments: [],
  learningPaths: createInitialLearningPaths(),
  badges: []
};

export function useLearningProgress() {
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>(
    'user-learning-progress',
    initialUserProgress
  );

  // Calculate user level based on points
  const calculateLevel = (points: number): number => {
    // Simple level calculation: Level = 1 + points / 100 (rounded down)
    return 1 + Math.floor(points / 100);
  };

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
          const newBadge: UserBadge = {
            id: `${environmentId}-mastery`,
            name: `${path.environmentId.replace('-', ' ')} Mastery`,
            description: `Completed all learning modules in the ${path.environmentId.replace('-', ' ')} environment`,
            icon: 'trophy',
            dateEarned: new Date().toISOString()
          };
          
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
