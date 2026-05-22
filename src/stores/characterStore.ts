import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, CharacterClass } from '../types';
import { checkLevelUp, getTodayString, getYesterdayString } from '../constants/game';

interface CharacterState {
  character: Character | null;
  isCreating: boolean;
}

interface CharacterActions {
  createCharacter: (name: string, characterClass: CharacterClass) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  addExp: (exp: number) => void;
  addWords: (words: number) => void;
  addWritingTime: (minutes: number) => void;
  checkAndLevelUp: () => boolean;
  updateStreak: () => { streakIncreased: boolean; newStreak: number };
  resetCharacter: () => void;
  setIsCreating: (isCreating: boolean) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createInitialCharacter = (name: string, characterClass: CharacterClass): Character => ({
  id: generateId(),
  name,
  class: characterClass,
  level: 1,
  exp: 0,
  totalWords: 0,
  totalWritingTime: 0,
  createdAt: Date.now(),
  lastWritingAt: null,
  streakDays: 0,
  lastStreakDate: null,
});

export const useCharacterStore = create<CharacterState & CharacterActions>()(
  persist(
    (set, get) => ({
      // State
      character: null,
      isCreating: false,

      // Actions
      createCharacter: (name, characterClass) => {
        const newCharacter = createInitialCharacter(name, characterClass);
        set({ character: newCharacter, isCreating: false });
      },

      updateCharacter: (updates) => {
        set((state) => ({
          character: state.character
            ? { ...state.character, ...updates }
            : null,
        }));
      },

      addExp: (exp) => {
        set((state) => {
          if (!state.character) return state;
          const newExp = state.character.exp + exp;
          return {
            character: {
              ...state.character,
              exp: newExp,
            },
          };
        });
      },

      addWords: (words) => {
        set((state) => {
          if (!state.character) return state;
          return {
            character: {
              ...state.character,
              totalWords: state.character.totalWords + words,
              lastWritingAt: Date.now(),
            },
          };
        });
      },

      addWritingTime: (minutes) => {
        set((state) => {
          if (!state.character) return state;
          return {
            character: {
              ...state.character,
              totalWritingTime: state.character.totalWritingTime + minutes,
            },
          };
        });
      },

      checkAndLevelUp: () => {
        const { character } = get();
        if (!character) return false;

        const canLevelUp = checkLevelUp(character.exp, character.level);
        if (canLevelUp) {
          const nextLevel = character.level + 1;

          set({
            character: {
              ...character,
              level: nextLevel,
            },
          });
          return true;
        }
        return false;
      },

      updateStreak: () => {
        const { character } = get();
        if (!character) return { streakIncreased: false, newStreak: 0 };

        const today = getTodayString();
        const yesterday = getYesterdayString();
        const lastStreakDate = character.lastStreakDate;

        // 如果今天已经记录过，不增加连续天数
        if (lastStreakDate === today) {
          return { streakIncreased: false, newStreak: character.streakDays };
        }

        let newStreak = character.streakDays;

        // 如果是昨天写的，连续天数+1
        if (lastStreakDate === yesterday) {
          newStreak = character.streakDays + 1;
        } else if (lastStreakDate === null || lastStreakDate < yesterday) {
          // 如果断更了，重置为1
          newStreak = 1;
        }

        set({
          character: {
            ...character,
            streakDays: newStreak,
            lastStreakDate: today,
          },
        });

        return {
          streakIncreased: newStreak > character.streakDays,
          newStreak,
        };
      },

      resetCharacter: () => {
        set({ character: null, isCreating: false });
      },

      setIsCreating: (isCreating) => {
        set({ isCreating });
      },
    }),
    {
      name: 'writequest-character',
    }
  )
);
