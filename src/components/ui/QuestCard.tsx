import React from 'react';
import { motion } from 'framer-motion';
import { Check, Gift, Clock } from 'lucide-react';
import type { Quest } from '../../types';
import { PixelButton } from './PixelButton';

interface QuestCardProps {
  quest: Quest;
  onClaim?: (questId: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
  const progressPercent = Math.min(100, (quest.current / quest.target) * 100);
  const isCompleted = quest.completed;
  const isClaimed = quest.claimed;

  const getQuestIcon = () => {
    if (isClaimed) return <Check size={20} className="text-pixel-primary" />;
    if (isCompleted) return <Gift size={20} className="text-pixel-accent animate-bounce" />;
    return <Clock size={20} className="text-gray-500" />;
  };

  const getQuestStatus = () => {
    if (isClaimed) return '已领取';
    if (isCompleted) return '可领取';
    return `${quest.current} / ${quest.target}`;
  };

  return (
    <motion.div
      className={`pixel-panel p-4 ${isCompleted && !isClaimed ? 'border-pixel-accent' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getQuestIcon()}
            <h4 className="font-pixel text-sm text-white truncate">{quest.title}</h4>
          </div>
          <p className="text-xs text-gray-400 font-mono mb-3">{quest.description}</p>

          {/* 进度条 */}
          <div className="h-2 bg-pixel-border rounded-full overflow-hidden mb-2">
            <motion.div
              className={`h-full ${isCompleted ? 'bg-pixel-primary' : 'bg-pixel-secondary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono ${isCompleted ? 'text-pixel-primary' : 'text-gray-500'}`}>
              {getQuestStatus()}
            </span>
            <span className="font-pixel text-pixel-accent">
              +{quest.reward.exp} XP / +{quest.reward.coins} 🪙
            </span>
          </div>
        </div>

        {isCompleted && !isClaimed && onClaim && (
          <PixelButton
            variant="accent"
            size="sm"
            onClick={() => onClaim(quest.id)}
          >
            领取
          </PixelButton>
        )}
      </div>
    </motion.div>
  );
};
