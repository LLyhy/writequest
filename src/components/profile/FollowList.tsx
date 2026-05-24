import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, X, Users } from 'lucide-react';
import { PixelButton, PixelPanel } from '../ui';
import { FollowButton } from './FollowButton';
import type { UserProfile as UserProfileType } from '../../types/showcase';

interface FollowListProps {
  title: string;
  users: UserProfileType[];
  currentUserId: string;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  onUserClick?: (userId: string) => void;
  onClose: () => void;
}

export const FollowList: React.FC<FollowListProps> = ({
  title,
  users,
  currentUserId,
  onFollow,
  onUnfollow,
  isFollowing,
  onUserClick,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <PixelPanel
        className="max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-pixel-border">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-pixel-accent" />
            <h2 className="font-pixel text-white text-lg">{title}</h2>
            <span className="text-gray-400 text-sm">({users.length})</span>
          </div>
          <PixelButton variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </PixelButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-4xl mb-4">👥</div>
              <p className="text-gray-400 font-pixel text-sm">暂无用户</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between gap-4 p-3 rounded-lg bg-pixel-border/20 hover:bg-pixel-border/30 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onUserClick?.(user.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-pixel text-white text-sm truncate">
                        {user.displayName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {user.characterClass || '冒险者'}
                      </p>
                    </div>
                  </div>

                  {user.id !== currentUserId && (
                    <FollowButton
                      isFollowing={isFollowing(user.id)}
                      onFollow={() => onFollow(user.id)}
                      onUnfollow={() => onUnfollow(user.id)}
                      size="sm"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PixelPanel>
    </motion.div>
  );
};
