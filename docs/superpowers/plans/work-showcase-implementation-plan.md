# WriteQuest 作品展示与分享系统 - 实施计划

## 概述

本计划包含了完整的作品展示与分享系统的实施步骤，分为以下几个阶段：

1. **Phase 1**: 数据结构和状态管理
2. **Phase 2**: 核心 UI 组件
3. **Phase 3**: 页面集成与路由
4. **Phase 4**: 编辑器集成与发布流程
5. **Phase 5**: 排行榜与高级功能

---

## 文件清单

### 新建文件
- `src/types/showcase.ts` - 类型定义
- `src/stores/showcaseStore.ts` - 作品展示状态管理
- `src/stores/userProfileStore.ts` - 用户资料状态管理
- `src/components/showcase/index.ts` - 组件导出
- `src/components/showcase/WorkCard.tsx` - 作品卡片
- `src/components/showcase/WorkDetail.tsx` - 作品详情
- `src/components/showcase/PublishModal.tsx` - 发布弹窗
- `src/components/showcase/DraftBox.tsx` - 草稿箱
- `src/components/showcase/UserProfile.tsx` - 用户主页组件
- `src/components/showcase/Leaderboard.tsx` - 排行榜
- `src/pages/ShowcasePage.tsx` - 作品广场页面
- `src/pages/ProfilePage.tsx` - 用户主页页面

### 修改文件
- `src/types/index.ts` - 导出新类型
- `src/stores/index.ts` - 导出新 stores
- `src/App.tsx` - 集成新功能
- `src/components/layout/Header.tsx` - 添加导航链接
- `src/components/editor/WritingEditor.tsx` - 添加发布按钮

---

## Phase 1: 数据结构和状态管理

### Task 1: 创建类型定义
**Status**: ⏳ Pending

```typescript
// src/types/showcase.ts
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
  likes: number;
  likedBy: string[];
  comments: Comment[];
  favorites: number;
  favoritedBy: string[];
  views: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  characterName: string;
  bio: string;
  avatar?: string;
  characterClass?: string;
  followers: string[];
  following: string[];
  totalLikes: number;
  totalWorks: number;
  totalWords: number;
  joinedAt: number;
}

export interface DraftWork {
  id: string;
  title?: string;
  description?: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type WorkSortType = 'latest' | 'popular' | 'random' | 'wordCount';
export type LeaderboardType = 'works' | 'authors';
```

**Steps**:
1. [ ] 创建 `src/types/showcase.ts` 文件并添加上述代码
2. [ ] 在 `src/types/index.ts` 中添加 `export * from './showcase';`
3. [ ] 运行 `npx tsc --noEmit` 检查类型
4. [ ] 提交代码: `git commit -m "feat: add showcase type definitions"`

---

### Task 2: 创建状态管理 Stores
**Status**: ⏳ Pending

**A. 作品展示 Store**
```typescript
// src/stores/showcaseStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PublishedWork, WorkSortType, DraftWork, Comment } from '../types';

interface ShowcaseStore {
  publishedWorks: PublishedWork[];
  drafts: DraftWork[];
  currentWork: PublishedWork | null;
  sortType: WorkSortType;
  selectedTags: string[];
  setSortType: (type: WorkSortType) => void;
  setSelectedTags: (tags: string[]) => void;
  publishWork: (work: Omit<PublishedWork, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'favorites' | 'views' | 'likedBy' | 'favoritedBy'>) => void;
  updateWork: (id: string, updates: Partial<PublishedWork>) => void;
  deleteWork: (id: string) => void;
  getWorkById: (id: string) => PublishedWork | undefined;
  saveDraft: (draft: Omit<DraftWork, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateDraft: (id: string, updates: Partial<DraftWork>) => void;
  deleteDraft: (id: string) => void;
  likeWork: (workId: string, userId: string) => void;
  unlikeWork: (workId: string, userId: string) => void;
  addComment: (workId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  favoriteWork: (workId: string, userId: string) => void;
  unfavoriteWork: (workId: string, userId: string) => void;
  incrementView: (workId: string) => void;
  getSortedWorks: () => PublishedWork[];
  getFilteredWorks: () => PublishedWork[];
}

export const useShowcaseStore = create<ShowcaseStore>()(
  persist(
    (set, get) => ({
      publishedWorks: [],
      drafts: [],
      currentWork: null,
      sortType: 'latest',
      selectedTags: [],
      
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
            { ...draft, id, createdAt: Date.now(), updatedAt: Date.now() }
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
            return { ...w, likes: w.likes + 1, likedBy: [...w.likedBy, userId] };
          }
          return w;
        })
      })),
      
      unlikeWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && w.likedBy.includes(userId)) {
            return { ...w, likes: w.likes - 1, likedBy: w.likedBy.filter(id => id !== userId) };
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
                { ...comment, id: crypto.randomUUID(), createdAt: Date.now() }
              ]
            };
          }
          return w;
        })
      })),
      
      favoriteWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && !w.favoritedBy.includes(userId)) {
            return { ...w, favorites: w.favorites + 1, favoritedBy: [...w.favoritedBy, userId] };
          }
          return w;
        })
      })),
      
      unfavoriteWork: (workId, userId) => set((state) => ({
        publishedWorks: state.publishedWorks.map(w => {
          if (w.id === workId && w.favoritedBy.includes(userId)) {
            return { ...w, favorites: w.favorites - 1, favoritedBy: w.favoritedBy.filter(id => id !== userId) };
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
          case 'latest': return works.sort((a, b) => b.createdAt - a.createdAt);
          case 'popular': return works.sort((a, b) => b.likes - a.likes);
          case 'wordCount': return works.sort((a, b) => b.wordCount - a.wordCount);
          case 'random': return works.sort(() => Math.random() - 0.5);
          default: return works;
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
    { name: 'writequest-showcase-storage' }
  )
);
```

**B. 用户资料 Store**
```typescript
// src/stores/userProfileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface UserProfileStore {
  profiles: UserProfile[];
  currentUserId: string | null;
  createProfile: (profile: Omit<UserProfile, 'id' | 'joinedAt' | 'totalLikes' | 'totalWorks' | 'totalWords'>) => string;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  getProfile: (id: string) => UserProfile | undefined;
  getCurrentProfile: () => UserProfile | undefined;
  setCurrentUserId: (id: string) => void;
  followUser: (followerId: string, followingId: string) => void;
  unfollowUser: (followerId: string, followingId: string) => void;
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
            return { ...p, totalWorks: p.totalWorks + 1, totalWords: p.totalWords + words };
          }
          return p;
        })
      }))
    }),
    { name: 'writequest-profiles-storage' }
  )
);
```

**Steps**:
1. [ ] 创建 `src/stores/showcaseStore.ts`
2. [ ] 创建 `src/stores/userProfileStore.ts`
3. [ ] 在 `src/stores/index.ts` 中添加:
   ```typescript
   export { useShowcaseStore } from './showcaseStore';
   export { useUserProfileStore } from './userProfileStore';
   ```
4. [ ] 运行 `npx tsc --noEmit` 检查类型
5. [ ] 提交代码: `git commit -m "feat: add showcase state management"`

---

## Phase 2: 核心 UI 组件

### Task 3: 创建基础组件
**Status**: ⏳ Pending

**Files to create**:
1. `src/components/showcase/index.ts`
2. `src/components/showcase/WorkCard.tsx`
3. `src/components/showcase/WorkDetail.tsx`
4. `src/components/showcase/PublishModal.tsx`
5. `src/components/showcase/DraftBox.tsx`
6. `src/components/showcase/UserProfile.tsx`
7. `src/components/showcase/Leaderboard.tsx`

**Steps for each component**:
1. [ ] 创建组件文件
2. [ ] 实现组件功能
3. [ ] 运行 `npx tsc --noEmit` 检查
4. [ ] 提交代码

---

## Phase 3: 页面集成与路由

### Task 4: 创建作品广场页面
**Status**: ⏳ Pending

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
  
  const allTags = Array.from(
    new Set(publishedWorks.flatMap(work => work.tags))
  ).sort();
  
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
          <div className="lg:col-span-1 space-y-4">
            <PixelPanel className="p-4">
              <h3 className="font-pixel text-white mb-4 flex items-center gap-2">
                <Filter size={18} />
                筛选
              </h3>
              
              <div className="mb-4">
                <PixelInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索作品..."
                  icon={<Search size={16} />}
                />
              </div>
              
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
          
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-400">
                找到 {filteredWorks.length} 个作品
              </p>
            </div>
            
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

**Steps**:
1. [ ] 创建 `src/pages/ShowcasePage.tsx`
2. [ ] 创建 `src/pages/ProfilePage.tsx`
3. [ ] 更新 `src/main.tsx` 或 `src/App.tsx` 添加路由
4. [ ] 运行 `npx tsc --noEmit` 检查
5. [ ] 提交代码: `git commit -m "feat: add showcase pages"`

---

## Phase 4: 编辑器集成与发布流程

### Task 5: 集成发布功能
**Status**: ⏳ Pending

**Steps**:
1. [ ] 在写作编辑器中添加「发布」按钮
2. [ ] 添加「保存草稿」和「打开草稿箱」功能
3. [ ] 连接用户资料创建流程
4. [ ] 测试完整发布流程
5. [ ] 提交代码: `git commit -m "feat: integrate publishing workflow"`

---

## Phase 5: 排行榜与高级功能

### Task 6: 实现排行榜
**Status**: ⏳ Pending

**Steps**:
1. [ ] 创建排行榜组件
2. [ ] 实现作品热度榜和作者影响力榜
3. [ ] 集成到作品广场页面
4. [ ] 提交代码: `git commit -m "feat: add leaderboard"`

---

## 执行选项

**选项 1**: Subagent-Driven (推荐)
- 使用子代理逐个执行任务
- 每个任务完成后进行验证
- 更稳定的执行过程

**选项 2**: Inline Execution
- 在当前会话中批量执行
- 需要定期检查点

---

## 注意事项

1. **数据持久化**: 使用 localStorage 进行本地存储
2. **类型安全**: 确保所有 TypeScript 类型正确
3. **现有代码**: 遵循项目现有代码风格和结构
4. **测试**: 每个组件创建后进行功能测试
