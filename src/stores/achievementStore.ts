import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Achievement, AchievementType } from '../types';
import { ACHIEVEMENTS } from '../constants/game';

interface AchievementState {
  achievements: Achievement[];
  newlyUnlocked: string[];
}

interface AchievementActions {
  checkAchievements: (stats: {
    totalWords: number;
    totalTime: number;
    level: number;
    streakDays: number;
    bossDefeated: number;
    questsCompleted: number;
    hasWritten: boolean;
  }) => Achievement[];
  claimAchievementReward: (achievementId: string) => { success: boolean; reward?: { exp: number; coins: number } };
  clearNewlyUnlocked: () => void;
  getUnlockedCount: () => number;
  getProgressByType: (type: AchievementType) => { current: number; total: number };
  resetAchievements: () => void;
}

export const useAchievementStore = create<AchievementState & AchievementActions>()(
  persist(
    (set, get) => ({
      // State
      achievements: ACHIEVEMENTS,
      newlyUnlocked: [],

      // Actions
      checkAchievements: (stats) => {
        const { achievements } = get();
        const newlyUnlocked: Achievement[] = [];

        const updatedAchievements = achievements.map((achievement) => {
          if (achievement.unlocked) return achievement;

          let shouldUnlock = false;

          switch (achievement.type) {
            case 'first_write':
              shouldUnlock = stats.hasWritten;
              break;
            case 'total_words':
              shouldUnlock = stats.totalWords >= achievement.requirement;
              break;
            case 'total_time':
              shouldUnlock = stats.totalTime >= achievement.requirement;
              break;
            case 'level_up':
              shouldUnlock = stats.level >= achievement.requirement;
              break;
            case 'streak':
              shouldUnlock = stats.streakDays >= achievement.requirement;
              break;
            case 'boss_defeat':
              shouldUnlock = stats.bossDefeated >= achievement.requirement;
              break;
            case 'quest_complete':
              shouldUnlock = stats.questsCompleted >= achievement.requirement;
              break;
          }

          if (shouldUnlock) {
            const unlockedAchievement = {
              ...achievement,
              unlocked: true,
              unlockedAt: Date.now(),
            };
            newlyUnlocked.push(unlockedAchievement);
            return unlockedAchievement;
          }

          return achievement;
        });

        if (newlyUnlocked.length > 0) {
          set({
            achievements: updatedAchievements,
            newlyUnlocked: [...get().newlyUnlocked, ...newlyUnlocked.map((a) => a.id)],
          });
        }

        return newlyUnlocked;
      },

      claimAchievementReward: (achievementId) => {
        const { achievements } = get();
        const achievement = achievements.find((a) => a.id === achievementId);

        if (!achievement || !achievement.unlocked) {
          return { success: false };
        }

        return {
          success: true,
          reward: achievement.reward,
        };
      },

      clearNewlyUnlocked: () => {
        set({ newlyUnlocked: [] });
      },

      getUnlockedCount: () => {
        const { achievements } = get();
        return achievements.filter((a) => a.unlocked).length;
      },

      getProgressByType: (type) => {
        const { achievements } = get();
        const typeAchievements = achievements.filter((a) => a.type === type);
        const unlocked = typeAchievements.filter((a) => a.unlocked).length;
        return { current: unlocked, total: typeAchievements.length };
      },

      resetAchievements: () => {
        set({
          achievements: ACHIEVEMENTS,
          newlyUnlocked: [],
        });
      },
    }),
    {
      name: 'writequest-achievements',
    }
  )
);
