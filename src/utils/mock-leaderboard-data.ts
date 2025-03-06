
import { LeaderboardData, LeaderboardEntry } from '@/types/gamification';
import { EnvironmentType } from '@/types/virtual-environment';

// Create mock leaderboard data
export const mockLeaderboardData: LeaderboardData = {
  global: [
    {
      userId: 'user-1',
      username: 'TradeMaster99',
      totalPoints: 980,
      level: 10,
      badgeCount: 8,
      environmentMastery: ['trading-floor', 'command-center', 'financial-garden'],
      tradingSuccess: 87,
      learningCompletion: 92
    },
    {
      userId: 'user-2',
      username: 'CryptoWizard',
      totalPoints: 875,
      level: 9,
      badgeCount: 7,
      environmentMastery: ['trading-floor', 'financial-garden'],
      tradingSuccess: 82,
      learningCompletion: 85
    },
    {
      userId: 'user-3',
      username: 'StockWhisperer',
      totalPoints: 750,
      level: 8,
      badgeCount: 6,
      environmentMastery: ['trading-floor', 'office-tower'],
      tradingSuccess: 78,
      learningCompletion: 80
    },
    {
      userId: 'current-user',
      username: 'You',
      totalPoints: 690,
      level: 7,
      badgeCount: 5,
      environmentMastery: ['trading-floor'],
      tradingSuccess: 73,
      learningCompletion: 68
    },
    {
      userId: 'user-4',
      username: 'WallStreetPro',
      totalPoints: 620,
      level: 7,
      badgeCount: 4,
      environmentMastery: ['command-center'],
      tradingSuccess: 70,
      learningCompletion: 65
    },
    {
      userId: 'user-5',
      username: 'ForexNinja',
      totalPoints: 580,
      level: 6,
      badgeCount: 3,
      environmentMastery: [],
      tradingSuccess: 65,
      learningCompletion: 60
    },
    {
      userId: 'user-6',
      username: 'TradingGuru',
      totalPoints: 520,
      level: 6,
      badgeCount: 3,
      environmentMastery: [],
      tradingSuccess: 62,
      learningCompletion: 55
    }
  ],
  byEnvironment: {
    'trading-floor': [
      {
        userId: 'user-1',
        username: 'TradeMaster99',
        totalPoints: 320,
        level: 10,
        badgeCount: 8,
        environmentMastery: ['trading-floor'],
        tradingSuccess: 87,
        learningCompletion: 92
      },
      {
        userId: 'user-2',
        username: 'CryptoWizard',
        totalPoints: 290,
        level: 9,
        badgeCount: 7,
        environmentMastery: ['trading-floor'],
        tradingSuccess: 82,
        learningCompletion: 85
      },
      {
        userId: 'current-user',
        username: 'You',
        totalPoints: 240,
        level: 7,
        badgeCount: 5,
        environmentMastery: ['trading-floor'],
        tradingSuccess: 73,
        learningCompletion: 68
      }
    ],
    'office-tower': [
      {
        userId: 'user-3',
        username: 'StockWhisperer',
        totalPoints: 280,
        level: 8,
        badgeCount: 6,
        environmentMastery: ['office-tower'],
        tradingSuccess: 78,
        learningCompletion: 80
      },
      {
        userId: 'current-user',
        username: 'You',
        totalPoints: 180,
        level: 7,
        badgeCount: 5,
        environmentMastery: [],
        tradingSuccess: 73,
        learningCompletion: 68
      }
    ],
    'financial-garden': [
      {
        userId: 'user-1',
        username: 'TradeMaster99',
        totalPoints: 300,
        level: 10,
        badgeCount: 8,
        environmentMastery: ['financial-garden'],
        tradingSuccess: 87,
        learningCompletion: 92
      },
      {
        userId: 'user-2',
        username: 'CryptoWizard',
        totalPoints: 270,
        level: 9,
        badgeCount: 7,
        environmentMastery: ['financial-garden'],
        tradingSuccess: 82,
        learningCompletion: 85
      }
    ],
    'command-center': [
      {
        userId: 'user-1',
        username: 'TradeMaster99',
        totalPoints: 280,
        level: 10,
        badgeCount: 8,
        environmentMastery: ['command-center'],
        tradingSuccess: 87,
        learningCompletion: 92
      },
      {
        userId: 'user-4',
        username: 'WallStreetPro',
        totalPoints: 250,
        level: 7,
        badgeCount: 4,
        environmentMastery: ['command-center'],
        tradingSuccess: 70,
        learningCompletion: 65
      }
    ],
    'educational-campus': [
      {
        userId: 'user-1',
        username: 'TradeMaster99',
        totalPoints: 220,
        level: 10,
        badgeCount: 8,
        environmentMastery: [],
        tradingSuccess: 87,
        learningCompletion: 92
      }
    ],
    'personal-office': [
      {
        userId: 'user-2',
        username: 'CryptoWizard',
        totalPoints: 180,
        level: 9,
        badgeCount: 7,
        environmentMastery: [],
        tradingSuccess: 82,
        learningCompletion: 85
      }
    ],
    'trading-hub': [
      {
        userId: 'user-3',
        username: 'StockWhisperer',
        totalPoints: 190,
        level: 8,
        badgeCount: 6,
        environmentMastery: [],
        tradingSuccess: 78,
        learningCompletion: 80
      }
    ]
  } as Record<EnvironmentType, LeaderboardEntry[]>
};
