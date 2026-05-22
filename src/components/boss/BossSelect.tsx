import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { Lock, CheckCircle, Skull, Trophy } from 'lucide-react';
import type { Boss } from '../../types';

interface BossSelectProps {
  onSelectBoss: (boss: Boss) => void;
}

export const BossSelect: React.FC<BossSelectProps> = ({ onSelectBoss }) => {
  const bosses = useGameStore((state) => state.bosses);

  const getBossStatus = (boss: Boss) => {
    if (boss.defeated) return { text: '已击败', color: 'text-pixel-primary', icon: <CheckCircle size={16} /> };
    if (boss.unlocked) return { text: '可挑战', color: 'text-pixel-accent', icon: <Skull size={16} /> };
    return { text: '未解锁', color: 'text-gray-500', icon: <Lock size={16} /> };
  };

  return (
    <PixelPanel title="Boss挑战" titleIcon={<Trophy className="text-pixel-danger" />}>
      <div className="space-y-4">
        <p className="text-sm text-gray-400 font-mono mb-4">
          击败Boss获得丰厚奖励！每个Boss都有独特的挑战。
        </p>

        {bosses.map((boss, index) => {
          const status = getBossStatus(boss);
          const isClickable = boss.unlocked && !boss.defeated;

          return (
            <motion.div
              key={boss.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 border-2 rounded-lg
                ${boss.defeated ? 'border-pixel-primary/30 bg-pixel-primary/5' : ''}
                ${boss.unlocked && !boss.defeated ? 'border-pixel-danger bg-pixel-danger/5 cursor-pointer hover:bg-pixel-danger/10' : ''}
                ${!boss.unlocked ? 'border-gray-600 bg-gray-800/30' : ''}
              `}
              onClick={() => isClickable && onSelectBoss(boss)}
            >
              <div className="flex items-start gap-4">
                {/* Boss图标 */}
                <div className={`
                  w-16 h-16 rounded-lg flex items-center justify-center text-3xl border-2
                  ${boss.defeated ? 'border-pixel-primary bg-pixel-primary/20' : ''}
                  ${boss.unlocked && !boss.defeated ? 'border-pixel-danger bg-pixel-danger/20' : ''}
                  ${!boss.unlocked ? 'border-gray-600 bg-gray-700' : ''}
                `}>
                  {boss.icon}
                </div>

                {/* Boss信息 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-pixel text-sm text-white">{boss.name}</h4>
                    <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                      {status.icon}
                      {status.text}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-mono mb-2">{boss.description}</p>

                  {/* 挑战信息 */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-pixel-secondary">
                      挑战: {boss.challenge.description}
                    </span>
                  </div>

                  {/* 奖励 */}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-pixel-primary">+{boss.rewards.exp} XP</span>
                    <span className="text-pixel-accent">+{boss.rewards.coins} 🪙</span>
                  </div>
                </div>

                {/* 难度标识 */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-mono">难度</span>
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded-sm ${
                          i < boss.difficulty ? 'bg-pixel-danger' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PixelPanel>
  );
};
