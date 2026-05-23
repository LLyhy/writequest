import React from 'react';
import { motion } from 'framer-motion';
import { type PetType } from '../../stores';

interface PetAvatarProps {
  type: PetType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PET_EMOJIS: Record<PetType, string> = {
  dragon: '🐉',
  cat: '🐱',
  owl: '🦉',
  fox: '🦊',
  wolf: '🐺',
};

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-8 h-8 text-xl',
  md: 'w-12 h-12 text-3xl',
  lg: 'w-16 h-16 text-5xl',
};

export const PetAvatar: React.FC<PetAvatarProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`flex items-center justify-center rounded-full bg-pixel-primary border-2 border-pixel-border ${SIZE_CLASSES[size]} ${className}`}
    >
      <span>{PET_EMOJIS[type]}</span>
    </motion.div>
  );
};
