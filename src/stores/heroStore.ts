import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Equipment, EquipmentState, LootBoxState, CustomCharacterState, CharacterAppearance, LootBoxHistory, LootBoxPrize, EquipmentSlot } from '../types';
import { ALL_EQUIPMENT, DEFAULT_CHARACTER_APPEARANCE, drawLootBox, getTodayString } from '../constants/game';

interface HeroStoreState {
  // 装备系统
  equipment: EquipmentState;
  
  // 抽奖系统
  lootBox: LootBoxState;
  
  // 主角自定义
  characterCustomization: CustomCharacterState;
  
  // 装备操作
  unlockEquipment: (equipmentId: string) => void;
  equipEquipment: (slot: EquipmentSlot, equipmentId: string | null) => void;
  getEquippedEquipment: () => Record<EquipmentSlot, Equipment | null>;
  getTotalStats: () => { attack: number; defense: number; speed: number; luck: number };
  
  // 抽奖操作
  draw: () => LootBoxPrize | null;
  addDrawHistory: (prize: LootBoxPrize) => void;
  addDraws: (count: number) => void;
  resetDailyDraws: () => void;
  
  // 主角自定义操作
  updateAppearance: (appearance: Partial<CharacterAppearance>) => void;
}

export const useHeroStore = create<HeroStoreState>()(
  persist(
    (set, get) => ({
      // 装备系统初始状态
      equipment: {
        inventory: [],
        equipped: {
          helmet: null,
          armor: null,
          leggings: null,
          weapon: null,
          ring: null,
        },
      },
      
      // 抽奖系统初始状态
      lootBox: {
        drawsRemaining: 0,
        history: [],
        totalDraws: 0,
        lastDrawDate: null,
      },
      
      // 主角自定义初始状态
      characterCustomization: {
        appearance: DEFAULT_CHARACTER_APPEARANCE,
      },
      
      // 装备操作
      unlockEquipment: (equipmentId: string) => {
        set((state) => {
          const existing = state.equipment.inventory.find(e => e.id === equipmentId);
          if (existing) return state;
          
          const equipmentData = ALL_EQUIPMENT.find(e => e.id === equipmentId);
          if (!equipmentData) return state;
          
          const newEquipment = { ...equipmentData, unlocked: true };
          
          return {
            ...state,
            equipment: {
              ...state.equipment,
              inventory: [...state.equipment.inventory, newEquipment],
            },
          };
        });
      },
      
      equipEquipment: (slot: EquipmentSlot, equipmentId: string | null) => {
        set((state) => ({
          ...state,
          equipment: {
            ...state.equipment,
            equipped: {
              ...state.equipment.equipped,
              [slot]: equipmentId,
            },
          },
        }));
      },
      
      getEquippedEquipment: () => {
        const { equipment } = get();
        const result: Record<EquipmentSlot, Equipment | null> = {
          helmet: null,
          armor: null,
          leggings: null,
          weapon: null,
          ring: null,
        };
        
        for (const slot of Object.keys(equipment.equipped) as EquipmentSlot[]) {
          const equipmentId = equipment.equipped[slot];
          if (equipmentId) {
            const item = equipment.inventory.find(e => e.id === equipmentId);
            if (item) {
              result[slot] = item;
            }
          }
        }
        
        return result;
      },
      
      getTotalStats: () => {
        const { getEquippedEquipment } = get();
        const equipped = getEquippedEquipment();
        
        let totalAttack = 0;
        let totalDefense = 0;
        let totalSpeed = 0;
        let totalLuck = 0;
        
        for (const item of Object.values(equipped)) {
          if (item) {
            totalAttack += item.stats.attack;
            totalDefense += item.stats.defense;
            totalSpeed += item.stats.speed;
            totalLuck += item.stats.luck;
          }
        }
        
        return {
          attack: totalAttack,
          defense: totalDefense,
          speed: totalSpeed,
          luck: totalLuck,
        };
      },
      
      // 抽奖操作
      draw: () => {
        const { lootBox } = get();
        
        if (lootBox.drawsRemaining <= 0) {
          return null;
        }
        
        const prize = drawLootBox();
        
        set((state) => ({
          ...state,
          lootBox: {
            ...state.lootBox,
            drawsRemaining: state.lootBox.drawsRemaining - 1,
            totalDraws: state.lootBox.totalDraws + 1,
          },
        }));
        
        return prize;
      },
      
      addDrawHistory: (prize: LootBoxPrize) => {
        const historyItem: LootBoxHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          prize,
        };
        
        set((state) => ({
          ...state,
          lootBox: {
            ...state.lootBox,
            history: [historyItem, ...state.lootBox.history].slice(0, 50),
          },
        }));
      },
      
      addDraws: (count: number) => {
        set((state) => ({
          ...state,
          lootBox: {
            ...state.lootBox,
            drawsRemaining: state.lootBox.drawsRemaining + count,
          },
        }));
      },
      
      resetDailyDraws: () => {
        const today = getTodayString();
        set((state) => {
          if (state.lootBox.lastDrawDate !== today) {
            return {
              ...state,
              lootBox: {
                ...state.lootBox,
                drawsRemaining: 0,
                lastDrawDate: today,
              },
            };
          }
          return state;
        });
      },
      
      // 主角自定义操作
      updateAppearance: (appearance: Partial<CharacterAppearance>) => {
        set((state) => ({
          ...state,
          characterCustomization: {
            ...state.characterCustomization,
            appearance: {
              ...state.characterCustomization.appearance,
              ...appearance,
            },
          },
        }));
      },
    }),
    {
      name: 'character-storage',
    }
  )
);
