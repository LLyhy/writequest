# WriteQuest 作品展示与分享系统 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 WriteQuest 添加完整的作品展示和分享功能，包括作品广场、发布系统、用户主页、互动系统和排行榜

**Architecture:** 采用渐进式架构，先使用 localStorage 存储数据，使用 Zustand 进行状态管理，新增独立的 showcase 组件模块

**Tech Stack:** React 18, TypeScript, Zustand, Tailwind CSS, Framer Motion

---

## 文件结构

| 操作 | 文件路径 | 说明 |
|------|---------|------|
| 创建 | `src/types/showcase.ts` | 作品展示系统类型定义 |
| 创建 | `src/stores/showcaseStore.ts` | 作品展示状态管理 |
| 创建 | `src/stores/userProfileStore.ts` | 用户资料状态管理 |
| 创建 | `src/components/showcase/WorkCard.tsx` | 作品卡片组件 |
| 创建 | `src/components/showcase/WorkDetail.tsx` | 作品详情组件 |
| 创建 | `src/components/showcase/PublishModal.tsx` | 发布弹窗组件 |
| 创建 | `src/components/showcase/DraftBox.tsx` | 草稿箱组件 |
| 创建 | `src/components/showcase/UserProfile.tsx` | 用户主页组件 |
| 创建 | `src/components/showcase/Leaderboard.tsx` | 排行榜组件 |
| 创建 | `src/components/showcase/index.ts` | 组件导出文件 |
| 创建 | `src/pages/ShowcasePage.tsx` | 作品广场页面 |
| 创建 | `src/pages/ProfilePage.tsx` | 用户主页页面 |
| 修改 | `src/types/index.ts` | 导出新的类型 |
| 修改 | `src/stores/index.ts` | 导出新的 stores |
| 修改 | `src/App.tsx` | 集成新功能和页面路由 |
| 修改 | `src/components/editor/WritingEditor.tsx` | 增加发布按钮 |

---

## Phase 1: 基础功能 - 数据结构和状态管理

### Task 1: 创建类型定义

**Files:**
- Create: `src/types/showcase.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
// src/types/showcase.ts

// 公开作品
export interface PublishedWork {
  id: string;
  authorId: string;
  authorName: string;
  authorDisplayName?: string;
  title: string;
  description: string;
  content: string;
  wordCount: number;
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  tags: string[];
  
  // 互动数据
  likes: number;
  likedBy: string[];
  comments: Comment[];
  favorites: number;
  favoritedBy: string[];
  views: number;
}

// 评论
export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

// 用户资料
export interface UserProfile {
  id: string;
  displayName: string;
  characterName: string;
  bio: string;
  avatar?: string;
  characterClass?: string;
  
  // 社交数据
  followers: string[];
  following: string[];
  
  // 统计数据
  totalLikes: number;
  totalWorks: number;
  totalWords: number;
  
  joinedAt: number;
}

// 草稿
export interface DraftWork {
  id: string;
  title?: string;
  description?: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// 作品排序类型
export type WorkSortType = 'latest' | 'popular' | 'random' | 'wordCount';

// 排行榜类型
export type LeaderboardType = 'works' | 'authors';
```

- [ ] **Step 2: 更新 types/index.ts 导出新类型**

```typescript
// 在 src/types/index.ts 末尾添加
export * from './showcase';
```

- [ ] **Step 3: 检查类型定义是否正确**
- [ ] **Step 4: 提交**

```bash
git add src/types/showcase.ts src/types/index.ts
git commit -m "feat: add showcase system type definitions"
```

---

### Task 2: 创建作品展示状态管理

**Files:**
- Create: `src/stores/showcaseStore.ts`
- Modify: `src/stores/index.ts`

- [ ] **Step 1: 创建 showcaseStore**

```typescript
// src/stores/showcaseStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PublishedWork, WorkSortType, DraftWork, Comment } from '../types';

interface ShowcaseStore {
  // 数据
  publishedWorks: PublishedWork[];
  drafts: DraftWork[];
  currentWork: PublishedWork | null;
  
  // 筛选和排序
  sortType: WorkSortType;
  selectedTags: string[];
  
  // Actions
  setSortType: (type: WorkSortType) => void;
  setSelectedTags: (tags: string[]) => void;
  
  // 作品操作
  publishWork: (work: Omit<PublishedWork, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'favorites' | 'views' | 'likedBy' | 'favoritedBy'>) => void;
  updateWork: (id: string, updates: Partial<PublishedWork>) => void;
  deleteWork: (id: string) => void;
  getWorkById: (id: string) => PublishedWork | undefined;
  
  // 草稿操作
  saveDraft: (draft: Omit<DraftWork, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateDraft: (id: string, updates: Partial<DraftWork>) => void;
  deleteDraft: (id: string) => void;
  
  // 互动操作
  likeWork: (workId: string, userId: string) => void;
  unlikeWork: (workId: string, userId: string) => void;
  addComment: (workId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  favoriteWork: (workId: string, userId: string) => void;
  unfavoriteWork: (workId: string, userId: string) => void;
  incrementView: (workId: string) => void;
  
  // 派生数据
  getSortedWorks: () => PublishedWork[];
  getFilteredWorks: () => PublishedWork[];
}

export const useShowcaseStore = create<ShowcaseStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      publishedWorks: [],
      drafts: [],
      currentWork: null,
      sortType: 'latest',
      selectedTags: [],
      
      // Actions 实现
      setSortType: (type) => set({ sortType: type }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      
      publishWork: (work) => set((state) => ({
        publishedWorks: [
          ...state.publishedWorks,
          {
            ...work,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            likes: 0,
            likedBy: [],
            comments: [],
            favorites: 0,
            favoritedBy: [],
            views: 0
          }
        ]
      })),
      
      updateWork: (id, updates) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => 
          w.id === id ? { ...w, ...updates, updatedAt: Date.now() } : w
        )
      })),
      
      deleteWork: (id) => set((state) => ({
        publishedWorks: state.publishedWorks.filter(w => w.id !== id)
      })),
      
      getWorkById: (id) => get().publishedWorks.find(w => w.id === id),
      
      saveDraft: (draft) => {
        const id = crypto.randomUUID();
        set((state) => ({
          drafts: [
            ...state.drafts,
            {
              ...draft,
              id,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
          ]
        }));
        return id;
      },
      
      updateDraft: (id, updates) => set((state) => ({
        drafts: state.drafts.map(d => 
          d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d
        )
      })),
      
      deleteDraft: (id) => set((state) => ({
        drafts: state.drafts.filter(d => d.id !== id)
      })),
      
      likeWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && !w.likedBy.includes(userId)) {
            return {
              ...w,
              likes: w.likes + 1,
              likedBy: [...w.likedBy, userId]
            };
          }
          return w;
        })
      })),
      
      unlikeWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && w.likedBy.includes(userId)) {
            return {
              ...w,
              likes: w.likes - 1,
              likedBy: w.likedBy.filter(id => id !== userId)
            };
          }
          return w;
        })
      })),
      
      addComment: (workId, comment) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId) {
            return {
              ...w,
              comments: [
                ...w.comments,
                {
                  ...comment,
                  id: crypto.randomUUID(),
                  createdAt: Date.now()
                }
              ]
            };
          }
          return w;
        })
      })),
      
      favoriteWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && !w.favoritedBy.includes(userId)) {
            return {
              ...w,
              favorites: w.favorites + 1,
              favoritedBy: [...w.favoritedBy, userId]
            };
          }
          return w;
        })
      })),
      
      unfavoriteWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && w.favoritedBy.includes(userId)) {
            return {
              ...w,
              favorites: w.favorites - 1,
              favoritedBy: w.favoritedBy.filter(id => id !== userId)
            };
          }
          return w;
        })
      })),
      
      incrementView: (workId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => 
          w.id === workId ? { ...w, views: w.views + 1 } : w
        )
      })),
      
      getSortedWorks: () => {
        const works = [...get().publishedWorks.filter(w => w.isPublic)];
        const sortType = get().sortType;
        
        switch (sortType) {
          case 'latest':
            return works.sort((a, b) => b.createdAt - a.createdAt);
          case 'popular':
            return works.sort((a, b) => b.likes - a.likes);
          case 'wordCount':
            return works.sort((a, b) => b.wordCount - a.wordCount);
          case 'random':
            return works.sort(() => Math.random() - 0.5);
          default:
            return works;
        }
      },
      
      getFilteredWorks: () => {
        const sortedWorks = get().getSortedWorks();
        const selectedTags = get().selectedTags;
        
        if (selectedTags.length === 0) return sortedWorks;
        
        return sortedWorks.filter(work => 
          selectedTags.some(tag => work.tags.includes(tag))
        );
      }
    }),
    {
      name: 'writequest-showcase-storage'
    }
  )
);
```

- [ ] **Step 2: 创建 userProfileStore**

```typescript
// src/stores/userProfileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface UserProfileStore {
  profiles: UserProfile[];
  currentUserId: string | null;
  
  // Actions
  createProfile: (profile: Omit<UserProfile, 'id' | 'joinedAt' | 'totalLikes' | 'totalWorks' | 'totalWords'>) => string;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  getProfile: (id: string) => UserProfile | undefined;
  getCurrentProfile: () => UserProfile | undefined;
  setCurrentUserId: (id: string) => void;
  
  // 社交操作
  followUser: (followerId: string, followingId: string) => void;
  unfollowUser: (followerId: string, followingId: string) => void;
  
  // 统计更新
  updateStats: (userId: string, words: number) => void;
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentUserId: null,
      
      createProfile: (profile) => {
        const id = crypto.randomUUID();
        set((state) => ({
          profiles: [
            ...state.profiles,
            {
              ...profile,
              id,
              joinedAt: Date.now(),
              totalLikes: 0,
              totalWorks: 0,
              totalWords: 0
            }
          ],
          currentUserId: id
        }));
        return id;
      },
      
      updateProfile: (id, updates) => set((state) => ({
        profiles: state.profiles.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })),
      
      getProfile: (id) => get().profiles.find(p => p.id === id),
      
      getCurrentProfile: () => {
        const currentId = get().currentUserId;
        return currentId ? get().profiles.find(p => p.id === currentId) : undefined;
      },
      
      setCurrentUserId: (id) => set({ currentUserId: id }),
      
      followUser: (followerId, followingId) => set((state) => ({
        profiles: state.profiles.map(p => {
          if (p.id === followerId && !p.following.includes(followingId)) {
            return { ...p, following: [...p.following, followingId] };
          }
          if (p.id === followingId && !p.followers.includes(followerId)) {
            return { ...p, followers: [...p.followers, followerId] };
          }
          return p;
        })
      })),
      
      unfollowUser: (followerId, followingId) => set((state) => ({
        profiles: state.profiles.map(p => {
          if (p.id === followerId) {
            return { ...p, following: p.following.filter(id => id !== followingId) };
          }
          if (p.id === followingId) {
            return { ...p, followers: p.followers.filter(id => id !== followerId) };
          }
          return p;
        })
      })),
      
      updateStats: (userId, words) => set((state) => ({
        profiles: state.profiles.map(p => {
          if (p.id === userId) {
            return {
              ...p,
              totalWorks: p.totalWorks + 1,
              totalWords: p.totalWords + words
            };
          }
          return p;
        })
      }))
    }),
    {
      name: 'writequest-profiles-storage'
    }
  )
);
```

- [ ] **Step 3: 更新 stores/index.ts 导出新 stores**

```typescript
// 在 src/stores/index.ts 末尾添加
export { useShowcaseStore } from './showcaseStore';
export { useUserProfileStore } from './userProfileStore';
```

- [ ] **Step 4: 运行 TypeScript 检查**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 5: 提交**

```bash
git add src/stores/showcaseStore.ts src/stores/userProfileStore.ts src/stores/index.ts
git commit -m "feat: add showcase and user profile state management"
```

---

## Phase 1: 基础功能 - 核心组件

### Task 3: 创建组件导出文件和 UI 组件

**Files:**
- Create: `src/components/showcase/index.ts`
- Create: `src/components/showcase/WorkCard.tsx`

- [ ] **Step 1: 创建组件导出文件**

```typescript
// src/components/showcase/index.ts
export { WorkCard } from './WorkCard';
export { WorkDetail } from './WorkDetail';
export { PublishModal } from './PublishModal';
export { DraftBox } from './DraftBox';
export { UserProfile } from './UserProfile';
export { Leaderboard } from './Leaderboard';
```

- [ ] **Step 2: 创建 WorkCard 组件**

```tsx
// src/components/showcase/WorkCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, MessageCircle, Eye, User } from 'lucide-react';
import { PublishedWork } from '../../types';
import { PixelPanel } from '../ui';

interface WorkCardProps {
  work: PublishedWork;
  onClick: () => void;
  showAuthor?: boolean;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, onClick, showAuthor = true }) => {
  // 生成预览内容（前 100 字符）
  const preview = work.content.length > 100 
    ? work.content.substring(0, 100) + '...' 
    : work.content;
  
  // 格式化日期
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // 生成随机像素封面颜色
  const coverColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];
  const randomColor = coverColors[Math.floor(work.id.charCodeAt(0) % coverColors.length)];
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <PixelPanel className="h-full overflow-hidden">
        {/* 封面区域 */}
        <div className={`h-32 bg-gradient-to-br ${randomColor} relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-pixel text-white text-opacity-50 text-lg">
              {work.title.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* 标签 */}
          {work.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {work.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-black bg-opacity-50 text-xs text-white rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* 内容区域 */}
        <div className="p-4">
          <h3 className="font-pixel text-white text-lg mb-2 truncate">
            {work.title}
          </h3>
          
          {showAuthor && (
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
              <User size={14} />
              <span>{work.authorDisplayName || work.authorName}</span>
            </div>
          )}
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {work.description || preview}
          </p>
          
          {/* 统计信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{work.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{work.comments.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{work.views}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatDate(work.createdAt)}</span>
            </div>
          </div>
          
          {/* 字数 */}
          <div className="mt-2 text-xs text-gray-600">
            {work.wordCount.toLocaleString()} 字
          </div>
        </div>
      </PixelPanel>
    </motion.div>
  );
};
```

- [ ] **Step 3: 检查组件编译**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: 提交**

```bash
git add src/components/showcase/index.ts src/components/showcase/WorkCard.tsx
git commit -m "feat: add WorkCard component"
```

---

### Task 4: 创建作品详情组件

**Files:**
- Create: `src/components/showcase/WorkDetail.tsx`

- [ ] **Step 1: 创建 WorkDetail 组件**

```tsx
// src/components/showcase/WorkDetail.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, User, Clock, X, Send } from 'lucide-react';
import { PublishedWork, Comment } from '../../types';
import { useShowcaseStore, useUserProfileStore } from '../../stores';
import { PixelPanel, PixelButton, PixelInput } from '../ui';

interface WorkDetailProps {
  work: PublishedWork;
  onClose: () => void;
}

export const WorkDetail: React.FC<WorkDetailProps> = ({ work, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [localWork, setLocalWork] = useState(work);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { likeWork, unlikeWork, addComment, favoriteWork, unfavoriteWork, incrementView, getWorkById } = useShowcaseStore();
  const { getCurrentProfile } = useUserProfileStore();
  
  const currentProfile = getCurrentProfile();
  const currentUserId = currentProfile?.id || 'guest';
  const guestName = '游客' + Math.floor(Math.random() * 10000);
  
  // 更新浏览量
  useEffect(() => {
    incrementView(work.id);
    if (currentProfile) {
      setIsLiked(work.likedBy.includes(currentProfile.id));
      setIsFavorited(work.favoritedBy.includes(currentProfile.id));
    }
  }, [work.id]);
  
  // 同步最新数据
  useEffect(() => {
    const freshWork = getWorkById(work.id);
    if (freshWork) {
      setLocalWork(freshWork);
      if (currentProfile) {
        setIsLiked(freshWork.likedBy.includes(currentProfile.id));
        setIsFavorited(freshWork.favoritedBy.includes(currentProfile.id));
      }
    }
  }, [getWorkById, work.id, currentProfile]);
  
  const handleLike = () => {
    if (!currentProfile) return;
    if (isLiked) {
      unlikeWork(localWork.id, currentProfile.id);
    } else {
      likeWork(localWork.id, currentProfile.id);
    }
  };
  
  const handleFavorite = () => {
    if (!currentProfile) return;
    if (isFavorited) {
      unfavoriteWork(localWork.id, currentProfile.id);
    } else {
      favoriteWork(localWork.id, currentProfile.id);
    }
  };
  
  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(localWork.id, {
      authorId: currentUserId,
      authorName: currentProfile?.displayName || guestName,
      content: commentText.trim()
    });
    
    setCommentText('');
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <PixelPanel className="relative">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="p-6 overflow-y-auto max-h-[90vh]">
            {/* 标题 */}
            <h1 className="font-pixel text-2xl text-white mb-4">
              {localWork.title}
            </h1>
            
            {/* 作者和时间 */}
            <div className="flex items-center gap-4 text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{localWork.authorDisplayName || localWork.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{formatDate(localWork.createdAt)}</span>
              </div>
              <span>{localWork.wordCount.toLocaleString()} 字</span>
            </div>
            
            {/* 标签 */}
            {localWork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {localWork.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-pixel-primary bg-opacity-20 text-pixel-primary rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* 简介 */}
            {localWork.description && (
              <p className="text-gray-300 mb-6 italic">
                {localWork.description}
              </p>
            )}
            
            {/* 互动按钮 */}
            <div className="flex items-center gap-4 mb-8">
              <PixelButton
                variant={isLiked ? 'primary' : 'secondary'}
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                {localWork.likes}
              </PixelButton>
              
              <PixelButton
                variant={isFavorited ? 'accent' : 'secondary'}
                onClick={handleFavorite}
                className="flex items-center gap-2"
              >
                <Bookmark size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                {localWork.favorites}
              </PixelButton>
              
              <div className="flex items-center gap-2 text-gray-400">
                <MessageCircle size={18} />
                <span>{localWork.comments.length} 评论</span>
              </div>
            </div>
            
            {/* 内容区域 */}
            <div className="mb-8">
              <PixelPanel className="p-6">
                <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                  {localWork.content}
                </div>
              </PixelPanel>
            </div>
            
            {/* 评论区域 */}
            <div>
              <h3 className="font-pixel text-white mb-4">
                评论 ({localWork.comments.length})
              </h3>
              
              {/* 评论输入 */}
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-2">
                  <PixelInput
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="写下你的评论..."
                    className="flex-1"
                  />
                  <PixelButton
                    type="submit"
                    variant="primary"
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send size={16} />
                    发送
                  </PixelButton>
                </div>
              </form>
              
              {/* 评论列表 */}
              <div className="space-y-4">
                <AnimatePresence>
                  {localWork.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <PixelPanel className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-pixel-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-pixel text-pixel-primary text-sm">
                                {comment.authorName}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </PixelPanel>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {localWork.comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    暂无评论，成为第一个评论者吧！
                  </p>
                )}
              </div>
            </div>
          </div>
        </PixelPanel>
      </motion.div>
    </div>
  );
};
```

- [ ] **Step 2: 检查组件编译**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/components/showcase/WorkDetail.tsx
git commit -m "feat: add WorkDetail component with comments"
```

---

### Task 5: 创建发布弹窗组件

**Files:**
- Create: `src/components/showcase/PublishModal.tsx`

- [ ] **Step 1: 创建 PublishModal 组件**

```tsx
// src/components/showcase/PublishModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Save } from 'lucide-react';
import { useShowcaseStore, useUserProfileStore } from '../../stores';
import { PixelPanel, PixelButton, PixelInput } from '../ui';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent: string;
  initialWordCount: number;
}

const PRESET_TAGS = ['小说', '诗歌', '随笔', '故事', '冒险', '创作'];

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  initialContent,
  initialWordCount
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  const { publishWork, saveDraft } = useShowcaseStore();
  const { getCurrentProfile, updateStats } = useUserProfileStore();
  
  const currentProfile = getCurrentProfile();
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handlePublish = async () => {
    if (!title.trim()) {
      alert('请输入作品标题');
      return;
    }
    
    if (!currentProfile) {
      alert('请先创建用户资料');
      return;
    }
    
    setIsPublishing(true);
    
    // 发布作品
    publishWork({
      authorId: currentProfile.id,
      authorName: currentProfile.characterName,
      authorDisplayName: currentProfile.displayName,
      title: title.trim(),
      description: description.trim(),
      content: initialContent,
      wordCount: initialWordCount,
      isPublic,
      tags: selectedTags
    });
    
    // 更新用户统计
    updateStats(currentProfile.id, initialWordCount);
    
    setPublishSuccess(true);
    
    // 延迟关闭
    setTimeout(() => {
      setPublishSuccess(false);
      setIsPublishing(false);
      resetForm();
      onClose();
    }, 1500);
  };
  
  const handleSaveDraft = () => {
    saveDraft({
      title: title.trim(),
      description: description.trim(),
      content: initialContent,
      tags: selectedTags
    });
    
    alert('草稿已保存！');
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setIsPublic(true);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl"
        >
          <PixelPanel className="relative">
            {/* 成功提示 */}
            {publishSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center z-10 rounded-lg"
              >
                <div className="text-center">
                  <Check size={64} className="mx-auto mb-4 text-white" />
                  <p className="font-pixel text-2xl text-white">发布成功！</p>
                </div>
              </motion.div>
            )}
            
            {/* 关闭按钮 */}
            {!publishSuccess && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            )}
            
            {!publishSuccess && (
              <div className="p-6">
                <h2 className="font-pixel text-2xl text-white mb-6">
                  发布作品
                </h2>
                
                <div className="space-y-4">
                  {/* 标题输入 */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-pixel">
                      标题 *
                    </label>
                    <PixelInput
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="给你的作品起个名字..."
                      className="w-full"
                    />
                  </div>
                  
                  {/* 简介输入 */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-pixel">
                      简介
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="简单介绍一下你的作品..."
                      className="w-full bg-pixel-bg border border-pixel-border rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pixel-primary transition-colors resize-none h-24 font-mono"
                    />
                  </div>
                  
                  {/* 标签选择 */}
                  <div>
                    <label className="block text-gray-300 mb-2 font-pixel">
                      标签
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded border-2 transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-pixel-primary border-pixel-primary text-white'
                              : 'bg-transparent border-pixel-border text-gray-400 hover:border-pixel-primary hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 公开/私密选项 */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">公开 - 所有人可见</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">私密 - 仅自己可见</span>
                    </label>
                  </div>
                  
                  {/* 字数统计 */}
                  <div className="text-gray-500 text-sm">
                    字数: {initialWordCount.toLocaleString()} 字
                  </div>
                  
                  {/* 按钮组 */}
                  <div className="flex gap-4 pt-4">
                    <PixelButton
                      variant="secondary"
                      onClick={handleSaveDraft}
                      className="flex items-center gap-2"
                    >
                      <Save size={18} />
                      保存草稿
                    </PixelButton>
                    <div className="flex-1" />
                    <PixelButton
                      variant="primary"
                      onClick={handlePublish}
                      disabled={isPublishing || !title.trim()}
                      className="flex items-center gap-2"
                    >
                      {isPublishing ? '发布中...' : '发布作品'}
                    </PixelButton>
                  </div>
                </div>
              </div>
            )}
          </PixelPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

- [ ] **Step 2: 检查组件编译**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/components/showcase/PublishModal.tsx
git commit -m "feat: add PublishModal component"
```

---

### Task 6: 创建草稿箱组件

**Files:**
- Create: `src/components/showcase/DraftBox.tsx`

- [ ] **Step 1: 创建 DraftBox 组件**

```tsx
// src/components/showcase/DraftBox.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Edit, Trash2, X } from 'lucide-react';
import { DraftWork } from '../../types';
import { useShowcaseStore } from '../../stores';
import { PixelPanel, PixelButton } from '../ui';

interface DraftBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onEditDraft: (draft: DraftWork) => void;
}

export const DraftBox: React.FC<DraftBoxProps> = ({
  isOpen,
  onClose,
  onEditDraft
}) => {
  const { drafts, deleteDraft } = useShowcaseStore();
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          <PixelPanel className="relative">
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-6">
              <h2 className="font-pixel text-2xl text-white mb-6">
                草稿箱 ({drafts.length})
              </h2>
              
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {drafts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">暂无草稿</p>
                  </div>
                ) : (
                  drafts
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .map((draft) => (
                      <motion.div
                        key={draft.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <PixelPanel className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-pixel text-white mb-1 truncate">
                                {draft.title || '无标题草稿'}
                              </h3>
                              {draft.description && (
                                <p className="text-gray-400 text-sm mb-2 truncate">
                                  {draft.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-gray-500 text-xs">
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>{formatDate(draft.updatedAt)}</span>
                                </div>
                                <span>{draft.content.length.toLocaleString()} 字符</span>
                                {draft.tags.length > 0 && (
                                  <span>
                                    {draft.tags.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <PixelButton
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  onEditDraft(draft);
                                  onClose();
                                }}
                                className="flex items-center gap-1"
                              >
                                <Edit size={14} />
                                编辑
                              </PixelButton>
                              <PixelButton
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  if (confirm('确定要删除这个草稿吗？')) {
                                    deleteDraft(draft.id);
                                  }
                                }}
                                className="flex items-center gap-1"
                              >
                                <Trash2 size={14} />
                              </PixelButton>
                            </div>
                          </div>
                        </PixelPanel>
                      </motion.div>
                    ))
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <PixelButton variant="secondary" onClick={onClose}>
                  关闭
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

- [ ] **Step 2: 检查组件编译**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/components/showcase/DraftBox.tsx
git commit -m "feat: add DraftBox component"
```

---

### Task 7: 创建作品广场页面

**Files:**
- Create: `src/pages/ShowcasePage.tsx`

- [ ] **Step 1: 创建 ShowcasePage 组件**

```tsx
// src/pages/ShowcasePage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trophy, TrendingUp, Calendar, Type } from 'lucide-react';
import { useShowcaseStore } from '../stores';
import { WorkCard, WorkDetail } from '../components/showcase';
import { PixelPanel, PixelButton, PixelInput } from '../components/ui';
import type { PublishedWork, WorkSortType } from '../types';

const SORT_OPTIONS: { value: WorkSortType; label: string; icon: React.ReactNode }[] = [
  { value: 'latest', label: '最新发布', icon: <Calendar size={16} /> },
  { value: 'popular', label: '最受欢迎', icon: <TrendingUp size={16} /> },
  { value: 'wordCount', label: '字数最多', icon: <Type size={16} /> },
  { value: 'random', label: '随机推荐', icon: <Trophy size={16} /> }
];

export default function ShowcasePage() {
  const [selectedWork, setSelectedWork] = useState<PublishedWork | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    publishedWorks, 
    sortType, 
    selectedTags, 
    setSortType, 
    setSelectedTags,
    getFilteredWorks 
  } = useShowcaseStore();
  
  // 获取所有标签
  const allTags = Array.from(
    new Set(publishedWorks.flatMap(work => work.tags))
  ).sort();
  
  // 获取筛选后的作品并搜索
  const filteredWorks = getFilteredWorks().filter(work => 
    !searchTerm || 
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm('');
  };
  
  return (
    <div className="min-h-screen bg-pixel-bg py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-pixel text-4xl text-gradient-gold text-glow-gold mb-4">
            作品广场
          </h1>
          <p className="text-gray-400">
            发现精彩作品，分享你的创作
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 - 筛选 */}
          <div className="lg:col-span-1 space-y-4">
            <PixelPanel className="p-4">
              <h3 className="font-pixel text-white mb-4 flex items-center gap-2">
                <Filter size={18} />
                筛选
              </h3>
              
              {/* 搜索框 */}
              <div className="mb-4">
                <PixelInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索作品..."
                  icon={<Search size={16} />}
                />
              </div>
              
              {/* 排序选项 */}
              <div className="mb-4">
                <h4 className="text-gray-400 text-sm mb-2">排序方式</h4>
                <div className="space-y-1">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortType(option.value)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                        sortType === option.value
                          ? 'bg-pixel-primary bg-opacity-20 text-pixel-primary'
                          : 'text-gray-400 hover:text-white hover:bg-pixel-bg'
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 标签筛选 */}
              {allTags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-pixel-primary text-white'
                            : 'bg-pixel-bg text-gray-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 清除筛选按钮 */}
              {(selectedTags.length > 0 || searchTerm) && (
                <PixelButton
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  清除筛选
                </PixelButton>
              )}
            </PixelPanel>
            
            {/* 统计信息 */}
            <PixelPanel className="p-4">
              <h3 className="font-pixel text-white mb-4">
                统计
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>作品总数</span>
                  <span className="text-white">{publishedWorks.length}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>公开作品</span>
                  <span className="text-white">
                    {publishedWorks.filter(w => w.isPublic).length}
                  </span>
                </div>
              </div>
            </PixelPanel>
          </div>
          
          {/* 主内容区 - 作品网格 */}
          <div className="lg:col-span-3">
            {/* 结果统计 */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-400">
                找到 {filteredWorks.length} 个作品
              </p>
            </div>
            
            {/* 作品网格 */}
            {filteredWorks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredWorks.map((work, index) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <WorkCard
                        work={work}
                        onClick={() => setSelectedWork(work)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <PixelPanel className="p-12 text-center">
                <p className="text-gray-500 text-lg">
                  暂无作品
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  开始创作并发布你的第一个作品吧！
                </p>
              </PixelPanel>
            )}
          </div>
        </div>
      </div>
      
      {/* 作品详情弹窗 */}
      <AnimatePresence>
        {selectedWork && (
          <WorkDetail
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: 检查组件编译**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/pages/ShowcasePage.tsx
git commit -m "feat: add ShowcasePage with filtering and search"
```

---

### Task 8: 创建用户主页组件和页面

**Files:**
- Create: `src/components/showcase/UserProfile.tsx`
- Create: `src/pages/ProfilePage.tsx`

- [ ] **Step 1: 创建 UserProfile 组件**

```tsx
// src/components/showcase/UserProfile.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Calendar, Edit, Check, X } from 'lucide-react';
import { UserProfile as UserProfileType, PublishedWork } from '../../types';
import { useShowcaseStore, useUserProfileStore } from '../../stores';
import { WorkCard, WorkDetail } from '../showcase';
import { PixelPanel, PixelButton, PixelInput } from '../ui';

interface UserProfileProps {
  profile: UserProfileType;
  isOwnProfile?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  isOwnProfile = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(profile.displayName);
  const [editBio, setEditBio] = useState(profile.bio);
  const [selectedWork, setSelectedWork] = useState<PublishedWork | null>(null);
  
  const { publishedWorks } = useShowcaseStore();
  const { currentUserId, followUser, unfollowUser, updateProfile, getCurrentProfile } = useUserProfileStore();
  
  const currentProfile = getCurrentProfile();
  const userWorks = publishedWorks.filter(
    work => work.authorId === profile.id && work.isPublic
  );
  const isFollowing = currentProfile?.following.includes(profile.id) || false;
  
  const handleSaveEdit = () => {
    updateProfile(profile.id, {
      displayName: editDisplayName,
      bio: editBio
    });
    setIsEditing(false);
  };
  
  const handleFollow = () => {
    if (!currentProfile) return;
    if (isFollowing) {
      unfollowUser(currentProfile.id, profile.id);
    } else {
      followUser(currentProfile.id, profile.id);
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  return (
    <div className="min-h-screen bg-pixel-bg py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* 个人资料头部 */}
        <PixelPanel className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
            </div>
            
            {/* 资料信息 */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">昵称</label>
                    <PixelInput
                      value={editDisplayName}
                      onChange={(e) => setEditDisplayName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">简介</label>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-pixel-bg border border-pixel-border rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pixel-primary transition-colors resize-none h-24 font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <PixelButton
                      variant="primary"
                      onClick={handleSaveEdit}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} />
                      保存
                    </PixelButton>
                    <PixelButton
                      variant="secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setEditDisplayName(profile.displayName);
                        setEditBio(profile.bio);
                      }}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      取消
                    </PixelButton>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-pixel text-2xl text-white mb-1">
                        {profile.displayName}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        @{profile.characterName}
                        {profile.characterClass && ` · ${profile.characterClass}`}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {isOwnProfile ? (
                        <PixelButton
                          variant="secondary"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit size={16} />
                          编辑资料
                        </PixelButton>
                      ) : currentProfile && currentProfile.id !== profile.id && (
                        <PixelButton
                          variant={isFollowing ? 'secondary' : 'primary'}
                          onClick={handleFollow}
                          className="flex items-center gap-2"
                        >
                          <Users size={16} />
                          {isFollowing ? '已关注' : '关注'}
                        </PixelButton>
                      )}
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-gray-300 mb-4">
                      {profile.bio}
                    </p>
                  )}
                  
                  {/* 统计数据 */}
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <div className="font-pixel text-2xl text-white">
                        {profile.totalWorks}
                      </div>
                      <div className="text-gray-500 text-sm">作品</div>
                    </div>
                    <div className="text-center">
                      <div className="font-pixel text-2xl text-white">
                        {profile.totalWords.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-sm">总字数</div>
                    </div>
                    <div className="text-center">
                      <div className="font-pixel text-2xl text-white">
                        {profile.followers.length}
                      </div>
                      <div className="text-gray-500 text-sm">粉丝</div>
                    </div>
                    <div className="text-center">
                      <div className="font-pixel text-2xl text-white">
                        {profile.following.length}
                      </div>
                      <div className="text-gray-500 text-sm">关注</div>
                    </div>
                  </div>
                  
                  {/* 加入时间 */}
                  <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>加入于 {formatDate(profile.joinedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PixelPanel>
        
        {/* 作品列表 */}
        <div>
          <h2 className="font-pixel text-xl text-white mb-4">
            作品 ({userWorks.length})
          </h2>
          
          {userWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {userWorks
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((work, index) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <WorkCard
                        work={work}
                        onClick={() => setSelectedWork(work)}
                        showAuthor={false}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          ) : (
            <PixelPanel className="p-12 text-center">
              <p className="text-gray-500">
                暂无公开作品
              </p>
            </PixelPanel>
          )}
        </div>
      </div>
      
      {/* 作品详情弹窗 */}
      <AnimatePresence>
        {selectedWork && (
          <WorkDetail
            work={selectedWork}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
```

- [ ] **Step 2: 创建 ProfilePage 页面**

```tsx
// src/pages/ProfilePage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfileStore, useCharacterStore } from '../stores';
import { UserProfile } from '../components/showcase';

export default function ProfilePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { profiles, getProfile, getCurrentProfile, createProfile, setCurrentUserId } = useUserProfileStore();
  const { character } = useCharacterStore();
  
  // 当前查看的用户ID
  const targetUserId = id || getCurrentProfile()?.id;
  const targetProfile = targetUserId ? getProfile(targetUserId) : undefined;
  
  // 是否是自己的主页
  const isOwnProfile = !id || id === getCurrentProfile()?.id;
  
  // 如果有角色但没有用户资料，自动创建
  useEffect(() => {
    if (character && !getCurrentProfile() && profiles.length === 0) {
      createProfile({
        displayName: character.name,
        characterName: character.name,
        bio: '',
        characterClass: character.class,
        followers: [],
        following: []
      });
    }
  }, [character, profiles.length]);
  
  // 如果没有目标用户，跳转到广场
  useEffect(() => {
    if (id && !targetProfile) {
      navigate('/showcase');
    }
  }, [id, targetProfile, navigate]);
  
  if (!targetProfile) {
    return (
      <div className="min-h-screen bg-pixel-bg flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }
  
  return (
    <UserProfile
      profile={targetProfile}
      isOwnProfile={isOwnProfile}
    />
  );
}
```

- [ ] **Step 3: 检查组件编译**

Run: `npx tsc --noEmit`
Expected: 无类型错误

- [ ] **