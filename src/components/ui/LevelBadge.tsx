import React from 'react';
import { motion } from 'framer-motion';
import { getLevelConfig } from '../../constants/game';

interface LevelBadgeProps {
  level: number;
  showTitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { badge: 'w-6 h-6 text-xs', title: 'text-xs' },
  md: { badge: 'w-8 h-8 text-xs', title: 'text-sm' },
  lg: { badge: 'w-10 h-10 text-sm', title: 'text-base' },
};

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  showTitle = false,
  size = 'md',
}) => {
  const levelConfig = getLevelConfig(level);

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`level-badge ${sizeStyles[size].badge}`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {level}
      </motion.div>
      {showTitle && (
        <span className={`font-pixel ${sizeStyles[size].title} text-pixel-secondary`}>
          {levelConfig.title}
        </span>
      )}
    </div>
  );
};
