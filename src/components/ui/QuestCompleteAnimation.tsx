import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coins, Star } from 'lucide-react';

interface QuestCompleteAnimationProps {
  isVisible: boolean;
  exp: number;
  coins: number;
  onComplete: () => void;
}

export const QuestCompleteAnimation: React.FC<QuestCompleteAnimationProps> = ({
  isVisible,
  exp,
  coins,
  onComplete,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          {/* 背景粒子效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-pixel-accent rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 10,
                  opacity: 1,
                }}
                animate={{
                  y: -10,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* 主内容 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative bg-pixel-panel border-4 border-pixel-accent p-8 rounded-lg shadow-pixel max-w-sm w-full mx-4"
          >
            {/* 闪光效果 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1,
                repeat: 2,
                ease: 'linear',
              }}
            />

            {/* 图标 */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-pixel-accent rounded-full flex items-center justify-center border-4 border-pixel-border">
                <Sparkles size={40} className="text-pixel-border" />
              </div>
            </motion.div>

            {/* 标题 */}
            <motion.h3
              className="font-pixel text-xl text-center text-pixel-accent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              任务完成!
            </motion.h3>

            {/* 奖励 */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center gap-3 bg-pixel-bg/50 p-3 rounded border-2 border-pixel-border"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
              >
                <Star size={24} className="text-pixel-primary" />
                <span className="font-pixel text-lg text-white">+{exp} XP</span>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-3 bg-pixel-bg/50 p-3 rounded border-2 border-pixel-border"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
              >
                <Coins size={24} className="text-pixel-accent" />
                <span className="font-pixel text-lg text-white">+{coins} 🪙</span>
              </motion.div>
            </motion.div>

            {/* 提示文字 */}
            <motion.p
              className="text-center text-xs text-gray-500 font-mono mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              继续保持!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
