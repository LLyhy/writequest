import { create } from 'zustand';
import { useCharacterStore } from './characterStore';
import { useGameStore } from './gameStore';
import { useEditorStore } from './editorStore';
import { useSkillStore } from './skillStore';
import { useAchievementStore } from './achievementStore';
import { useMapStore } from './mapStore';
import { useStoryStore } from './storyStore';
import { useCollectionStore } from './collectionStore';
import { useShopStore } from './shopStore';
import { useAdventureStore } from './adventureStore';
import { useHeroStore } from './heroStore';
import { useShowcaseStore } from './showcaseStore';
import { useUserProfileStore } from './userProfileStore';

interface ExportOptions {
  includeCharacter: boolean;
  includeGame: boolean;
  includeEditor: boolean;
  includeSkills: boolean;
  includeAchievements: boolean;
  includeMap: boolean;
  includeStory: boolean;
  includeCollection: boolean;
  includeShop: boolean;
  includeAdventure: boolean;
  includeHero: boolean;
  includeShowcase: boolean;
  includeUserProfile: boolean;
}

interface DataExportStore {
  exportOptions: ExportOptions;
  setExportOption: <K extends keyof ExportOptions>(key: K, value: boolean) => void;
  exportData: () => string;
  importData: (jsonString: string) => { success: boolean; error?: string };
  resetAllOptions: () => void;
}

const defaultExportOptions: ExportOptions = {
  includeCharacter: true,
  includeGame: true,
  includeEditor: true,
  includeSkills: true,
  includeAchievements: true,
  includeMap: true,
  includeStory: true,
  includeCollection: true,
  includeShop: true,
  includeAdventure: true,
  includeHero: true,
  includeShowcase: true,
  includeUserProfile: true,
};

export const useDataExportStore = create<DataExportStore>((set, get) => ({
  exportOptions: { ...defaultExportOptions },

  setExportOption: (key, value) =>
    set((state) => ({
      exportOptions: { ...state.exportOptions, [key]: value },
    })),

  resetAllOptions: () =>
    set({ exportOptions: { ...defaultExportOptions } }),

  exportData: () => {
    const options = get().exportOptions;
    const data: Record<string, any> = {
      version: 1,
      exportedAt: Date.now(),
    };

    if (options.includeCharacter) {
      data.character = useCharacterStore.getState();
    }
    if (options.includeGame) {
      data.game = useGameStore.getState();
    }
    if (options.includeEditor) {
      data.editor = useEditorStore.getState();
    }
    if (options.includeSkills) {
      data.skills = useSkillStore.getState();
    }
    if (options.includeAchievements) {
      data.achievements = useAchievementStore.getState();
    }
    if (options.includeMap) {
      data.map = useMapStore.getState();
    }
    if (options.includeStory) {
      data.story = useStoryStore.getState();
    }
    if (options.includeCollection) {
      data.collection = useCollectionStore.getState();
    }
    if (options.includeShop) {
      data.shop = useShopStore.getState();
    }
    if (options.includeAdventure) {
      data.adventure = useAdventureStore.getState();
    }
    if (options.includeHero) {
      data.hero = useHeroStore.getState();
    }
    if (options.includeShowcase) {
      data.showcase = useShowcaseStore.getState();
    }
    if (options.includeUserProfile) {
      data.userProfile = useUserProfileStore.getState();
    }

    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);

      if (!data.version || data.version !== 1) {
        return { success: false, error: '不支持的数据版本' };
      }

      if (data.character) {
        const setState = useCharacterStore.getState();
        Object.assign(setState, data.character);
      }
      if (data.game) {
        const setState = useGameStore.getState();
        Object.assign(setState, data.game);
      }
      if (data.editor) {
        const setState = useEditorStore.getState();
        Object.assign(setState, data.editor);
      }
      if (data.skills) {
        const setState = useSkillStore.getState();
        Object.assign(setState, data.skills);
      }
      if (data.achievements) {
        const setState = useAchievementStore.getState();
        Object.assign(setState, data.achievements);
      }
      if (data.map) {
        const setState = useMapStore.getState();
        Object.assign(setState, data.map);
      }
      if (data.story) {
        const setState = useStoryStore.getState();
        Object.assign(setState, data.story);
      }
      if (data.collection) {
        const setState = useCollectionStore.getState();
        Object.assign(setState, data.collection);
      }
      if (data.shop) {
        const setState = useShopStore.getState();
        Object.assign(setState, data.shop);
      }
      if (data.adventure) {
        const setState = useAdventureStore.getState();
        Object.assign(setState, data.adventure);
      }
      if (data.hero) {
        const setState = useHeroStore.getState();
        Object.assign(setState, data.hero);
      }
      if (data.showcase) {
        const setState = useShowcaseStore.getState();
        Object.assign(setState, data.showcase);
      }
      if (data.userProfile) {
        const setState = useUserProfileStore.getState();
        Object.assign(setState, data.userProfile);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '导入失败' };
    }
  },
}));
