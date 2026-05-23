import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LeaderboardType = 'weekly' | 'total';

export interface LeaderboardEntry {
  id: string;
  name: string;
  value: number;
  rank: number;
}

interface WeeklyLeaderboardData {
  weekStartDate: string;
  entries: {
    wordsWritten: LeaderboardEntry[];
    daysStreak: LeaderboardEntry[];
    monstersDefeated: LeaderboardEntry[];
  };
  personalBest: {
    wordsWritten: number;
    daysStreak: number;
    monstersDefeated: number;
  };
}

interface LeaderboardStore {
  weeklyData: WeeklyLeaderboardData;
  selectedCategory: 'wordsWritten' | 'daysStreak' | 'monstersDefeated';

  // Actions
  addToWeeklyStats: (words: number, streak: number, monsters: number) => void;
  checkWeekReset: () => void;
  generateMockLeaderboard: () => void;
  getPersonalRank: (category: 'wordsWritten' | 'daysStreak' | 'monstersDefeated') => number | null;
}

const getWeekStartDate = (): string => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split('T')[0];
};

const createInitialWeeklyData = (): WeeklyLeaderboardData => ({
  weekStartDate: getWeekStartDate(),
  entries: {
    wordsWritten: [],
    daysStreak: [],
    monstersDefeated: [],
  },
  personalBest: {
    wordsWritten: 0,
    daysStreak: 0,
    monstersDefeated: 0,
  },
});

const MOCK_PLAYERS = [
  { id: 'p1', name: '小明' },
  { id: 'p2', name: '写作达人' },
  { id: 'p3', name: '笔耕不辍' },
  { id: 'p4', name: '墨水怪兽' },
  { id: 'p5', name: '文思泉涌' },
  { id: 'p6', name: '打字机' },
  { id: 'p7', name: '故事大师' },
];

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    (set, get) => ({
      weeklyData: createInitialWeeklyData(),
      selectedCategory: 'wordsWritten',

      checkWeekReset: () => {
        const { weeklyData } = get();
        const currentWeekStart = getWeekStartDate();
        
        if (weeklyData.weekStartDate !== currentWeekStart) {
          set({
            weeklyData: createInitialWeeklyData(),
          });
          // 重新生成模拟数据
          setTimeout(() => get().generateMockLeaderboard(), 100);
        }
      },

      generateMockLeaderboard: () => {
        const { weeklyData } = get();
        
        const entries = {
          wordsWritten: [
            { id: 'player', name: '你', value: weeklyData.personalBest.wordsWritten, rank: 0 },
            ...MOCK_PLAYERS.map((p) => ({
              ...p,
              value: Math.floor(Math.random() * 10000) + 1000,
              rank: 0,
            })),
          ].sort((a, b) => b.value - a.value).map((e, i) => ({ ...e, rank: i + 1 })),
          
          daysStreak: [
            { id: 'player', name: '你', value: weeklyData.personalBest.daysStreak, rank: 0 },
            ...MOCK_PLAYERS.map((p) => ({
              ...p,
              value: Math.floor(Math.random() * 30) + 1,
              rank: 0,
            })),
          ].sort((a, b) => b.value - a.value).map((e, i) => ({ ...e, rank: i + 1 })),
          
          monstersDefeated: [
            { id: 'player', name: '你', value: weeklyData.personalBest.monstersDefeated, rank: 0 },
            ...MOCK_PLAYERS.map((p) => ({
              ...p,
              value: Math.floor(Math.random() * 50) + 5,
              rank: 0,
            })),
          ].sort((a, b) => b.value - a.value).map((e, i) => ({ ...e, rank: i + 1 })),
        };

        set(state => ({
          weeklyData: {
            ...state.weeklyData,
            entries,
          },
        }));
      },

      addToWeeklyStats: (words: number, streak: number, monsters: number) => {
        set(state => {
          const newBest = {
            wordsWritten: Math.max(state.weeklyData.personalBest.wordsWritten, words),
            daysStreak: Math.max(state.weeklyData.personalBest.daysStreak, streak),
            monstersDefeated: Math.max(state.weeklyData.personalBest.monstersDefeated, monsters),
          };

          return {
            weeklyData: {
              ...state.weeklyData,
              personalBest: newBest,
            },
          };
        });

        // 更新排行榜
        setTimeout(() => get().generateMockLeaderboard(), 100);
      },

      getPersonalRank: (category) => {
        const { weeklyData } = get();
        const entry = weeklyData.entries[category].find(e => e.id === 'player');
        return entry?.rank || null;
      },
    }),
    {
      name: 'writequest-leaderboard',
    }
  )
);
