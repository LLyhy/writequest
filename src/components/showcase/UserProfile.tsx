import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, PenTool, Calendar, Users, Heart, BookOpen, Edit } from 'lucide-react';
import { PixelPanel, StatCard } from '../ui';
import { WorkCard } from './WorkCard';
import { FollowButton, FollowList } from '../profile';
import type { UserProfile as UserProfileType, PublishedWork } from '../../types/showcase';

interface UserProfileProps {
  profile: UserProfileType;
  isOwnProfile: boolean;
  works: PublishedWork[];
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  onEditProfile?: () => void;
  isFollowing?: boolean;
  getFollowers?: (userId: string) => UserProfileType[];
  getFollowing?: (userId: string) => UserProfileType[];
  currentUserId?: string;
  onUserClick?: (userId: string) => void;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  isOwnProfile,
  works,
  onFollow,
  onUnfollow,
  onEditProfile,
  isFollowing = false,
  getFollowers,
  getFollowing,
  currentUserId,
  onUserClick,
}) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const followers = getFollowers ? getFollowers(profile.id) : [];
  const following = getFollowing ? getFollowing(profile.id) : [];

  const handleFollowClick = () => {
    onFollow?.(profile.id);
  };

  const handleUnfollowClick = () => {
    onUnfollow?.(profile.id);
  };

  return (
    <div className="space-y-6">
      <PixelPanel className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="shrink-0"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-pixel-border">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-pixel text-white text-xl mb-1">{profile.displayName}</h1>
                <p className="text-pixel-accent font-pixel text-sm mb-2">
                  {profile.characterClass || '冒险者'} · {profile.characterName}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              </div>
              <div className="shrink-0">
                {isOwnProfile ? (
                  <button
                    onClick={onEditProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-pixel-accent hover:bg-pixel-accent/80 text-white text-xs font-pixel rounded transition-colors"
                  >
                    <Edit size={16} />
                    编辑资料
                  </button>
                ) : (
                  <FollowButton
                    isFollowing={isFollowing}
                    onFollow={handleFollowClick}
                    onUnfollow={handleUnfollowClick}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Calendar size={14} />
              <span>加入于 {formatDate(profile.joinedAt || profile.createdAt || Date.now())}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                value={profile.totalWorks}
                label="作品"
                icon={<BookOpen size={16} />}
              />
              <StatCard
                value={profile.totalWords}
                label="总字数"
                icon={<PenTool size={16} />}
                showSuffix
              />
              <StatCard
                value={profile.followers.length}
                label="粉丝"
                icon={<Users size={16} />}
                onClick={getFollowers ? () => setShowFollowers(true) : undefined}
                className={getFollowers ? 'cursor-pointer' : ''}
              />
              <StatCard
                value={profile.following.length}
                label="关注"
                icon={<Users size={16} />}
                onClick={getFollowing ? () => setShowFollowing(true) : undefined}
                className={getFollowing ? 'cursor-pointer' : ''}
              />
            </div>
          </div>
        </div>
      </PixelPanel>

      {showFollowers && getFollowers && currentUserId && (
        <FollowList
          title="粉丝列表"
          users={followers}
          currentUserId={currentUserId}
          onFollow={onFollow || (() => {})}
          onUnfollow={onUnfollow || (() => {})}
          isFollowing={(userId) => following.some(u => u.id === userId)}
          onUserClick={onUserClick}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && getFollowing && currentUserId && (
        <FollowList
          title="关注列表"
          users={following}
          currentUserId={currentUserId}
          onFollow={onFollow || (() => {})}
          onUnfollow={onUnfollow || (() => {})}
          isFollowing={(userId) => following.some(u => u.id === userId)}
          onUserClick={onUserClick}
          onClose={() => setShowFollowing(false)}
        />
      )}

      {works.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-pixel text-white text-lg">作品列表</h2>
            <span className="text-gray-500 text-sm">({works.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      )}

      {works.length === 0 && (
        <PixelPanel className="p-8 text-center">
          <div className="text-gray-500 text-4xl mb-4">📚</div>
          <p className="text-gray-400 font-pixel text-sm">
            {isOwnProfile ? '还没有发布任何作品' : '暂无作品'}
          </p>
        </PixelPanel>
      )}
    </div>
  );
};
