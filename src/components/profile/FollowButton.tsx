import React from 'react';
import { Users } from 'lucide-react';
import { PixelButton } from '../ui';

interface FollowButtonProps {
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing,
  onFollow,
  onUnfollow,
  size = 'md',
}) => {
  return (
    <PixelButton
      variant={isFollowing ? 'secondary' : 'primary'}
      size={size}
      onClick={isFollowing ? onUnfollow : onFollow}
      className="flex items-center gap-2"
    >
      <Users size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      {isFollowing ? '已关注' : '关注'}
    </PixelButton>
  );
};
