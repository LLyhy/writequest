import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface MentorAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MentorAvatar: React.FC<MentorAvatarProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`${sizeClasses[size]} ${className} relative`}
    >
      <div className="w-full h-full bg-pixel-primary border-3 border-pixel-border rounded-full flex items-center justify-center shadow-pixel">
        <span className="text-white font-bold font-pixel">
          老
        </span>
      </div>
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 -right-1 w-3 h-3 bg-pixel-accent rounded-full"
      />
    </motion.div>
  );
};
