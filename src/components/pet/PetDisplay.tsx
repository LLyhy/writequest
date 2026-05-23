import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '../../stores';
import { PetAvatar } from './PetAvatar';
import { Sparkles, Heart } from 'lucide-react';

interface PetDisplayProps {
  className?: string;
}

const TIPS = [
  '写作累了就休息一下吧！',
  '坚持就是胜利！',
  '你写得越来越好了！',
  '灵感就在下一秒！',
  '加油！你可以的！',
  '休息是为了更好地出发！',
];

export const PetDisplay: React.FC<PetDisplayProps> = ({ className = '' }) => {
  const { getEquippedPet, interactWithPet } = usePetStore();
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const equippedPet = getEquippedPet();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
        setCurrentTip(tip);
        setShowTip(true);
        setTimeout(() => setShowTip(false), 4000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handlePetClick = () => {
    if (equippedPet) {
      setIsAnimating(true);
      interactWithPet(equippedPet.id, 'play');
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  if (!equippedPet) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 z-40 ${className}`}
    >
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full right-0 mb-3 bg-pixel-panel border-2 border-pixel-border p-3 rounded-lg max-w-[200px] text-gray-300 text-sm font-mono"
          >
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-pixel-accent shrink-0" />
              <span>{currentTip}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={isAnimating ? {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ duration: 0.5 }}
        onClick={handlePetClick}
        className="cursor-pointer"
      >
        <div className="relative">
          <PetAvatar type={equippedPet.type} size="lg" />
          
          {equippedPet.happiness >= 80 && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 text-pixel-accent"
            >
              <Heart size={16} fill="currentColor" />
            </motion.div>
          )}
        </div>

        <div className="mt-2 text-center">
          <div className="text-xs text-gray-400 font-mono">
            {equippedPet.name}
          </div>
          <div className="text-xs text-pixel-primary font-mono">
            Lv.{equippedPet.level}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
