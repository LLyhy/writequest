import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillStore, useCharacterStore, useGameStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { Lock, Check, Star, Zap, Coins, Brain, Flame, Sparkles, Bot } from 'lucide-react';
import type { Skill } from '../../types';

interface SkillTreeProps {
  onClose?: () => void;
}

const skillIcons: Record<string, React.ReactNode> = {
  focus_mind: <Brain size={24} />,
  word_wealth: <Coins size={24} />,
  deep_focus: <Zap size={24} />,
  streak_master: <Flame size={24} />,
  word_master: <Sparkles size={24} />,
  ai_assist: <Bot size={24} />,
};

export const SkillTree: React.FC<SkillTreeProps> = () => {
  const { skills, unlockedSkills, unlockSkill, upgradeSkill, canUnlockSkill, getSkillEffects } = useSkillStore();
  const { character } = useCharacterStore();
  const { coins, spendCoins } = useGameStore();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUnlock = (skill: Skill) => {
    if (!character) return;

    const result = unlockSkill(skill.id, character.level, coins);
    
    if (result.success && result.cost) {
      spendCoins(result.cost);
      setMessage({ text: result.message, type: 'success' });
    } else {
      setMessage({ text: result.message, type: 'error' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpgrade = (skill: Skill) => {
    const result = upgradeSkill(skill.id, coins);
    
    if (result.success && result.cost) {
      spendCoins(result.cost);
      setMessage({ text: result.message, type: 'success' });
    } else {
      setMessage({ text: result.message, type: 'error' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const getSkillStatus = (skill: Skill) => {
    if (skill.unlocked) {
      return {
        status: 'unlocked',
        text: skill.currentLevel >= skill.maxLevel ? '已满级' : `等级 ${skill.currentLevel}/${skill.maxLevel}`,
        color: 'text-pixel-primary',
        bgColor: 'bg-pixel-primary/20',
        borderColor: 'border-pixel-primary',
      };
    }

    const { canUnlock, reason } = canUnlockSkill(skill.id, character?.level || 1);
    
    if (canUnlock) {
      return {
        status: 'available',
        text: '可解锁',
        color: 'text-pixel-accent',
        bgColor: 'bg-pixel-accent/20',
        borderColor: 'border-pixel-accent',
      };
    }

    return {
      status: 'locked',
      text: reason,
      color: 'text-gray-500',
      bgColor: 'bg-gray-800',
      borderColor: 'border-gray-600',
    };
  };

  const effects = getSkillEffects();

  return (
    <PixelPanel title="技能树" titleIcon={<Zap className="text-pixel-magic" />}>
      <div className="space-y-4">
        {/* 状态栏 */}
        <div className="flex items-center justify-between bg-pixel-bg/50 p-3 rounded border-2 border-pixel-border">
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-gray-400">
              等级: <span className="text-white">{character?.level || 1}</span>
            </span>
            <span className="text-sm font-mono text-gray-400">
              金币: <span className="text-pixel-accent">{coins} 🪙</span>
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            已解锁: {unlockedSkills.length}/{skills.length}
          </span>
        </div>

        {/* 当前效果 */}
        {unlockedSkills.length > 0 && (
          <div className="bg-pixel-magic/10 p-3 rounded border border-pixel-magic/30">
            <h4 className="text-xs font-pixel text-pixel-magic mb-2">当前技能效果</h4>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {effects.expBoost > 0 && (
                <span className="px-2 py-1 bg-pixel-primary/20 rounded text-pixel-primary">
                  经验 +{(effects.expBoost * 100).toFixed(0)}%
                </span>
              )}
              {effects.coinBoost > 0 && (
                <span className="px-2 py-1 bg-pixel-accent/20 rounded text-pixel-accent">
                  金币 +{effects.coinBoost}/100字
                </span>
              )}
              {effects.wordBonus > 0 && (
                <span className="px-2 py-1 bg-pixel-secondary/20 rounded text-pixel-secondary">
                  字数经验 +{(effects.wordBonus * 100).toFixed(0)}%
                </span>
              )}
              {effects.focusTime > 0 && (
                <span className="px-2 py-1 bg-pixel-danger/20 rounded text-pixel-danger">
                  专注{effects.focusTime}分钟双倍
                </span>
              )}
              {effects.aiAssist && (
                <span className="px-2 py-1 bg-pixel-magic/20 rounded text-pixel-magic">
                  AI助手已解锁
                </span>
              )}
            </div>
          </div>
        )}

        {/* 消息提示 */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded text-center font-mono text-sm ${
                message.type === 'success' ? 'bg-pixel-primary/20 text-pixel-primary' : 'bg-pixel-danger/20 text-pixel-danger'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 技能列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill, index) => {
            const status = getSkillStatus(skill);
            const isSelected = selectedSkill?.id === skill.id;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedSkill(skill)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${status.bgColor} ${status.borderColor}
                  ${isSelected ? 'ring-2 ring-white' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* 图标 */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${skill.unlocked ? 'bg-white/20' : 'bg-gray-700'}
                    ${status.color}
                  `}>
                    {skillIcons[skill.id] || <Star size={20} />}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-pixel text-sm text-white truncate">{skill.name}</h4>
                      {skill.unlocked && <Check size={14} className="text-pixel-primary" />}
                      {!skill.unlocked && status.status === 'locked' && <Lock size={14} className="text-gray-500" />}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-1">{skill.description}</p>
                    
                    {/* 等级显示 */}
                    {skill.unlocked && skill.maxLevel > 1 && (
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(skill.maxLevel)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-1.5 rounded-sm ${
                              i < skill.currentLevel ? 'bg-pixel-primary' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* 状态标签 */}
                    <div className="mt-2">
                      <span className={`text-xs font-mono ${status.color}`}>{status.text}</span>
                    </div>
                  </div>
                </div>

                {/* 消耗 */}
                {!skill.unlocked && status.status === 'available' && (
                  <div className="absolute top-2 right-2 text-xs font-pixel text-pixel-accent">
                    {skill.cost} 🪙
                  </div>
                )}
                {skill.unlocked && skill.currentLevel < skill.maxLevel && (
                  <div className="absolute top-2 right-2 text-xs font-pixel text-pixel-accent">
                    {Math.floor(skill.cost * (1 + skill.currentLevel * 0.5))} 🪙
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 选中技能的详情 */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border"
            >
              <h4 className="font-pixel text-sm text-white mb-2">{selectedSkill.name}</h4>
              <p className="text-xs text-gray-400 font-mono mb-3">{selectedSkill.description}</p>
              
              <div className="text-xs font-mono text-gray-500 mb-3">
                <p>需要等级: {selectedSkill.levelRequired}</p>
                <p>最大等级: {selectedSkill.maxLevel}</p>
                {selectedSkill.prerequisites.length > 0 && (
                  <p>
                    前置技能: {selectedSkill.prerequisites.map(id => 
                      skills.find(s => s.id === id)?.name
                    ).join(', ')}
                  </p>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                {!selectedSkill.unlocked ? (
                  <PixelButton
                    variant="accent"
                    size="sm"
                    onClick={() => handleUnlock(selectedSkill)}
                    disabled={!canUnlockSkill(selectedSkill.id, character?.level || 1).canUnlock || coins < selectedSkill.cost}
                    className="flex-1"
                  >
                    解锁 ({selectedSkill.cost} 🪙)
                  </PixelButton>
                ) : selectedSkill.currentLevel < selectedSkill.maxLevel ? (
                  <PixelButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpgrade(selectedSkill)}
                    disabled={coins < Math.floor(selectedSkill.cost * (1 + selectedSkill.currentLevel * 0.5))}
                    className="flex-1"
                  >
                    升级 ({Math.floor(selectedSkill.cost * (1 + selectedSkill.currentLevel * 0.5))} 🪙)
                  </PixelButton>
                ) : (
                  <span className="text-pixel-primary font-pixel text-sm">已满级</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PixelPanel>
  );
};
