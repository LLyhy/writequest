import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeSkin, FontEffect, Badge, InspirationFragment, WritingMaterial, CollectionProgress } from '../types';
import { THEME_SKINS, FONT_EFFECTS, BADGES, INSPIRATION_FRAGMENTS, WRITING_MATERIALS } from '../constants/game';

interface CollectionState extends CollectionProgress {
  skins: ThemeSkin[];
  fonts: FontEffect[];
  badges: Badge[];
  fragments: InspirationFragment[];
  materials: WritingMaterial[];
}

interface CollectionActions {
  // 皮肤管理
  unlockSkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => boolean;
  getEquippedSkin: () => ThemeSkin;
  getUnlockedSkins: () => ThemeSkin[];
  
  // 字体特效管理
  unlockFont: (fontId: string) => boolean;
  equipFont: (fontId: string) => boolean;
  getEquippedFont: () => FontEffect;
  getUnlockedFonts: () => FontEffect[];
  
  // 徽章管理
  unlockBadge: (badgeId: string) => boolean;
  getUnlockedBadges: () => Badge[];
  getBadgesByCategory: (category: Badge['category']) => Badge[];
  checkBadgeRequirements: (badgeId: string, stats: { words: number; bosses: number; fragments: number; regions: number }) => boolean;
  
  // 灵感碎片管理
  collectFragment: (fragmentId: string) => boolean;
  getCollectedFragments: () => InspirationFragment[];
  getFragmentsByCategory: (category: InspirationFragment['category']) => InspirationFragment[];
  getRandomFragment: () => InspirationFragment | null;
  
  // 写作素材管理
  unlockMaterial: (materialId: string) => boolean;
  getUnlockedMaterials: () => WritingMaterial[];
  canUnlockMaterial: (materialId: string) => boolean;
  
  // 收集进度
  getCollectionProgress: () => {
    skinsProgress: number;
    fontsProgress: number;
    badgesProgress: number;
    fragmentsProgress: number;
    totalProgress: number;
  };
  
  // 重置收集
  resetCollection: () => void;
}

export const useCollectionStore = create<CollectionState & CollectionActions>()(
  persist(
    (set, get) => ({
      // State
      skins: THEME_SKINS,
      fonts: FONT_EFFECTS,
      badges: BADGES,
      fragments: INSPIRATION_FRAGMENTS,
      materials: WRITING_MATERIALS,
      unlockedSkins: ['skin_default'],
      unlockedFonts: ['font_normal'],
      unlockedBadges: [],
      collectedFragments: [],
      currentSkin: 'skin_default',
      currentFont: 'font_normal',

      // Actions
      unlockSkin: (skinId) => {
        const { skins, unlockedSkins } = get();
        const skin = skins.find(s => s.id === skinId);
        
        if (!skin || unlockedSkins.includes(skinId)) return false;
        
        set((state) => ({
          unlockedSkins: [...state.unlockedSkins, skinId],
          skins: state.skins.map(s =>
            s.id === skinId ? { ...s, unlocked: true } : s
          ),
        }));
        
        return true;
      },

      equipSkin: (skinId) => {
        const { unlockedSkins } = get();
        if (!unlockedSkins.includes(skinId)) return false;
        
        set({ currentSkin: skinId });
        return true;
      },

      getEquippedSkin: () => {
        const { skins, currentSkin } = get();
        return skins.find(s => s.id === currentSkin) || skins[0];
      },

      getUnlockedSkins: () => {
        const { skins, unlockedSkins } = get();
        return skins.filter(s => unlockedSkins.includes(s.id));
      },

      unlockFont: (fontId) => {
        const { fonts, unlockedFonts } = get();
        const font = fonts.find(f => f.id === fontId);
        
        if (!font || unlockedFonts.includes(fontId)) return false;
        
        set((state) => ({
          unlockedFonts: [...state.unlockedFonts, fontId],
          fonts: state.fonts.map(f =>
            f.id === fontId ? { ...f, unlocked: true } : f
          ),
        }));
        
        return true;
      },

      equipFont: (fontId) => {
        const { unlockedFonts } = get();
        if (!unlockedFonts.includes(fontId)) return false;
        
        set({ currentFont: fontId });
        return true;
      },

      getEquippedFont: () => {
        const { fonts, currentFont } = get();
        return fonts.find(f => f.id === currentFont) || fonts[0];
      },

      getUnlockedFonts: () => {
        const { fonts, unlockedFonts } = get();
        return fonts.filter(f => unlockedFonts.includes(f.id));
      },

      unlockBadge: (badgeId) => {
        const { badges, unlockedBadges } = get();
        const badge = badges.find(b => b.id === badgeId);
        
        if (!badge || unlockedBadges.includes(badgeId)) return false;
        
        set((state) => ({
          unlockedBadges: [...state.unlockedBadges, badgeId],
          badges: state.badges.map(b =>
            b.id === badgeId ? { ...b, unlocked: true, unlockedAt: Date.now() } : b
          ),
        }));
        
        return true;
      },

      getUnlockedBadges: () => {
        const { badges, unlockedBadges } = get();
        return badges.filter(b => unlockedBadges.includes(b.id));
      },

      getBadgesByCategory: (category) => {
        const { badges, unlockedBadges } = get();
        return badges.filter(b => b.category === category && unlockedBadges.includes(b.id));
      },

      checkBadgeRequirements: (badgeId, stats) => {
        const { badges } = get();
        const badge = badges.find(b => b.id === badgeId);
        
        if (!badge || badge.unlocked) return false;
        
        // 根据徽章ID检查特定条件
        switch (badgeId) {
          case 'badge_writer':
            return stats.words >= 10000;
          case 'badge_master_writer':
            return stats.words >= 50000;
          case 'badge_legendary_writer':
            return stats.words >= 100000;
          case 'badge_warrior':
            return stats.bosses >= 3;
          case 'badge_hero':
            return stats.bosses >= 6;
          case 'badge_collector':
            return stats.fragments >= 10;
          case 'badge_explorer':
            return stats.regions >= 6;
          default:
            return false;
        }
      },

      collectFragment: (fragmentId) => {
        const { fragments, collectedFragments } = get();
        const fragment = fragments.find(f => f.id === fragmentId);
        
        if (!fragment || collectedFragments.includes(fragmentId)) return false;
        
        set((state) => ({
          collectedFragments: [...state.collectedFragments, fragmentId],
          fragments: state.fragments.map(f =>
            f.id === fragmentId ? { ...f, collected: true, collectedAt: Date.now() } : f
          ),
        }));
        
        // 检查是否可以解锁新的写作素材
        const { materials, collectedFragments: updatedFragments } = get();
        materials.forEach(material => {
          if (!material.unlocked && updatedFragments.length >= material.requiredFragments) {
            set((state) => ({
              materials: state.materials.map(m =>
                m.id === material.id ? { ...m, unlocked: true } : m
              ),
            }));
          }
        });
        
        return true;
      },

      getCollectedFragments: () => {
        const { fragments, collectedFragments } = get();
        return fragments.filter(f => collectedFragments.includes(f.id));
      },

      getFragmentsByCategory: (category) => {
        const { fragments, collectedFragments } = get();
        return fragments.filter(f => f.category === category && collectedFragments.includes(f.id));
      },

      getRandomFragment: () => {
        const { fragments, collectedFragments } = get();
        const uncollected = fragments.filter(f => !collectedFragments.includes(f.id));
        
        if (uncollected.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * uncollected.length);
        return uncollected[randomIndex];
      },

      unlockMaterial: (materialId) => {
        const { materials, collectedFragments } = get();
        const material = materials.find(m => m.id === materialId);
        
        if (!material || material.unlocked) return false;
        
        if (collectedFragments.length >= material.requiredFragments) {
          set((state) => ({
            materials: state.materials.map(m =>
              m.id === materialId ? { ...m, unlocked: true } : m
            ),
          }));
          return true;
        }
        
        return false;
      },

      getUnlockedMaterials: () => {
        return get().materials.filter(m => m.unlocked);
      },

      canUnlockMaterial: (materialId) => {
        const { materials, collectedFragments } = get();
        const material = materials.find(m => m.id === materialId);
        
        if (!material || material.unlocked) return false;
        
        return collectedFragments.length >= material.requiredFragments;
      },

      getCollectionProgress: () => {
        const { skins, fonts, badges, fragments, unlockedSkins, unlockedFonts, unlockedBadges, collectedFragments } = get();
        
        const skinsProgress = Math.round((unlockedSkins.length / skins.length) * 100);
        const fontsProgress = Math.round((unlockedFonts.length / fonts.length) * 100);
        const badgesProgress = Math.round((unlockedBadges.length / badges.length) * 100);
        const fragmentsProgress = Math.round((collectedFragments.length / fragments.length) * 100);
        
        const totalProgress = Math.round(
          (skinsProgress + fontsProgress + badgesProgress + fragmentsProgress) / 4
        );
        
        return {
          skinsProgress,
          fontsProgress,
          badgesProgress,
          fragmentsProgress,
          totalProgress,
        };
      },

      resetCollection: () => {
        set({
          skins: THEME_SKINS,
          fonts: FONT_EFFECTS,
          badges: BADGES,
          fragments: INSPIRATION_FRAGMENTS,
          materials: WRITING_MATERIALS,
          unlockedSkins: ['skin_default'],
          unlockedFonts: ['font_normal'],
          unlockedBadges: [],
          collectedFragments: [],
          currentSkin: 'skin_default',
          currentFont: 'font_normal',
        });
      },
    }),
    {
      name: 'writequest-collection',
    }
  )
);
