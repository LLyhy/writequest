import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WritingSession, Quest, QuestType, Boss, BossBattle, WritingHistory } from '../types';
import { getTodayString, BOSSES } from '../constants/game';

interface GameState {
  coins: number;
  currentSession: WritingSession | null;
  isWriting: boolean;
  dailyQuests: Quest[];
  sessionStartTime: number | null;
  lastQuestRefresh: number | null;
  bosses: Boss[];
  currentBattle: BossBattle | null;
  writingHistory: WritingHistory[];
  completedQuestsCount: number;
}

interface GameActions {
  // 金币
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;

  // 写作会话
  startWritingSession: () => void;
  endWritingSession: (content: string, wordCount: number, expGained: number) => WritingSession | null;
  updateSessionContent: (content: string, wordCount: number) => void;

  // 任务
  generateDailyQuests: () => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  claimQuestReward: (questId: string) => boolean;
  checkAndRefreshDailyQuests: () => boolean;

  // Boss战
  startBossBattle: (bossId: string) => boolean;
  updateBossBattle: (wordCount: number) => void;
  endBossBattle: (status: 'won' | 'lost' | 'abandoned') => BossBattle | null;
  unlockNextBoss: (currentBossId: string) => void;

  // 历史记录
  addWritingHistory: (wordCount: number, writingTime: number) => void;
  getWritingStats: () => { weeklyWords: number; weeklyTime: number; bestDay: WritingHistory | null };

  // 状态
  resetGame: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 生成每日任务
const generateQuests = (): Quest[] => {
  const now = Date.now();
  const dayEnd = new Date();
  dayEnd.setHours(23, 59, 59, 999);

  const questTemplates = [
    // 字数任务
    {
      type: 'daily' as QuestType,
      title: '每日写作',
      description: '今天写300字',
      target: 300,
      reward: { exp: 100, coins: 10 },
      category: 'word' as const,
    },
    {
      type: 'daily' as QuestType,
      title: '创作大师',
      description: '今天写500字',
      target: 500,
      reward: { exp: 200, coins: 20 },
      category: 'word' as const,
    },
    {
      type: 'daily' as QuestType,
      title: '文思泉涌',
      description: '今天写800字',
      target: 800,
      reward: { exp: 350, coins: 35 },
      category: 'word' as const,
    },
    // 时间任务
    {
      type: 'daily' as QuestType,
      title: '专注写作',
      description: '专注写作15分钟',
      target: 15,
      reward: { exp: 150, coins: 15 },
      category: 'time' as const,
    },
    {
      type: 'daily' as QuestType,
      title: '深度沉浸',
      description: '专注写作30分钟',
      target: 30,
      reward: { exp: 300, coins: 30 },
      category: 'time' as const,
    },
    // 连续任务
    {
      type: 'streak' as QuestType,
      title: '连续挑战',
      description: '连续3天写作',
      target: 3,
      reward: { exp: 500, coins: 50 },
      category: 'streak' as const,
    },
  ];

  // 随机选择3-4个任务
  const shuffled = [...questTemplates].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 3);

  return selected.map((template) => ({
    id: generateId(),
    ...template,
    current: 0,
    completed: false,
    claimed: false,
    createdAt: now,
    expiresAt: dayEnd.getTime(),
  }));
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // State
      coins: 0,
      currentSession: null,
      isWriting: false,
      dailyQuests: [],
      sessionStartTime: null,
      lastQuestRefresh: null,
      bosses: BOSSES,
      currentBattle: null,
      writingHistory: [],
      completedQuestsCount: 0,

      // Actions
      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
      },

      spendCoins: (amount) => {
        const { coins } = get();
        if (coins >= amount) {
          set({ coins: coins - amount });
          return true;
        }
        return false;
      },

      startWritingSession: () => {
        const session: WritingSession = {
          id: generateId(),
          startTime: Date.now(),
          endTime: null,
          wordCount: 0,
          content: '',
          expGained: 0,
        };
        set({
          currentSession: session,
          isWriting: true,
          sessionStartTime: Date.now(),
        });
      },

      endWritingSession: (content, wordCount, expGained) => {
        const { currentSession } = get();
        if (!currentSession) return null;

        const endedSession: WritingSession = {
          ...currentSession,
          endTime: Date.now(),
          content,
          wordCount,
          expGained,
        };

        set({
          currentSession: null,
          isWriting: false,
          sessionStartTime: null,
        });

        return endedSession;
      },

      updateSessionContent: (content, wordCount) => {
        set((state) => ({
          currentSession: state.currentSession
            ? { ...state.currentSession, content, wordCount }
            : null,
        }));
      },

      generateDailyQuests: () => {
        set({
          dailyQuests: generateQuests(),
          lastQuestRefresh: Date.now(),
        });
      },

      checkAndRefreshDailyQuests: () => {
        const { lastQuestRefresh } = get();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 检查是否需要刷新（新的一天）
        if (!lastQuestRefresh) {
          get().generateDailyQuests();
          return true;
        }

        const lastRefresh = new Date(lastQuestRefresh);
        const lastRefreshDay = new Date(lastRefresh.getFullYear(), lastRefresh.getMonth(), lastRefresh.getDate());

        if (today.getTime() > lastRefreshDay.getTime()) {
          get().generateDailyQuests();
          return true;
        }

        return false;
      },

      updateQuestProgress: (questId, progress) => {
        set((state) => ({
          dailyQuests: state.dailyQuests.map((quest) => {
            if (quest.id !== questId) return quest;
            const newCurrent = Math.min(quest.target, quest.current + progress);
            return {
              ...quest,
              current: newCurrent,
              completed: newCurrent >= quest.target,
            };
          }),
        }));
      },

      claimQuestReward: (questId) => {
        const { dailyQuests } = get();
        const quest = dailyQuests.find((q) => q.id === questId);

        if (!quest || !quest.completed || quest.claimed) return false;

        set((state) => ({
          coins: state.coins + quest.reward.coins,
          dailyQuests: state.dailyQuests.map((q) =>
            q.id === questId ? { ...q, claimed: true } : q
          ),
          completedQuestsCount: state.completedQuestsCount + 1,
        }));

        return true;
      },

      // Boss战
      startBossBattle: (bossId) => {
        const { bosses, currentBattle } = get();
        if (currentBattle) return false;

        const boss = bosses.find((b) => b.id === bossId);
        if (!boss || !boss.unlocked || boss.defeated) return false;

        const battle: BossBattle = {
          bossId,
          startTime: Date.now(),
          endTime: null,
          wordCount: 0,
          timeRemaining: boss.challenge.timeLimit,
          status: 'active',
        };

        set({ currentBattle: battle });
        return true;
      },

      updateBossBattle: (wordCount) => {
        const { currentBattle, bosses } = get();
        if (!currentBattle || currentBattle.status !== 'active') return;

        const boss = bosses.find((b) => b.id === currentBattle.bossId);
        if (!boss) return;

        const elapsed = Math.floor((Date.now() - currentBattle.startTime) / 1000);
        const timeRemaining = Math.max(0, boss.challenge.timeLimit - elapsed);

        set({
          currentBattle: {
            ...currentBattle,
            wordCount,
            timeRemaining,
          },
        });
      },

      endBossBattle: (status) => {
        const { currentBattle } = get();
        if (!currentBattle) return null;

        const endedBattle: BossBattle = {
          ...currentBattle,
          endTime: Date.now(),
          status,
        };

        set({ currentBattle: null });

        if (status === 'won') {
          set((state) => ({
            bosses: state.bosses.map((b) =>
              b.id === currentBattle.bossId ? { ...b, defeated: true } : b
            ),
          }));
        }

        return endedBattle;
      },

      unlockNextBoss: (currentBossId) => {
        const { bosses } = get();
        const bossIndex = bosses.findIndex((b) => b.id === currentBossId);
        if (bossIndex === -1 || bossIndex >= bosses.length - 1) return;

        const nextBoss = bosses[bossIndex + 1];
        set((state) => ({
          bosses: state.bosses.map((b) =>
            b.id === nextBoss.id ? { ...b, unlocked: true } : b
          ),
        }));
      },

      // 历史记录
      addWritingHistory: (wordCount, writingTime) => {
        const today = getTodayString();

        set((state) => {
          const existingIndex = state.writingHistory.findIndex((h) => h.date === today);

          if (existingIndex >= 0) {
            // 更新今天的记录
            const updatedHistory = [...state.writingHistory];
            const existing = updatedHistory[existingIndex];
            updatedHistory[existingIndex] = {
              ...existing,
              wordCount: existing.wordCount + wordCount,
              writingTime: existing.writingTime + writingTime,
              sessions: existing.sessions + 1,
            };
            return { writingHistory: updatedHistory };
          } else {
            // 添加新记录
            return {
              writingHistory: [
                ...state.writingHistory,
                {
                  id: generateId(),
                  date: today,
                  wordCount,
                  writingTime,
                  sessions: 1,
                },
              ],
            };
          }
        });
      },

      getWritingStats: () => {
        const { writingHistory } = get();

        // 获取本周数据
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weeklyData = writingHistory.filter((h) => {
          const date = new Date(h.date);
          return date >= weekStart;
        });

        const weeklyWords = weeklyData.reduce((sum, h) => sum + h.wordCount, 0);
        const weeklyTime = weeklyData.reduce((sum, h) => sum + h.writingTime, 0);

        // 找出最佳记录日
        const bestDay = writingHistory.length > 0
          ? writingHistory.reduce((best, current) =>
              current.wordCount > best.wordCount ? current : best
            )
          : null;

        return { weeklyWords, weeklyTime, bestDay };
      },

      resetGame: () => {
        set({
          coins: 0,
          currentSession: null,
          isWriting: false,
          dailyQuests: [],
          sessionStartTime: null,
          lastQuestRefresh: null,
          bosses: BOSSES,
          currentBattle: null,
          writingHistory: [],
          completedQuestsCount: 0,
        });
      },
    }),
    {
      name: 'writequest-game',
    }
  )
);
