import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'danger';
  showSuffix?: boolean;
}

const colorStyles = {
  primary: 'border-pixel-primary/30 bg-pixel-primary/10',
  secondary: 'border-pixel-secondary/30 bg-pixel-secondary/10',
  accent: 'border-pixel-accent/30 bg-pixel-accent/10',
  danger: 'border-pixel-danger/30 bg-pixel-danger/10',
};

const iconColors = {
  primary: 'text-pixel-primary',
  secondary: 'text-pixel-secondary',
  accent: 'text-pixel-accent',
  danger: 'text-pixel-danger',
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subValue,
  color = 'primary',
}) => {
  return (
    <motion.div
      className={`pixel-panel p-3 border-2 ${colorStyles[color]}`}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="flex items-start gap-3">
        <div className={`${iconColors[color]} mt-1`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-mono mb-1">{label}</p>
          <p className="font-pixel text-lg text-white truncate">{value}</p>
          {subValue && (
            <p className="text-xs text-gray-500 font-mono mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
