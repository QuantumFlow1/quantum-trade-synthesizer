
import { LeaderboardEntry } from '@/types/gamification';

// Global leaderboard entries
export const globalLeaderboardEntries: LeaderboardEntry[] = [
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
];
