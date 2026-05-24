import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useShowcaseStore, useUserProfileStore, useCharacterStore } from '../stores';
import { UserProfile } from '../components/showcase';
import { PixelButton } from '../components/ui';

interface ProfilePageProps {
  onBack: () => void;
  userId?: string;
}

export function ProfilePage({ onBack, userId }: ProfilePageProps) {
  const {
    currentUser,
    createProfile,
    followUser,
    unfollowUser,
    isFollowing,
    getProfile,
    getFollowers,
    getFollowing,
  } = useUserProfileStore();
  const { getWorksByAuthor } = useShowcaseStore();
  const character = useCharacterStore((state) => state.character);

  // 如果没有当前用户，并且有角色信息，创建一个用户资料
  useEffect(() => {
    if (!currentUser && character) {
      const newProfile = {
        id: character.id,
        displayName: character.name,
        characterName: character.name,
        bio: '这是一位勇敢的冒险者，正在写作的道路上不断前进！',
        characterClass: character.class,
        followers: [],
        following: [],
        totalLikes: 0,
        totalWorks: 0,
        totalWords: character.totalWords,
        joinedAt: Date.now(),
      };
      createProfile(newProfile);
    }
  }, [currentUser, character, createProfile]);

  // 确定要显示的用户
  const targetUser = userId
    ? getProfile(userId) || currentUser
    : currentUser;

  const isOwnProfile = !userId || userId === currentUser?.id;
  const userWorks = targetUser ? getWorksByAuthor(targetUser.id) : [];
  const following = isFollowing(targetUser?.id || '');

  if (!targetUser) {
    return (
      <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-pixel text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pixel-bg">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <PixelButton variant="secondary" size="md" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            返回
          </PixelButton>
          <div>
            <h1 className="font-pixel text-white text-xl">
              {isOwnProfile ? '我的主页' : '用户主页'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isOwnProfile ? '查看和管理你的个人信息' : '查看用户的作品和资料'}
            </p>
          </div>
        </div>

        <UserProfile
          profile={targetUser}
          isOwnProfile={isOwnProfile}
          works={userWorks}
          onFollow={followUser}
          onUnfollow={unfollowUser}
          isFollowing={following}
          getFollowers={getFollowers}
          getFollowing={getFollowing}
          currentUserId={currentUser?.id}
          onEditProfile={() => {
            // 编辑资料功能可以在这里扩展
            console.log('Edit profile');
          }}
        />
      </div>
    </div>
  );
}
