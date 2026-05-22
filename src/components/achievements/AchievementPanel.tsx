import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAchievementStore, useCharacterStore, useGameStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { Award, Trophy, Target, Clock, BookOpen, Zap, Skull, Scroll, Check } from 'lucide-react';
import type { Achievement, AchievementType } from '../../types';

interface AchievementPanelProps {
  onClose?: () => void;
}

const typeIcons: Record<AchievementType, React.ReactNode> = {
  first_write: <BookOpen size={18} />,
  streak: <Target size={18} />,
  total_words: <Scroll size={18} />,
  total_time: <Clock size={18} />,
  level_up: <Zap size={18} />,
  boss_defeat: <Skull size={18} />,
  quest_complete: <Award size={18} />,
};

const typeNames: Record<AchievementType, string> = {
  first_write: '首次',
  streak: '连续',
  total_words: '字数',
  total_time: '时间',
  level_up: '等级',
  boss_defeat: 'Boss',
  quest_complete: '任务',
};

const tierColors = {
  1: 'border-yellow-600 bg-yellow-900/20', // 铜
  2: 'border-gray-400 bg-gray-700/20',     // 银
  3: 'border-yellow-400 bg-yellow-600/20', // 金
};

const tierNames = {
  1: '铜',
  2: '银',
  3: '金',
};

export const AchievementPanel: React.FC<AchievementPanelProps> = () => {
  const { achievements, checkAchievements, getUnlockedCount, getProgressByType } = useAchievementStore();
  const { character } = useCharacterStore();
  const { bosses, completedQuestsCount, addCoins } = useGameStore();

  // 检查成就
  useEffect(() => {
    if (!character) return;

    const bossDefeatedCount = bosses.filter((b) => b.defeated).length;

    const newlyUnlocked = checkAchievements({
      totalWords: character.totalWords,
      totalTime: character.totalWritingTime,
      level: character.level,
      streakDays: character.streakDays,
      bossDefeated: bossDefeatedCount,
      questsCompleted: completedQuestsCount,
      hasWritten: character.totalWords > 0,
    });

    // 自动发放成就奖励
    newlyUnlocked.forEach((achievement) => {
      addCoins(achievement.reward.coins);
    });
  }, [character, bosses, completedQuestsCount]);

  const unlockedCount = getUnlockedCount();
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // 按类型分组
  const achievementsByType = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.type]) {
      acc[achievement.type] = [];
    }
    acc[achievement.type].push(achievement);
    return acc;
  }, {} as Record<AchievementType, Achievement[]>);

  return (
    <PixelPanel title="成就系统" titleIcon={<Trophy className="text-pixel-accent" />}>
      <div className="space-y-4">
        {/* 总体进度 */}
        <div className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-sm text-white">总进度</span>
            <span className="text-sm font-mono text-pixel-accent">
              {unlockedCount}/{totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="h-3 bg-pixel-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pixel-accent to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* 分类进度 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(typeNames).map(([type, name]) => {
            const progress = getProgressByType(type as AchievementType);
            return (
              <div
                key={type}
                className="bg-pixel-bg/30 p-2 rounded border border-pixel-border/50 text-center"
              >
                <div className="text-pixel-secondary mb-1">{typeIcons[type as AchievementType]}</div>
                <div className="text-xs text-gray-400 font-mono">{name}</div>
                <div className="text-xs font-pixel text-white">
                  {progress.current}/{progress.total}
                </div>
              </div>
            );
          })}
        </div>

        {/* 成就列表 */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {Object.entries(achievementsByType).map(([type, typeAchievements]) => (
            <div key={type}>
              <h4 className="font-pixel text-xs text-gray-500 mb-2 flex items-center gap-2">
                {typeIcons[type as AchievementType]}
                {typeNames[type as AchievementType]}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {typeAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      relative p-3 rounded-lg border-2
                      ${achievement.unlocked
                        ? tierColors[achievement.tier as keyof typeof tierColors]
                        : 'border-gray-700 bg-gray-800/30'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* 图标 */}
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center text-lg
                        ${achievement.unlocked
                          ? 'bg-white/20'
                          : 'bg-gray-700 grayscale'
                        }
                      `}>
                        {achievement.icon}
                      </div>

                      {/* 信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-pixel text-xs truncate ${
                            achievement.unlocked ? 'text-white' : 'text-gray-500'
                          }`}>
                            {achievement.name}
                          </h5>
                          {achievement.unlocked && (
                            <Check size={14} className="text-pixel-primary" />
                          )}
                          <span className={`
                            text-xs px-1.5 py-0.5 rounded font-mono
                            ${achievement.tier === 3 ? 'bg-yellow-400/20 text-yellow-400' :
                              achievement.tier === 2 ? 'bg-gray-400/20 text-gray-400' :
                              'bg-yellow-600/20 text-yellow-600'}
                          `}>
                            {tierNames[achievement.tier as keyof typeof tierNames]}
                          </span>
                        </div>

                        <p className={`text-xs font-mono mt-1 ${
                          achievement.unlocked ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {achievement.description}
                        </p>

                        {/* 奖励 */}
                        {achievement.unlocked && (
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="text-pixel-primary">+{achievement.reward.exp} XP</span>
                            <span className="text-pixel-accent">+{achievement.reward.coins} 🪙</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 解锁时间 */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="absolute top-2 right-2 text-xs text-gray-500 font-mono">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 提示 */}
        <p className="text-xs text-gray-500 font-mono text-center">
          完成成就可获得经验和金币奖励！
        </p>
      </div>
    </PixelPanel>
  );
};
