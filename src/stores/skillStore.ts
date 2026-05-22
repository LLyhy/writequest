import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill } from '../types';
import { SKILLS } from '../constants/game';

interface SkillState {
  skills: Skill[];
  unlockedSkills: string[];
}

interface SkillActions {
  unlockSkill: (skillId: string, characterLevel: number, availableCoins: number) => { success: boolean; message: string; cost?: number };
  upgradeSkill: (skillId: string, availableCoins: number) => { success: boolean; message: string; cost?: number };
  getSkillEffects: () => { expBoost: number; coinBoost: number; wordBonus: number; focusTime: number; streakBonus: number; aiAssist: boolean };
  resetSkills: () => void;
  canUnlockSkill: (skillId: string, characterLevel: number) => { canUnlock: boolean; reason: string };
}

export const useSkillStore = create<SkillState & SkillActions>()(
  persist(
    (set, get) => ({
      // State
      skills: SKILLS,
      unlockedSkills: [],

      // Actions
      canUnlockSkill: (skillId, characterLevel) => {
        const { skills } = get();
        const skill = skills.find((s) => s.id === skillId);

        if (!skill) {
          return { canUnlock: false, reason: '技能不存在' };
        }

        if (skill.unlocked) {
          return { canUnlock: false, reason: '技能已解锁' };
        }

        if (characterLevel < skill.levelRequired) {
          return { canUnlock: false, reason: `需要等级 ${skill.levelRequired}` };
        }

        // 检查前置技能
        const { unlockedSkills } = get();
        if (skill.prerequisites.length > 0) {
          const missingPrereqs = skill.prerequisites.filter(
            (prereq) => !unlockedSkills.includes(prereq)
          );
          if (missingPrereqs.length > 0) {
            const prereqNames = missingPrereqs
              .map((id) => skills.find((s) => s.id === id)?.name)
              .filter(Boolean)
              .join('、');
            return { canUnlock: false, reason: `需要先解锁: ${prereqNames}` };
          }
        }

        return { canUnlock: true, reason: '' };
      },

      unlockSkill: (skillId, characterLevel, availableCoins) => {
        const { skills } = get();
        const skill = skills.find((s) => s.id === skillId);

        if (!skill) {
          return { success: false, message: '技能不存在' };
        }

        const { canUnlock, reason } = get().canUnlockSkill(skillId, characterLevel);
        if (!canUnlock) {
          return { success: false, message: reason };
        }

        if (availableCoins < skill.cost) {
          return { success: false, message: `需要 ${skill.cost} 金币` };
        }

        set((state) => ({
          unlockedSkills: [...state.unlockedSkills, skillId],
          skills: state.skills.map((s) =>
            s.id === skillId ? { ...s, unlocked: true, currentLevel: 1 } : s
          ),
        }));

        return { success: true, message: `成功解锁 ${skill.name}!`, cost: skill.cost };
      },

      upgradeSkill: (skillId, availableCoins) => {
        const { skills } = get();
        const skill = skills.find((s) => s.id === skillId);

        if (!skill) {
          return { success: false, message: '技能不存在' };
        }

        if (!skill.unlocked) {
          return { success: false, message: '技能未解锁' };
        }

        if (skill.currentLevel >= skill.maxLevel) {
          return { success: false, message: '技能已达到最高等级' };
        }

        const upgradeCost = Math.floor(skill.cost * (1 + skill.currentLevel * 0.5));

        if (availableCoins < upgradeCost) {
          return { success: false, message: `需要 ${upgradeCost} 金币` };
        }

        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === skillId ? { ...s, currentLevel: s.currentLevel + 1 } : s
          ),
        }));

        return { success: true, message: `${skill.name} 升级到等级 ${skill.currentLevel + 1}!`, cost: upgradeCost };
      },

      getSkillEffects: () => {
        const { skills } = get();
        const unlockedSkills = skills.filter((s) => s.unlocked);

        let expBoost = 0;
        let coinBoost = 0;
        let wordBonus = 0;
        let focusTime = 0;
        let streakBonus = 0;
        let aiAssist = false;

        unlockedSkills.forEach((skill) => {
          const level = skill.currentLevel;
          const effect = skill.effect;

          switch (effect.type) {
            case 'exp_boost':
              expBoost += effect.value + effect.perLevel * (level - 1);
              break;
            case 'coin_boost':
              coinBoost += effect.value + effect.perLevel * (level - 1);
              break;
            case 'word_bonus':
              wordBonus += effect.value + effect.perLevel * (level - 1);
              break;
            case 'focus_time':
              focusTime = effect.value + effect.perLevel * (level - 1);
              break;
            case 'streak_bonus':
              streakBonus += effect.value + effect.perLevel * (level - 1);
              break;
            case 'ai_assist':
              aiAssist = level > 0;
              break;
          }
        });

        return { expBoost, coinBoost, wordBonus, focusTime, streakBonus, aiAssist };
      },

      resetSkills: () => {
        set({
          skills: SKILLS,
          unlockedSkills: [],
        });
      },
    }),
    {
      name: 'writequest-skills',
    }
  )
);
