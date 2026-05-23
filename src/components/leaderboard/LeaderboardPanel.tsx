import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, TrendingUp, Calendar, Swords, Zap } from 'lucide-react';
import { useLeaderboardStore, type LeaderboardEntry } from '../../stores';
import { PixelButton } from '../ui/PixelButton';
import { PixelPanel as _PixelPanel } from '../ui/PixelPanel';

interface LeaderboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-gray-400';
};

const getRankBadge = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'wordsWritten':
      return { icon: TrendingUp, label: '字数', unit: '字' };
    case 'daysStreak':
      return { icon: Calendar, label: '连续天数', unit: '天' };
    case 'monstersDefeated':
      return { icon: Swords, label: '击败怪物', unit: '只' };
    default:
      return { icon: TrendingUp, label: '', unit: '' };
  }
};

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry; unit: string; isPlayer: boolean }> = ({
  entry,
  unit,
  isPlayer,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
        isPlayer ? 'bg-pixel-primary/10 border border-pixel-primary/30' : 'bg-pixel-bg border border-pixel-border'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-pixel text-lg ${getRankColor(entry.rank)}`}>
        {getRankBadge(entry.rank)}
      </div>
      
      <div className="flex-1">
        <div className="font-mono text-sm">
          {entry.name}
        </div>
      </div>

      <div className="font-mono text-pixel-accent font-bold">
        {entry.value.toLocaleString()} <span className="text-gray-500 font-normal">{unit}</span>
      </div>
    </motion.div>
  );
};

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    weeklyData,
    selectedCategory,
    checkWeekReset,
    generateMockLeaderboard,
  } = useLeaderboardStore();

  useEffect(() => {
    if (isOpen) {
      checkWeekReset();
      if (weeklyData.entries.wordsWritten.length === 0) {
        generateMockLeaderboard();
      }
    }
  }, [isOpen, checkWeekReset, generateMockLeaderboard, weeklyData.entries.wordsWritten.length]);

  if (!isOpen) return null;

  const categoryInfo = getCategoryIcon(selectedCategory);
  const entries = weeklyData.entries[selectedCategory];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-md"
          >
            <_PixelPanel className="max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-pixel-border">
                <div>
                  <h2 className="font-pixel text-white text-xl flex items-center gap-2">
                    <Trophy size={20} className="text-pixel-accent" />
                    每周排行榜
                  </h2>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    每周一凌晨重置
                  </p>
                </div>
                <PixelButton variant="secondary" size="sm" onClick={onClose}>
                  <X size={18} />
                </PixelButton>
              </div>

              <div className="flex gap-2 mb-4">
                {(['wordsWritten', 'daysStreak', 'monstersDefeated'].map((cat) => {
                  const info = getCategoryIcon(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => useLeaderboardStore.setState({ selectedCategory: cat as any })}
                      className={`flex-1 py-2 px-3 rounded-lg font-mono text-xs transition-all ${
                        selectedCategory === cat
                          ? 'bg-pixel-primary text-white'
                          : 'bg-pixel-bg border border-pixel-border text-gray-400 hover:border-pixel-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <info.icon size={12} />
                        {info.label}
                      </div>
                    </button>
                  );
                }))}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {entries.map((entry) => (
                  <LeaderboardRow
                    key={entry.id}
                    entry={entry}
                    unit={categoryInfo.unit}
                    isPlayer={entry.id === 'player'}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t-2 border-pixel-border">
                <div className="bg-pixel-bg border border-pixel-border p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-pixel-accent">
                    <Zap size={14} />
                    <span className="text-xs font-mono">你的本周成绩</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-xs font-mono text-gray-400">
                    <div>字数: {weeklyData.personalBest.wordsWritten}</div>
                    <div>连续: {weeklyData.personalBest.daysStreak}</div>
                    <div>怪物: {weeklyData.personalBest.monstersDefeated}</div>
                  </div>
                </div>
              </div>
            </_PixelPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
