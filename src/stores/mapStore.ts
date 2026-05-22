import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapRegion, MapExplorationState } from '../types';
import { MAP_REGIONS } from '../constants/game';

interface MapState extends MapExplorationState {
  regions: MapRegion[];
}

interface MapActions {
  // 区域解锁
  unlockRegion: (regionId: string) => boolean;
  
  // 区域探索
  exploreRegion: (regionId: string, progress: number) => void;
  completeRegionChallenge: (regionId: string, challengeId: string) => void;
  
  // 获取已解锁区域
  getUnlockedRegions: () => MapRegion[];
  
  // 获取当前区域
  getCurrentRegion: () => MapRegion | null;
  
  // 设置当前区域
  setCurrentRegion: (regionId: string | null) => void;
  
  // 检查区域是否可解锁
  canUnlockRegion: (regionId: string, playerLevel: number, currentChapter: number) => boolean;
  
  // 获取探索进度
  getExplorationProgress: () => number;
  
  // 获取区域连接状态
  getRegionConnections: (regionId: string) => MapRegion[];
  
  // 重置地图
  resetMap: () => void;
}

export const useMapStore = create<MapState & MapActions>()(
  persist(
    (set, get) => ({
      // State
      regions: MAP_REGIONS,
      currentRegion: 'region_village',
      visitedRegions: ['region_village'],
      totalExplorationProgress: 0,

      // Actions
      unlockRegion: (regionId) => {
        const { regions } = get();
        const region = regions.find(r => r.id === regionId);
        
        if (!region || region.unlocked) return false;
        
        set((state) => ({
          regions: state.regions.map(r =>
            r.id === regionId ? { ...r, unlocked: true } : r
          ),
        }));
        
        return true;
      },

      exploreRegion: (regionId, progress) => {
        set((state) => ({
          regions: state.regions.map(r => {
            if (r.id !== regionId) return r;
            
            const newProgress = Math.min(100, r.explorationProgress + progress);
            return {
              ...r,
              explorationProgress: newProgress,
              explored: newProgress >= 100,
            };
          }),
        }));
        
        // 更新总探索进度
        const { regions } = get();
        const totalProgress = regions.reduce((sum, r) => sum + r.explorationProgress, 0) / regions.length;
        set({ totalExplorationProgress: Math.round(totalProgress) });
      },

      completeRegionChallenge: (regionId, challengeId) => {
        set((state) => ({
          regions: state.regions.map(r => {
            if (r.id !== regionId) return r;
            
            return {
              ...r,
              challenges: r.challenges.map(c =>
                c.id === challengeId ? { ...c, completed: true } : c
              ),
            };
          }),
        }));
      },

      getUnlockedRegions: () => {
        return get().regions.filter(r => r.unlocked);
      },

      getCurrentRegion: () => {
        const { regions, currentRegion } = get();
        if (!currentRegion) return null;
        return regions.find(r => r.id === currentRegion) || null;
      },

      setCurrentRegion: (regionId) => {
        if (regionId) {
          set((state) => ({
            currentRegion: regionId,
            visitedRegions: state.visitedRegions.includes(regionId)
              ? state.visitedRegions
              : [...state.visitedRegions, regionId],
          }));
        } else {
          set({ currentRegion: null });
        }
      },

      canUnlockRegion: (regionId, playerLevel, currentChapter) => {
        const { regions } = get();
        const region = regions.find(r => r.id === regionId);
        
        if (!region || region.unlocked) return false;
        
        // 检查等级要求
        if (playerLevel < region.requiredLevel) return false;
        
        // 检查章节要求
        if (region.requiredChapter && currentChapter < region.requiredChapter) return false;
        
        // 检查是否有连接的区域已解锁
        const hasUnlockedConnection = region.connections.some(connId => {
          const connRegion = regions.find(r => r.id === connId);
          return connRegion?.unlocked;
        });
        
        return hasUnlockedConnection;
      },

      getExplorationProgress: () => {
        const { regions } = get();
        const totalProgress = regions.reduce((sum, r) => sum + r.explorationProgress, 0);
        return Math.round(totalProgress / regions.length);
      },

      getRegionConnections: (regionId) => {
        const { regions } = get();
        const region = regions.find(r => r.id === regionId);
        if (!region) return [];
        
        return regions.filter(r => region.connections.includes(r.id));
      },

      resetMap: () => {
        set({
          regions: MAP_REGIONS,
          currentRegion: 'region_village',
          visitedRegions: ['region_village'],
          totalExplorationProgress: 0,
        });
      },
    }),
    {
      name: 'writequest-map',
    }
  )
);
