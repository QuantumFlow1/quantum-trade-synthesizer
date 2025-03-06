
import { LeaderboardEntry } from '@/types/gamification';
import { createMockUser } from './leaderboard-types';

// Create mock global leaderboard data
export const globalLeaderboardData: LeaderboardEntry[] = [
  createMockUser(
    'user-1',
    'TradeMaster99',
    980,
    10,
    8,
    ['trading-floor', 'command-center', 'financial-garden'],
    87,
    92
  ),
  createMockUser(
    'user-2',
    'CryptoWizard',
    875,
    9,
    7,
    ['trading-floor', 'financial-garden'],
    82,
    85
  ),
  createMockUser(
    'user-3',
    'StockWhisperer',
    750,
    8,
    6,
    ['trading-floor', 'office-tower'],
    78,
    80
  ),
  createMockUser(
    'current-user',
    'You',
    690,
    7,
    5,
    ['trading-floor'],
    73,
    68
  ),
  createMockUser(
    'user-4',
    'WallStreetPro',
    620,
    7,
    4,
    ['command-center'],
    70,
    65
  ),
  createMockUser(
    'user-5',
    'ForexNinja',
    580,
    6,
    3,
    [],
    65,
    60
  ),
  createMockUser(
    'user-6',
    'TradingGuru',
    520,
    6,
    3,
    [],
    62,
    55
  )
];
