import React from 'react';
import { motion } from 'framer-motion';
import { getLevelConfig, getExpForNextLevel, getLevelProgress } from '../../constants/game';

interface XPBarProps {
  level: number;
  exp: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { bar: 'h-2', text: 'text-xs' },
  md: { bar: 'h-4', text: 'text-sm' },
  lg: { bar: 'h-6', text: 'text-base' },
};

export const XPBar: React.FC<XPBarProps> = ({
  level,
  exp,
  showText = true,
  size = 'md',
}) => {
  const levelConfig = getLevelConfig(level);
  const nextLevelExp = getExpForNextLevel(level);
  const progress = getLevelProgress(exp, level);
  const currentLevelExp = exp - levelConfig.expRequired;
  const expNeeded = nextLevelExp - levelConfig.expRequired;

  return (
    <div className="w-full">
      {showText && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="level-badge">{level}</span>
            <span className={`font-pixel ${sizeStyles[size].text} text-pixel-primary`}>
              {levelConfig.title}
            </span>
          </div>
          <span className={`font-mono ${sizeStyles[size].text} text-gray-400`}>
            {currentLevelExp} / {expNeeded} XP
          </span>
        </div>
      )}
      <div className={`xp-bar ${sizeStyles[size].bar}`}>
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
