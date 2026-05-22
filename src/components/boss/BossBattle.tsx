import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useCharacterStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { Timer, Target, Sword, X, Trophy, Skull } from 'lucide-react';
import type { Boss, BossBattle as BossBattleType } from '../../types';

interface BossBattleComponentProps {
  boss: Boss;
  onClose: () => void;
  onVictory: (battle: BossBattleType) => void;
  onDefeat: () => void;
}

export const BossBattleComponent: React.FC<BossBattleComponentProps> = ({
  boss,
  onClose,
  onVictory,
  onDefeat,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [battle, setBattle] = useState<BossBattleType | null>(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [showResult, setShowResult] = useState<'won' | 'lost' | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { startBossBattle, endBossBattle, updateBossBattle, addCoins, addWritingHistory } = useGameStore();
  const { addExp, addWords, character } = useCharacterStore();

  // 开始战斗
  const handleStartBattle = () => {
    if (startBossBattle(boss.id)) {
      setIsActive(true);
      const newBattle: BossBattleType = {
        bossId: boss.id,
        startTime: Date.now(),
        endTime: null,
        wordCount: 0,
        timeRemaining: boss.challenge.timeLimit,
        status: 'active',
      };
      setBattle(newBattle);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  // 计时器
  useEffect(() => {
    if (isActive && battle) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - battle.startTime) / 1000);
        const remaining = Math.max(0, boss.challenge.timeLimit - elapsed);
        
        setBattle((prev) => (prev ? { ...prev, timeRemaining: remaining } : null));

        // 检查时间是否用完
        if (remaining === 0) {
          handleEndBattle('lost');
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, battle?.startTime]);

  // 检查胜利条件
  useEffect(() => {
    if (isActive && boss.challenge.wordCount && wordCount >= boss.challenge.wordCount) {
      handleEndBattle('won');
    }
  }, [wordCount, isActive]);

  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // 计算字数
    const words = newContent.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
    
    if (battle) {
      updateBossBattle(words);
    }
  };

  // 结束战斗
  const handleEndBattle = (status: 'won' | 'lost') => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const endedBattle = endBossBattle(status);
    setShowResult(status);

    if (status === 'won' && endedBattle && character) {
      // 发放奖励
      addCoins(boss.rewards.coins);
      addExp(boss.rewards.exp);
      addWords(wordCount);
      
      // 记录历史
      const writingTime = Math.floor((Date.now() - endedBattle.startTime) / 60000);
      addWritingHistory(wordCount, writingTime);
      
      onVictory(endedBattle);
    } else if (status === 'lost') {
      onDefeat();
    }
  };

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度
  const progressPercent = boss.challenge.wordCount 
    ? Math.min(100, (wordCount / boss.challenge.wordCount) * 100) 
    : 0;
  const timePercent = battle ? (battle.timeRemaining / boss.challenge.timeLimit) * 100 : 100;

  if (showResult) {
    return (
      <PixelPanel className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-12"
          >
            {showResult === 'won' ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 bg-pixel-primary rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-pixel-border"
                >
                  <Trophy size={48} className="text-pixel-border" />
                </motion.div>
                <h3 className="font-pixel text-2xl text-pixel-primary mb-4">胜利!</h3>
                <p className="text-gray-400 font-mono mb-6">
                  你成功击败了 {boss.name}!
                </p>
                <div className="flex justify-center gap-4 mb-6">
                  <div className="bg-pixel-bg/50 px-4 py-2 rounded border-2 border-pixel-border">
                    <span className="text-pixel-primary font-pixel">+{boss.rewards.exp} XP</span>
                  </div>
                  <div className="bg-pixel-bg/50 px-4 py-2 rounded border-2 border-pixel-border">
                    <span className="text-pixel-accent font-pixel">+{boss.rewards.coins} 🪙</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 bg-pixel-danger rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-pixel-border"
                >
                  <Skull size={48} className="text-white" />
                </motion.div>
                <h3 className="font-pixel text-2xl text-pixel-danger mb-4">失败!</h3>
                <p className="text-gray-400 font-mono mb-6">
                  时间耗尽，{boss.name} 逃走了...
                </p>
                <p className="text-sm text-gray-500 font-mono">
                  已完成: {wordCount} / {boss.challenge.wordCount} 字
                </p>
              </>
            )}

            <PixelButton variant="primary" onClick={onClose} className="mt-8">
              继续
            </PixelButton>
          </motion.div>
        </AnimatePresence>
      </PixelPanel>
    );
  }

  return (
    <PixelPanel className="relative">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        disabled={isActive}
      >
        <X size={24} />
      </button>

      {!isActive ? (
        // 准备界面
        <div className="text-center py-8">
          <div className="text-6xl mb-4">{boss.icon}</div>
          <h3 className="font-pixel text-xl text-white mb-2">{boss.name}</h3>
          <p className="text-gray-400 font-mono mb-6">{boss.description}</p>

          <div className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border mb-6">
            <h4 className="font-pixel text-sm text-pixel-accent mb-3">挑战目标</h4>
            <div className="flex justify-center gap-6 text-sm font-mono">
              <span className="flex items-center gap-2">
                <Target size={16} className="text-pixel-secondary" />
                {boss.challenge.wordCount} 字
              </span>
              <span className="flex items-center gap-2">
                <Timer size={16} className="text-pixel-danger" />
                {formatTime(boss.challenge.timeLimit)}
              </span>
            </div>
          </div>

          <PixelButton variant="danger" size="lg" onClick={handleStartBattle}>
            <span className="flex items-center gap-2">
              <Sword size={20} />
              开始挑战
            </span>
          </PixelButton>
        </div>
      ) : (
        // 战斗界面
        <div className="space-y-4">
          {/* 状态栏 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{boss.icon}</span>
              <div>
                <h4 className="font-pixel text-sm text-white">{boss.name}</h4>
                <p className="text-xs text-gray-500 font-mono">Boss战进行中...</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-pixel text-lg ${timePercent < 30 ? 'text-pixel-danger' : 'text-white'}`}>
                <Timer size={16} className="inline mr-1" />
                {battle ? formatTime(battle.timeRemaining) : '00:00'}
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">进度</span>
              <span className="text-white">{wordCount} / {boss.challenge.wordCount} 字</span>
            </div>
            <div className="h-4 bg-pixel-border rounded-full overflow-hidden border-2 border-pixel-border">
              <motion.div
                className="h-full bg-gradient-to-r from-pixel-primary to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* 时间条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-400">剩余时间</span>
              <span className={timePercent < 30 ? 'text-pixel-danger' : 'text-white'}>
                {Math.round(timePercent)}%
              </span>
            </div>
            <div className="h-2 bg-pixel-border rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${timePercent < 30 ? 'bg-pixel-danger' : 'bg-pixel-secondary'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${timePercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* 编辑器 */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="快速写作，击败Boss！"
              className="w-full h-48 bg-pixel-bg border-2 border-pixel-border p-4 text-white font-mono text-base leading-relaxed resize-none focus:outline-none focus:border-pixel-danger placeholder-gray-600"
            />
          </div>

          {/* 放弃按钮 */}
          <div className="flex justify-end">
            <PixelButton variant="secondary" size="sm" onClick={() => handleEndBattle('lost')}>
              放弃挑战
            </PixelButton>
          </div>
        </div>
      )}
    </PixelPanel>
  );
};
