
import { TradeAchievement, GamificationReward } from '@/types/gamification';

export const mockAchievements: TradeAchievement[] = [
  {
    id: 'first-trade',
    name: 'First Steps',
    description: 'Complete your first simulated trade',
    pointsAwarded: 10,
    requirements: {
      totalTrades: 1
    }
  },
  {
    id: 'trade-streak-5',
    name: 'Consistency is Key',
    description: 'Complete trades on 5 consecutive days',
    pointsAwarded: 25,
    requirements: {
      consecutiveProfits: 5,
      timeFrame: 'daily'
    }
  },
  {
    id: 'profit-master',
    name: 'Profit Master',
    description: 'Achieve a 20% profit on a single trade',
    pointsAwarded: 30,
    requirements: {
      profitThreshold: 20
    }
  },
  {
    id: 'risk-manager',
    name: 'Risk Manager',
    description: 'Complete 10 trades with proper stop loss settings',
    pointsAwarded: 40,
    requirements: {
      totalTrades: 10,
      riskManagementScore: 80
    }
  },
  {
    id: 'learning-starter',
    name: 'Learning Pioneer',
    description: 'Complete your first learning module',
    pointsAwarded: 15,
    requirements: {}
  },
  {
    id: 'market-analyzer',
    name: 'Market Analyzer',
    description: 'Use technical analysis tools in 20 trades',
    pointsAwarded: 35,
    requirements: {
      totalTrades: 20
    }
  },
  {
    id: 'environment-explorer',
    name: 'Environment Explorer',
    description: 'Visit all trading environments',
    pointsAwarded: 20,
    requirements: {}
  }
];

export const mockRewards: GamificationReward[] = [
  {
    id: 'basic-analytics',
    name: 'Basic Analytics',
    description: 'Unlock basic market analytics tools',
    type: 'feature',
    pointsRequired: 50,
    unlocked: true
  },
  {
    id: 'trading-guide-101',
    name: 'Trading Guide 101',
    description: 'Access to beginner trading guide content',
    type: 'content',
    pointsRequired: 75,
    unlocked: true
  },
  {
    id: 'advanced-charts',
    name: 'Advanced Charts',
    description: 'Access to advanced charting tools and indicators',
    type: 'feature',
    pointsRequired: 150,
    unlocked: false
  },
  {
    id: 'pro-trading-course',
    name: 'Pro Trading Course',
    description: 'Comprehensive course on professional trading strategies',
    type: 'content',
    pointsRequired: 300,
    unlocked: false
  },
  {
    id: 'ai-assistant',
    name: 'AI Trading Assistant',
    description: 'AI-powered trading recommendations and insights',
    type: 'feature',
    pointsRequired: 500,
    unlocked: false
  },
  {
    id: 'virtual-mentor',
    name: 'Virtual Trading Mentor',
    description: 'One-on-one sessions with a virtual trading mentor',
    type: 'feature',
    pointsRequired: 750,
    unlocked: false
  }
];
