import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MentorAvatar } from './MentorAvatar';
import { PixelButton } from '../ui/PixelButton';
import { useMentorStore } from '../../stores';

interface MentorButtonProps {
  className?: string;
}

export const MentorButton: React.FC<MentorButtonProps> = ({ className = '' }) => {
  const { isOpen, setIsOpen, freeCallsLeft, resetDailyFreeCalls } = useMentorStore();

  // 每日重置免费次数
  useEffect(() => {
    resetDailyFreeCalls();
  }, [resetDailyFreeCalls]);

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <PixelButton
        variant="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3"
      >
        <MentorAvatar size="sm" />
        {freeCallsLeft > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 bg-pixel-accent text-xs px-1 rounded-full"
          >
            <Sparkles size={10} />
          </motion.div>
        )}
      </PixelButton>
    </motion.div>
  );
};
