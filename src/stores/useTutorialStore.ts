import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TutorialStep = 'welcome' | 'character' | 'editor' | 'quests' | 'boss' | 'complete';

interface TutorialStore {
  completed: boolean;
  currentStep: TutorialStep | null;
  setCurrentStep: (step: TutorialStep | null) => void;
  markComplete: () => void;
  reset: () => void;
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set) => ({
      completed: false,
      currentStep: null,
      setCurrentStep: (step) => set({ currentStep: step }),
      markComplete: () => set({ completed: true, currentStep: null }),
      reset: () => set({ completed: false, currentStep: 'welcome' }),
    }),
    {
      name: 'writequest-tutorial',
    }
  )
);
