import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useShowcaseStore } from '../../stores/showcaseStore';

interface LikeButtonProps {
  workId: string;
  size?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ 
  workId, 
  size = 16
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { isWorkLiked, toggleLike, publishedWorks } = useShowcaseStore();
  
  const isLiked = isWorkLiked(workId);
  const currentLikes = useMemo(() => {
    const work = publishedWorks.find(w => w.id === workId);
    return work?.likes ?? 0;
  }, [publishedWorks, workId]);
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    
    await toggleLike(workId);
    
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1.5 transition-colors hover:opacity-80 focus:outline-none"
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 0.9, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Heart
          size={size}
          fill={isLiked ? '#ec4899' : 'none'}
          className={isLiked ? 'text-pink-500' : 'text-pixel-accent'}
        />
      </motion.div>
      <span className={`text-xs ${isLiked ? 'text-pink-500' : 'text-pixel-accent'}`}>
        {currentLikes}
      </span>
    </button>
  );
};
