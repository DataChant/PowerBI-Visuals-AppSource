export type Tab = 'leaderboard' | 'replay' | 'overview' | 'ratings' | 'popularity' | 'words';

export const TABS: { id: Tab; label: string }[] = [
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'replay', label: 'Replay' },
  { id: 'overview', label: 'Overview' },
  { id: 'ratings', label: 'Ratings' },
  { id: 'popularity', label: 'Popularity' },
  { id: 'words', label: 'Words' },
];
