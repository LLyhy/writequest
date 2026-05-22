import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, useCharacterStore, useEditorStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { QuestCard } from '../ui/QuestCard';
import { Scroll, RefreshCw } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';

interface DailyQuestsProps {
  onQuestComplete?: (exp: number, coins: number) => void;
}

export const DailyQuests: React.FC<DailyQuestsProps> = ({ onQuestComplete }) => {
  const {
    dailyQuests,
    generateDailyQuests,
    claimQuestReward,
    updateQuestProgress,
  } = useGameStore();

  const { character, addExp } = useCharacterStore();
  const { wordCount } = useEditorStore();
  
  // 用于追踪已完成的任务，防止重复触发
  const completedQuestsRef = useRef<Set<string>>(new Set());

  // 初始化每日任务
  useEffect(() => {
    if (dailyQuests.length === 0) {
      generateDailyQuests();
    }
  }, []);

  // 监听字数变化，更新任务进度
  useEffect(() => {
    if (!character) return;

    dailyQuests.forEach((quest) => {
      if (quest.completed || quest.claimed) return;

      // 更新字数相关任务
      if (quest.category === 'word') {
        const newProgress = Math.min(quest.target, wordCount);
        if (newProgress > quest.current) {
          updateQuestProgress(quest.id, newProgress - quest.current);
        }
      }
    });
  }, [wordCount, character]);

  const handleClaim = (questId: string) => {
    const quest = dailyQuests.find((q) => q.id === questId);
    if (quest && claimQuestReward(questId)) {
      // 同时给予经验值
      addExp(quest.reward.exp);
      
      // 触发完成动画
      if (onQuestComplete && !completedQuestsRef.current.has(questId)) {
        completedQuestsRef.current.add(questId);
        onQuestComplete(quest.reward.exp, quest.reward.coins);
      }
    }
  };

  const handleRefresh = () => {
    if (confirm('确定要刷新今日任务吗？当前进度将丢失。')) {
      generateDailyQuests();
      completedQuestsRef.current.clear();
    }
  };

  return (
    <PixelPanel
      title="每日任务"
      titleIcon={<Scroll className="text-pixel-accent" />}
    >
      <div className="space-y-3">
        {dailyQuests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 font-mono text-sm">暂无任务</p>
            <PixelButton
              variant="primary"
              size="sm"
              onClick={generateDailyQuests}
              className="mt-4"
            >
              生成任务
            </PixelButton>
          </div>
        ) : (
          <>
            {dailyQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuestCard quest={quest} onClaim={handleClaim} />
              </motion.div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 font-mono transition-colors"
              >
                <RefreshCw size={12} />
                刷新任务
              </button>
            </div>
          </>
        )}
      </div>
    </PixelPanel>
  );
};
