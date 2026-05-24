import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, Calendar, User } from 'lucide-react';
import { PixelPanel } from '../ui';
import { LikeButton } from './LikeButton';
import type { PublishedWork } from '../../types/showcase';

interface WorkCardProps {
  work: PublishedWork;
  onClick?: (work: PublishedWork) => void;
}

const gradientColors = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
];

const getGradient = (id: string) => {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradientColors.length;
  return gradientColors[index];
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
};

export const WorkCard: React.FC<WorkCardProps> = ({ work, onClick }) => {
  const gradient = getGradient(work.id);
  const initial = work.title.charAt(0).toUpperCase();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(work)}
      className="cursor-pointer"
    >
      <PixelPanel className="h-full overflow-hidden">
        <div className="flex flex-col h-full">
          <div className={`bg-gradient-to-br ${gradient} h-32 flex items-center justify-center relative`}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-5xl font-pixel text-white drop-shadow-lg"
            >
              {initial}
            </motion.div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3">
              <h3 className="font-pixel text-white text-sm mb-2 line-clamp-2">{work.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <User size={14} />
                <span className="truncate">{work.authorDisplayName || work.authorName}</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 line-clamp-3 mb-4 flex-1">
              {work.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <LikeButton workId={work.id} size={14} />
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageCircle size={14} />
                    <span>{work.comments.length}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye size={14} />
                    <span>{work.views}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar size={14} />
                  <span>{formatDate(work.createdAt)}</span>
                </div>
              </div>

              {work.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.slice(0, 3).map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-2 py-0.5 bg-pixel-border/30 text-xs text-gray-300 rounded"
                    >
                      {tag}
                    </motion.span>
                  ))}
                  {work.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{work.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </PixelPanel>
    </motion.div>
  );
};
