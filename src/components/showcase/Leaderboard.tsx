import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, User, BookOpen, Heart, Eye } from 'lucide-react';
import { PixelPanel } from '../ui';
import type { PublishedWork, UserProfile } from '../../types/showcase';

interface LeaderboardProps {
  topWorks: Array<PublishedWork & { score: number }>;
  topAuthors: Array<UserProfile & { score: number }>;
  onWorkClick?: (work: PublishedWork) => void;
  onAuthorClick?: (author: UserProfile) => void;
}

const RankIcon = ({ rank }: { rank: number }) => {
  const colors = ['text-yellow-400', 'text-gray-300', 'text-orange-600'];
  const sizes = [24, 20, 18];
  
  if (rank <= 3) {
    return (
      <Trophy
        size={sizes[rank - 1]}
        className={colors[rank - 1]}
      />
    );
  }
  
  return (
    <span className="font-pixel text-gray-500 text-lg">{rank}</span>
  );
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  topWorks,
  topAuthors,
  onWorkClick,
  onAuthorClick,
}) => {
  const [activeTab, setActiveTab] = useState<'works' | 'authors'>('works');

  const tabs = [
    { id: 'works', label: '作品热度榜', icon: <TrendingUp size={18} /> },
    { id: 'authors', label: '作者影响力榜', icon: <User size={18} /> },
  ] as const;

  return (
    <div className="space-y-6">
      <PixelPanel className="p-2">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-pixel text-sm rounded transition-all ${
                activeTab === tab.id
                  ? 'bg-pixel-accent text-white'
                  : 'text-gray-400 hover:text-white hover:bg-pixel-border/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </PixelPanel>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <PixelPanel className="p-4">
            {activeTab === 'works' ? (
              <div className="space-y-3">
                {topWorks.slice(0, 10).map((work, index) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 hover:bg-pixel-border/10 rounded cursor-pointer transition-colors"
                    onClick={() => onWorkClick?.(work)}
                  >
                    <div className="w-10 flex items-center justify-center shrink-0">
                      <RankIcon rank={index + 1} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-pixel text-white text-sm mb-1 truncate">
                        {work.title}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {work.authorDisplayName || work.authorName}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1 text-pixel-accent">
                        <Heart size={14} />
                        <span className="font-pixel text-xs">{work.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Eye size={14} />
                        <span className="font-pixel text-xs">{work.views}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {topWorks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-4xl mb-4">🏆</div>
                    <p className="text-gray-400 font-pixel text-sm">暂无作品</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {topAuthors.slice(0, 10).map((author, index) => (
                  <motion.div
                    key={author.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 hover:bg-pixel-border/10 rounded cursor-pointer transition-colors"
                    onClick={() => onAuthorClick?.(author)}
                  >
                    <div className="w-10 flex items-center justify-center shrink-0">
                      <RankIcon rank={index + 1} />
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 border-2 border-pixel-border">
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          alt={author.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-pixel text-white text-sm mb-1 truncate">
                        {author.displayName}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {author.characterClass || '冒险者'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1 text-pixel-accent">
                        <BookOpen size={14} />
                        <span className="font-pixel text-xs">{author.totalWorks}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Heart size={14} />
                        <span className="font-pixel text-xs">{author.totalLikes}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {topAuthors.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-4xl mb-4">🏆</div>
                    <p className="text-gray-400 font-pixel text-sm">暂无作者</p>
                  </div>
                )}
              </div>
            )}
          </PixelPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
