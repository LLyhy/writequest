import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, CharacterClass, WritingSession, WritingHistory } from '../types';
import { CLASS_CONFIGS, LEVEL_CONFIGS } from '../constants/game';

interface CharacterStoreState {
  character: Character | null;
  isCreating: boolean;
  writingSession: WritingSession | null;
  isWriting: boolean;
  writingHistory: WritingHistory[];
  
  createCharacter: (name: string, classType: CharacterClass) => void;
  setIsCreating: (isCreating: boolean) => void;
  startWriting: () => void;
  updateWriting: (content: string) => void;
  endWriting: () => { wordCount: number; expGained: number };
  addExp: (exp: number) => void;
  addWords: (words: number) => void;
  addWritingTime: (minutes: number) => void;
  checkAndLevelUp: () => boolean;
  updateStreak: () => void;
  resetCharacter: () => void;
  addBossDefeated: () => void;
}

export const useCharacterStore = create<CharacterStoreState>()(
  persist(
    (set, get) => ({
      character: null,
      isCreating: false,
      writingSession: null,
      isWriting: false,
      writingHistory: [],
      
      createCharacter: (name: string, classType: CharacterClass) => {
        const newCharacter: Character = {
          id: Date.now().toString(),
          name,
          class: classType,
          level: 1,
          exp: 0,
          totalWords: 0,
          totalWritingTime: 0,
          createdAt: Date.now(),
          lastWritingAt: null,
          streakDays: 0,
          lastStreakDate: null,
          bossesDefeated: 0,
        };
        
        set({ character: newCharacter, isCreating: false });
      },
      
      setIsCreating: (isCreating: boolean) => {
        set({ isCreating });
      },
      
      startWriting: () => {
        const newSession: WritingSession = {
          id: Date.now().toString(),
          startTime: Date.now(),
          endTime: null,
          wordCount: 0,
          content: '',
          expGained: 0,
        };
        
        set({ writingSession: newSession, isWriting: true });
      },
      
      updateWriting: (content: string) => {
        set((state) => {
          if (!state.writingSession) return state;
          
          const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
          
          return {
            writingSession: {
              ...state.writingSession,
              content,
              wordCount,
            },
          };
        });
      },
      
      endWriting: () => {
        const { writingSession, character } = get();
        
        if (!writingSession || !character) {
          return { wordCount: 0, expGained: 0 };
        }
        
        const classConfig = CLASS_CONFIGS.find(c => c.id === character.class);
        const wordExp = writingSession.wordCount * (classConfig?.bonus.expMultiplier || 1);
        const expGained = Math.floor(wordExp);
        
        set((state) => ({
          writingSession: null,
          isWriting: false,
          character: state.character ? {
            ...state.character,
            totalWords: state.character.totalWords + writingSession.wordCount,
            exp: state.character.exp + expGained,
            lastWritingAt: Date.now(),
          } : null,
        }));
        
        return { wordCount: writingSession.wordCount, expGained };
      },
      
      addExp: (exp: number) => {
        set((state) => {
          if (!state.character) return state;
          
          return {
            character: {
              ...state.character,
              exp: state.character.exp + exp,
            },
          };
        });
      },
      
      addWords: (words: number) => {
        set((state) => {
          if (!state.character) return state;
          
          return {
            character: {
              ...state.character,
              totalWords: state.character.totalWords + words,
            },
          };
        });
      },
      
      addWritingTime: (minutes: number) => {
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
        
        const nextLevel = LEVEL_CONFIGS.find(l => l.level === character.level + 1);
        if (nextLevel && character.exp >= nextLevel.expRequired) {
          set((state) => ({
            character: state.character ? {
              ...state.character,
              level: state.character.level + 1,
            } : null,
          }));
          return true;
        }
        
        return false;
      },
      
      updateStreak: () => {
        set((state) => {
          if (!state.character) return state;
          
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          let newStreakDays = state.character.streakDays;
          
          if (state.character.lastStreakDate === yesterday) {
            newStreakDays += 1;
          } else if (state.character.lastStreakDate !== today) {
            newStreakDays = 1;
          }
          
          return {
            character: {
              ...state.character,
              streakDays: newStreakDays,
              lastStreakDate: today,
            },
          };
        });
      },
      
      resetCharacter: () => {
        set({ 
          character: null, 
          isCreating: true,
          writingSession: null,
          isWriting: false,
          writingHistory: [],
        });
      },
      
      addBossDefeated: () => {
        set((state) => {
          if (!state.character) return state;
          
          return {
            character: {
              ...state.character,
              bossesDefeated: state.character.bossesDefeated + 1,
            },
          };
        });
      },
    }),
    {
      name: 'writequest-character',
    }
  )
);
