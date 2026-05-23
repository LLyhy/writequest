import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PetType = 'dragon' | 'cat' | 'owl' | 'fox' | 'wolf';

export interface PetSkill {
  id: string;
  name: string;
  description: string;
  effectType: 'expBonus' | 'coinBonus' | 'bossDamage' | 'streakBonus';
  effectValue: number;
  levelRequired: number;
}

export interface Pet {
  id: string;
  type: PetType;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  happiness: number;
  equipped: boolean;
  unlocked: boolean;
  skills: PetSkill[];
  lastInteraction: number;
}

const PET_CONFIGS: Record<PetType, {
  name: string;
  description: string;
  defaultSkills: PetSkill[];
  unlockCondition: string;
}> = {
  dragon: {
    name: '小火龙',
    description: '勇敢的小龙，战斗得力助手',
    unlockCondition: '默认解锁',
    defaultSkills: [
      {
        id: 'dragon-1',
        name: '龙焰',
        description: 'Boss 战攻击力 +15%',
        effectType: 'bossDamage',
        effectValue: 0.15,
        levelRequired: 1,
      },
    ],
  },
  cat: {
    name: '小猫咪',
    description: '温柔的伙伴，让你坚持更久',
    unlockCondition: '达到 5 级',
    defaultSkills: [
      {
        id: 'cat-1',
        name: '治愈',
        description: '连续写作奖励 +20%',
        effectType: 'streakBonus',
        effectValue: 0.20,
        levelRequired: 1,
      },
    ],
  },
  owl: {
    name: '智慧猫头鹰',
    description: '智慧的象征，学习事半功倍',
    unlockCondition: '达到 10 级',
    defaultSkills: [
      {
        id: 'owl-1',
        name: '智慧之眼',
        description: '经验获取 +10%',
        effectType: 'expBonus',
        effectValue: 0.10,
        levelRequired: 1,
      },
    ],
  },
  fox: {
    name: '小狐狸',
    description: '狡猾的朋友，总能找到宝藏',
    unlockCondition: '达到 15 级',
    defaultSkills: [
      {
        id: 'fox-1',
        name: '寻宝',
        description: '金币掉落 +15%',
        effectType: 'coinBonus',
        effectValue: 0.15,
        levelRequired: 1,
      },
    ],
  },
  wolf: {
    name: '夜狼',
    description: '神秘的夜行者，在黑暗中力量倍增',
    unlockCondition: '连续写作 7 天',
    defaultSkills: [
      {
        id: 'wolf-1',
        name: '月夜',
        description: '夜间写作（20-6点）所有奖励 +25%',
        effectType: 'expBonus',
        effectValue: 0.25,
        levelRequired: 1,
      },
    ],
  },
};

const createDefaultPet = (type: PetType, unlocked: boolean = false): Pet => {
  const config = PET_CONFIGS[type];
  return {
    id: `pet-${type}`,
    type,
    name: config.name,
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    happiness: 100,
    equipped: type === 'dragon',
    unlocked,
    skills: config.defaultSkills,
    lastInteraction: Date.now(),
  };
};

interface PetStore {
  pets: Pet[];
  activePetId: string | null;
  petExpGained: number;
  
  getEquippedPet: () => Pet | null;
  equipPet: (petId: string) => void;
  addPetExp: (amount: number) => void;
  interactWithPet: (petId: string, type: 'play' | 'feed') => void;
  renamePet: (petId: string, newName: string) => void;
  unlockPet: (type: PetType) => void;
  checkPetUnlocks: (level: number, streak: number) => void;
  getActivePetBonus: () => {
    expBonus: number;
    coinBonus: number;
    bossDamageBonus: number;
    streakBonus: number;
  };
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      pets: [createDefaultPet('dragon', true)],
      activePetId: 'pet-dragon',
      petExpGained: 0,

      getEquippedPet: () => {
        const { pets } = get();
        return pets.find(p => p.equipped) || null;
      },

      equipPet: (petId: string) => {
        set(state => ({
          pets: state.pets.map(p => ({
            ...p,
            equipped: p.id === petId,
          })),
          activePetId: petId,
        }));
      },

      addPetExp: (amount: number) => {
        set(state => {
          const updatedPets = state.pets.map(pet => {
            if (pet.equipped) {
              const newExp = pet.exp + amount;
              let newLevel = pet.level;
              let newExpToNextLevel = pet.expToNextLevel;
              let remainingExp = newExp;

              while (remainingExp >= newExpToNextLevel) {
                newLevel++;
                remainingExp -= newExpToNextLevel;
                newExpToNextLevel = Math.floor(newExpToNextLevel * 1.5);
              }

              return {
                ...pet,
                level: newLevel,
                exp: remainingExp,
                expToNextLevel: newExpToNextLevel,
              };
            }
            return pet;
          });

          return {
            pets: updatedPets,
            petExpGained: state.petExpGained + amount,
          };
        });
      },

      interactWithPet: (petId: string, type: 'play' | 'feed') => {
        set(state => ({
          pets: state.pets.map(pet => {
            if (pet.id === petId) {
              const happinessChange = type === 'play' ? 10 : 20;
              return {
                ...pet,
                happiness: Math.min(100, pet.happiness + happinessChange),
                lastInteraction: Date.now(),
              };
            }
            return pet;
          }),
        }));
      },

      renamePet: (petId: string, newName: string) => {
        set(state => ({
          pets: state.pets.map(pet => {
            if (pet.id === petId) {
              return { ...pet, name: newName };
            }
            return pet;
          }),
        }));
      },

      unlockPet: (type: PetType) => {
        set(state => {
          const existingPet = state.pets.find(p => p.type === type);
          if (existingPet) {
            return {
              pets: state.pets.map(p => 
                p.type === type ? { ...p, unlocked: true } : p
              ),
            };
          }

          return {
            pets: [...state.pets, createDefaultPet(type, true)],
          };
        });
      },

      checkPetUnlocks: (level: number, streak: number) => {
        const { unlockPet } = get();

        if (level >= 5) unlockPet('cat');
        if (level >= 10) unlockPet('owl');
        if (level >= 15) unlockPet('fox');
        if (streak >= 7) unlockPet('wolf');
      },

      getActivePetBonus: () => {
        const { getEquippedPet } = get();
        const equippedPet = getEquippedPet();

        if (!equippedPet) {
          return {
            expBonus: 0,
            coinBonus: 0,
            bossDamageBonus: 0,
            streakBonus: 0,
          };
        }

        const isNighttime = (() => {
          const hour = new Date().getHours();
          return hour >= 20 || hour < 6;
        })();

        let expBonus = 0;
        let coinBonus = 0;
        let bossDamageBonus = 0;
        let streakBonus = 0;

        const happinessMultiplier = equippedPet.happiness >= 80 ? 1.5 : 1;

        equippedPet.skills.forEach(skill => {
          let value = skill.effectValue * happinessMultiplier;

          if (equippedPet.type === 'wolf' && isNighttime) {
            value *= 1.25;
          }

          switch (skill.effectType) {
            case 'expBonus':
              expBonus += value;
              break;
            case 'coinBonus':
              coinBonus += value;
              break;
            case 'bossDamage':
              bossDamageBonus += value;
              break;
            case 'streakBonus':
              streakBonus += value;
              break;
          }
        });

        return {
          expBonus,
          coinBonus,
          bossDamageBonus,
          streakBonus,
        };
      },
    }),
    {
      name: 'writequest-pet',
    }
  )
);
