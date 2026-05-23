# WriteQuest 作品展示与分享系统 - 设计文档

## 1. 概述

### 1.1 项目目标
为 WriteQuest 增加作品展示和分享功能，让用户可以：
- 发布自己的写作作品到公开广场
- 浏览其他用户的作品
- 与作品进行互动（喜欢、评论、收藏）
- 关注其他作者
- 查看排行榜

### 1.2 核心设计理念
- **渐进式架构**：先实现本地存储版本，为未来后端服务预留接口
- **游戏化风格**：保持 WriteQuest 的像素风/奇幻风格设计
- **简洁易用**：发布流程简单直观，作品广场浏览体验流畅
- **用户优先**：以用户体验为核心，功能实用不冗余

## 2. 需求规格

### 2.1 功能需求

| 功能模块 | 功能描述 | 优先级 |
|---------|---------|-------|
| 作品广场 | 浏览公开作品，支持多种排序和筛选 | P0 |
| 发布系统 | 写作完成后可选择发布到广场，支持草稿箱 | P0 |
| 用户主页 | 展示用户的公开作品、写作统计、关注关系 | P0 |
| 互动系统 | 喜欢、评论、收藏、关注作者 | P0 |
| 排行榜 | 作品热度榜、作者影响力榜 | P1 |
| 标签系统 | 作品分类和标签管理 | P1 |

### 2.2 非功能需求
- **性能**：作品广场加载时间 < 2秒
- **可扩展性**：数据层设计预留后端接口
- **兼容性**：保持与现有功能的兼容性
- **数据安全**：本地存储数据加密处理

## 3. 系统架构

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                     前端 UI 层                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 作品广场页面  │  │ 用户主页页面  │  │ 发布弹窗    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   Zustand 状态管理层                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 作品Store    │  │ 用户Store    │  │ 互动Store    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    数据存储层                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │      localStorage (当前版本)                     │  │
│  │      预留：后端 API 接口层                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 3.2 目录结构

```
src/
├── components/
│   ├── showcase/          # 作品展示系统组件
│   │   ├── WorkCard.tsx  # 作品卡片
│   │   ├── WorkDetail.tsx # 作品详情
│   │   ├── PublishModal.tsx # 发布弹窗
│   │   ├── DraftBox.tsx   # 草稿箱
│   │   ├── UserProfile.tsx # 用户主页
│   │   ├── Leaderboard.tsx # 排行榜
│   │   └── index.ts
│   └── ...
├── stores/
│   ├── showcaseStore.ts   # 作品展示系统状态管理
│   ├── userProfileStore.ts # 用户资料状态管理
│   └── ...
├── types/
│   └── showcase.ts        # 作品展示系统类型定义
└── pages/
    ├── ShowcasePage.tsx   # 作品广场页面
    ├── ProfilePage.tsx    # 用户主页页面
    └── ...
```

## 4. 数据结构设计

### 4.1 类型定义

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

### 4.2 localStorage 键名约定

```typescript
const STORAGE_KEYS = {
  PUBLISHED_WORKS: 'writequest_published_works',
  USER_PROFILES: 'writequest_user_profiles',
  CURRENT_USER: 'writequest_current_user',
  DRAFTS: 'writequest_drafts',
  INTERACTIONS: 'writequest_interactions'
};
```

## 5. 核心功能设计

### 5.1 作品广场

**功能描述**：展示所有公开作品，支持排序和筛选

**主要功能点**：
- 卡片式布局展示作品
- 排序选项：最新发布、最热（喜欢数）、随机、字数最多
- 筛选：按标签、作者职业
- 无限滚动或分页加载

**UI 设计**：
- 每个作品卡片显示：标题、作者、字数、发布时间、互动统计
- 作品封面：使用首段文字生成像素风格缩略图
- 鼠标悬停显示作品简介

### 5.2 发布系统

**功能描述**：写作完成后可发布到广场，支持草稿箱功能

**发布流程**：
1. 写作编辑器底部显示「发布」按钮
2. 点击弹出发布对话框
3. 填写：标题、简介、标签、选择公开/私密
4. 确认发布或保存到草稿箱

**草稿箱功能**：
- 自动保存未发布的作品
- 草稿列表管理（编辑、删除、发布）
- 与写作编辑器集成

### 5.3 用户主页

**功能描述**：展示用户的公开作品和个人信息

**页面结构**：
- 顶部：用户资料卡（头像、昵称、简介、统计数据）
- 中部：作品展示区（网格布局）
- 底部：关注/粉丝列表

**功能**：
- 编辑个人资料
- 关注/取消关注用户
- 查看自己的作品统计

### 5.4 互动系统

**功能描述**：
- 喜欢作品
- 评论作品
- 收藏作品
- 关注作者

**设计要点**：
- 实时更新互动数据
- 评论支持匿名昵称（游客模式）
- 互动有动画反馈

### 5.5 排行榜

**功能描述**：
- 作品榜：Top 10 最热作品（按喜欢数排序）
- 作者榜：Top 10 作者（按总喜欢数或总作品数排序）

**更新频率**：实时计算（本地版）

## 6. 状态管理设计

### 6.1 showcaseStore

```typescript
// src/stores/showcaseStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PublishedWork, WorkSortType, DraftWork, Comment } from '../types/showcase';

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
  publishWork: (work: Omit<PublishedWork, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments' | 'favorites' | 'views'>) => void;
  updateWork: (id: string, updates: Partial<PublishedWork>) => void;
  deleteWork: (id: string) => void;
  getWorkById: (id: string) => PublishedWork | undefined;
  
  // 草稿操作
  saveDraft: (draft: Omit<DraftWork, 'id' | 'createdAt' | 'updatedAt'>) => void;
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
      
      saveDraft: (draft) => set((state) => ({
        drafts: [
          ...state.drafts,
          {
            ...draft,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        ]
      })),
      
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

### 6.2 userProfileStore

```typescript
// src/stores/userProfileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types/showcase';

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

## 7. 与现有系统集成

### 7.1 导航集成
在现有导航栏中新增：
- 「广场」：链接到作品广场页面
- 「我的主页」：链接到当前用户的主页

### 7.2 编辑器集成
在写作编辑器中：
- 底部增加「发布」按钮
- 增加「保存到草稿」选项
- 发布成功后显示提示动画

### 7.3 角色系统集成
- 用户资料默认使用游戏角色名
- 允许用户设置独立的公开昵称
- 在用户主页显示角色职业信息

## 8. UI/UX 设计要点

### 8.1 视觉风格
- 保持 WriteQuest 的像素风/奇幻风格
- 使用与现有系统一致的颜色主题
- 作品卡片有悬停动画效果
- 互动按钮有状态反馈（点赞后的高亮）

### 8.2 交互设计
- 发布流程有明确的步骤引导
- 作品加载有骨架屏占位
- 评论输入框自动聚焦
- 关注/取消关注有即时反馈

### 8.3 响应式设计
- 移动端单列布局
- 平板端双列布局
- 桌面端三列或四列布局

## 9. 实现阶段规划

### Phase 1: 基础功能
- [ ] 数据结构和状态管理
- [ ] 作品发布功能
- [ ] 作品广场（基础浏览）
- [ ] 作品详情页

### Phase 2: 互动功能
- [ ] 喜欢/取消喜欢
- [ ] 评论系统
- [ ] 收藏功能
- [ ] 用户主页

### Phase 3: 完善功能
- [ ] 关注系统
- [ ] 排行榜
- [ ] 标签系统
- [ ] 草稿箱

## 10. 未来扩展

### 10.1 后端服务迁移
预留 API 接口层，未来可平滑迁移到：
- RESTful API
- WebSocket 实时更新
- 云存储

### 10.2 功能增强
- AI 推荐系统
- 作品专题活动
- 写作挑战
- 多人协作写作
