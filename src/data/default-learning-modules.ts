
import { EnvironmentType, LearningModule } from '@/types/virtual-environment';

// Initial learning modules for each environment
export const defaultLearningModules: Record<EnvironmentType, LearningModule[]> = {
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
