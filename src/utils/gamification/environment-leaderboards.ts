
import { LeaderboardEntry } from '@/types/gamification';
import { EnvironmentType } from '@/types/virtual-environment';
import { createMockUser } from './leaderboard-types';

// Trading Floor environment leaderboard
export const tradingFloorLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-1',
    'TradeMaster99',
    320,
    10,
    8,
    ['trading-floor'],
    87,
    92
  ),
  createMockUser(
    'user-2',
    'CryptoWizard',
    290,
    9,
    7,
    ['trading-floor'],
    82,
    85
  ),
  createMockUser(
    'current-user',
    'You',
    240,
    7,
    5,
    ['trading-floor'],
    73,
    68
  )
];

// Office Tower environment leaderboard
export const officeTowerLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-3',
    'StockWhisperer',
    280,
    8,
    6,
    ['office-tower'],
    78,
    80
  ),
  createMockUser(
    'current-user',
    'You',
    180,
    7,
    5,
    [],
    73,
    68
  )
];

// Financial Garden environment leaderboard
export const financialGardenLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-1',
    'TradeMaster99',
    300,
    10,
    8,
    ['financial-garden'],
    87,
    92
  ),
  createMockUser(
    'user-2',
    'CryptoWizard',
    270,
    9,
    7,
    ['financial-garden'],
    82,
    85
  )
];

// Command Center environment leaderboard
export const commandCenterLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-1',
    'TradeMaster99',
    280,
    10,
    8,
    ['command-center'],
    87,
    92
  ),
  createMockUser(
    'user-4',
    'WallStreetPro',
    250,
    7,
    4,
    ['command-center'],
    70,
    65
  )
];

// Educational Campus environment leaderboard
export const educationalCampusLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-1',
    'TradeMaster99',
    220,
    10,
    8,
    [],
    87,
    92
  )
];

// Personal Office environment leaderboard
export const personalOfficeLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-2',
    'CryptoWizard',
    180,
    9,
    7,
    [],
    82,
    85
  )
];

// Trading Hub environment leaderboard
export const tradingHubLeaderboard: LeaderboardEntry[] = [
  createMockUser(
    'user-3',
    'StockWhisperer',
    190,
    8,
    6,
    [],
    78,
    80
  )
];

// All environment leaderboards combined into one object
export const environmentLeaderboards: Record<EnvironmentType, LeaderboardEntry[]> = {
  'trading-floor': tradingFloorLeaderboard,
  'office-tower': officeTowerLeaderboard,
  'financial-garden': financialGardenLeaderboard,
  'command-center': commandCenterLeaderboard,
  'educational-campus': educationalCampusLeaderboard,
  'personal-office': personalOfficeLeaderboard,
  'trading-hub': tradingHubLeaderboard
};
