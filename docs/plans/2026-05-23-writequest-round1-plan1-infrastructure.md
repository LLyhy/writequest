# WriteQuest 第一轮迭代 - 计划 1：基础架构优化

&gt; **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 App.tsx 并为所有 Zustand store 添加持久化功能，同时支持数据导出/导入

**Architecture:** 
- 提取视图逻辑到独立的 View 组件
- 使用 React Router 管理导航
- 集成 zustand-persist 中间件实现自动持久化
- 创建数据导出/导入功能

**Tech Stack:** React 18, TypeScript, Zustand, zustand-persist, React Router DOM

---

## 文件结构概览

**新建文件：**
- `src/views/MainView.tsx` - 主视图
- `src/views/BossBattleView.tsx` - Boss 战视图
- `src/views/AdventureView.tsx` - 冒险模式视图
- `src/views/ShowcaseView.tsx` - 广场视图
- `src/views/ProfileView.tsx` - 个人主页视图
- `src/router/AppRouter.tsx` - 路由配置
- `src/stores/useDataExportStore.ts` - 数据导出导入 store
- `src/components/data/DataExportModal.tsx` - 数据导出弹窗
- `src/components/data/DataImportModal.tsx` - 数据导入弹窗

**修改文件：**
- `src/App.tsx` - 简化为初始化和错误边界
- `src/main.tsx` - 集成路由
- `src/stores/characterStore.ts` - 添加持久化
- `src/stores/gameStore.ts` - 添加持久化
- `src/stores/editorStore.ts` - 添加持久化
- `src/stores/skillStore.ts` - 添加持久化
- `src/stores/achievementStore.ts` - 添加持久化
- `src/stores/mapStore.ts` - 添加持久化
- `src/stores/storyStore.ts` - 添加持久化
- `src/stores/collectionStore.ts` - 添加持久化
- `src/stores/shopStore.ts` - 添加持久化
- `src/stores/adventureStore.ts` - 添加持久化
- `src/stores/heroStore.ts` - 添加持久化
- `src/stores/showcaseStore.ts` - 添加持久化
- `src/stores/userProfileStore.ts` - 添加持久化
- `src/components/layout/Header.tsx` - 添加数据管理按钮

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 zustand-persist 和 react-router-dom**

```bash
cd d:\产品\writequest
npm install zustand-persist react-router-dom
npm install -D @types/react-router-dom
```

- [ ] **Step 2: 验证安装成功**

```bash
npm list zustand-persist react-router-dom
```

Expected: 看到两个包都已安装

---

## Task 2: 创建视图组件 - MainView

**Files:**
- Create: `src/views/MainView.tsx`

- [ ] **Step 1: 创建 MainView 组件**

```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore, useGameStore, useCollectionStore, useHeroStore } from '../stores';
import { CharacterStats } from '../components/character';
import { WritingEditor, WordCounter } from '../components/editor';
import { DailyQuests } from '../components/quests';
import { BossSelect, BossBattleComponent } from '../components/boss';
import { SkillTree } from '../components/skills';
import { AchievementPanel } from '../components/achievements';
import { StatsPanel } from '../components/stats';
import { WorldMap } from '../components/map';
import { StoryPanel } from '../components/story';
import { ShopPanel } from '../components/shop';
import { CollectionPanel } from '../components/collection';
import { AdventureModePanel } from '../components/adventure';
import { CharacterPanel } from '../components/character/CharacterPanel';
import { PixelPanel } from '../components/ui/PixelPanel';
import { CoinDisplay } from '../components/ui/CoinDisplay';
import { QuestCompleteAnimation } from '../components/ui/QuestCompleteAnimation';
import { PixelButton } from '../components/ui/PixelButton';
import { Trophy, Zap, Swords, Brain, BarChart3, Map, BookOpen, ShoppingCart, Backpack, Sword, User, Sparkles } from 'lucide-react';
import type { Boss } from '../types';
import { DAILY_QUEST_DRAW_REWARD } from '../constants/game';

type ViewMode = 'main' | 'boss' | 'bossBattle' | 'skills' | 'achievements' | 'stats' | 'map' | 'story' | 'shop' | 'collection' | 'adventure' | 'character';

interface MainViewProps {
  onNavigateToShowcase: () =&gt; void;
  onNavigateToProfile: () =&gt; void;
}

export function MainView({ onNavigateToShowcase, onNavigateToProfile }: MainViewProps) {
  const character = useCharacterStore((state) =&gt; state.character);
  const coins = useGameStore((state) =&gt; state.coins);
  const checkAndRefreshDailyQuests = useGameStore((state) =&gt; state.checkAndRefreshDailyQuests);
  const unlockNextBoss = useGameStore((state) =&gt; state.unlockNextBoss);
  const { collectFragment, getRandomFragment } = useCollectionStore();
  const { addDraws } = useHeroStore();

  const [viewMode, setViewMode] = useState&lt;ViewMode&gt;('main');
  const [selectedBoss, setSelectedBoss] = useState&lt;Boss | null&gt;(null);
  const [showQuestAnimation, setShowQuestAnimation] = useState(false);
  const [questReward, setQuestReward] = useState({ exp: 0, coins: 0 });

  useEffect(() =&gt; {
    if (character) {
      checkAndRefreshDailyQuests();
    }
  }, [character, checkAndRefreshDailyQuests]);

  useEffect(() =&gt; {
    if (character &amp;&amp; Math.random() &lt; 0.1) {
      const fragment = getRandomFragment();
      if (fragment) {
        collectFragment(fragment.id);
      }
    }
  }, [character?.totalWords, collectFragment, getRandomFragment]);

  const handleSelectBoss = (boss: Boss) =&gt; {
    setSelectedBoss(boss);
    setViewMode('bossBattle');
  };

  const handleBossVictory = () =&gt; {
    if (selectedBoss) {
      unlockNextBoss(selectedBoss.id);
    }
    setTimeout(() =&gt; {
      setViewMode('main');
      setSelectedBoss(null);
    }, 3000);
  };

  const handleBossDefeat = () =&gt; {
    setTimeout(() =&gt; {
      setViewMode('main');
      setSelectedBoss(null);
    }, 3000);
  };

  const handleQuestComplete = (exp: number, coins: number, isDaily: boolean = false) =&gt; {
    setQuestReward({ exp, coins });
    setShowQuestAnimation(true);
    if (isDaily) {
      addDraws(DAILY_QUEST_DRAW_REWARD);
    }
  };

  return (
    &lt;div className="flex flex-col"&gt;
      &lt;main className="flex-1 max-w-7xl mx-auto w-full p-4"&gt;
        &lt;AnimatePresence mode="wait"&gt;
          {viewMode === 'adventure' ? (
            &lt;motion.div
              key="adventure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            &gt;
              &lt;div className="mb-4"&gt;
                &lt;PixelButton
                  variant="secondary"
                  size="md"
                  onClick={() =&gt; setViewMode('main')}
                &gt;
                  ← 返回主界面
                &lt;/PixelButton&gt;
              &lt;/div&gt;
              &lt;AdventureModePanel onClose={() =&gt; setViewMode('main')} /&gt;
            &lt;/motion.div&gt;
          ) : (
            &lt;motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            &gt;
              &lt;div className="grid grid-cols-1 lg:grid-cols-12 gap-6"&gt;
                &lt;div className="lg:col-span-4 space-y-4"&gt;
                  &lt;CharacterStats /&gt;
                  &lt;div className="grid grid-cols-2 gap-3"&gt;
                    &lt;PixelPanel className="p-3" animate={false}&gt;
                      &lt;div className="flex items-center gap-2"&gt;
                        &lt;Trophy size={20} className="text-pixel-accent" /&gt;
                        &lt;div&gt;
                          &lt;p className="text-xs text-gray-500 font-mono"&gt;金币&lt;/p&gt;
                          &lt;CoinDisplay amount={coins} size="sm" showIcon={false} /&gt;
                        &lt;/div&gt;
                      &lt;/div&gt;
                    &lt;/PixelPanel&gt;
                    &lt;PixelPanel className="p-3" animate={false}&gt;
                      &lt;div className="flex items-center gap-2"&gt;
                        &lt;Zap size={20} className="text-pixel-primary" /&gt;
                        &lt;div&gt;
                          &lt;p className="text-xs text-gray-500 font-mono"&gt;等级&lt;/p&gt;
                          &lt;p className="font-pixel text-sm text-white"&gt;{character?.level}&lt;/p&gt;
                        &lt;/div&gt;
                      &lt;/div&gt;
                    &lt;/PixelPanel&gt;
                  &lt;/div&gt;
                  &lt;div className="grid grid-cols-3 gap-2 mb-3"&gt;
                    &lt;PixelButton
                      variant="danger"
                      size="sm"
                      onClick={() =&gt; setViewMode('boss')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;Swords size={14} /&gt;
                      &lt;span className="text-xs"&gt;Boss&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() =&gt; setViewMode('skills')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;Brain size={14} /&gt;
                      &lt;span className="text-xs"&gt;技能&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() =&gt; setViewMode('achievements')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;Trophy size={14} /&gt;
                      &lt;span className="text-xs"&gt;成就&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="primary"
                      size="sm"
                      onClick={() =&gt; setViewMode('stats')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;BarChart3 size={14} /&gt;
                      &lt;span className="text-xs"&gt;统计&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="primary"
                      size="sm"
                      onClick={() =&gt; setViewMode('map')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;Map size={14} /&gt;
                      &lt;span className="text-xs"&gt;地图&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() =&gt; setViewMode('story')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;BookOpen size={14} /&gt;
                      &lt;span className="text-xs"&gt;剧情&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() =&gt; setViewMode('shop')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;ShoppingCart size={14} /&gt;
                      &lt;span className="text-xs"&gt;商店&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() =&gt; setViewMode('collection')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;Backpack size={14} /&gt;
                      &lt;span className="text-xs"&gt;收集&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() =&gt; setViewMode('character')}
                      className="flex items-center justify-center gap-1"
                    &gt;
                      &lt;User size={14} /&gt;
                      &lt;span className="text-xs"&gt;角色&lt;/span&gt;
                    &lt;/PixelButton&gt;
                  &lt;/div&gt;
                  &lt;div className="grid grid-cols-2 gap-2 mb-3"&gt;
                    &lt;PixelButton
                      variant="accent"
                      size="md"
                      onClick={onNavigateToShowcase}
                      className="flex items-center justify-center gap-2"
                    &gt;
                      &lt;Sparkles size={16} /&gt;
                      &lt;span&gt;广场&lt;/span&gt;
                    &lt;/PixelButton&gt;
                    &lt;PixelButton
                      variant="primary"
                      size="md"
                      onClick={onNavigateToProfile}
                      className="flex items-center justify-center gap-2"
                    &gt;
                      &lt;User size={16} /&gt;
                      &lt;span&gt;我的&lt;/span&gt;
                    &lt;/PixelButton&gt;
                  &lt;/div&gt;
                  &lt;PixelButton
                    variant="primary"
                    size="md"
                    onClick={() =&gt; setViewMode('adventure')}
                    className="w-full flex items-center justify-center gap-2"
                  &gt;
                    &lt;Sword size={16} /&gt;
                    &lt;span&gt;🐉 冒险创作模式&lt;/span&gt;
                  &lt;/PixelButton&gt;
                  {viewMode === 'main' &amp;&amp; (
                    &lt;DailyQuests onQuestComplete={handleQuestComplete} /&gt;
                  )}
                  &lt;AnimatePresence mode="wait"&gt;
                    {viewMode === 'boss' &amp;&amp; (
                      &lt;motion.div
                        key="boss"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;BossSelect onSelectBoss={handleSelectBoss} /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'skills' &amp;&amp; (
                      &lt;motion.div
                        key="skills"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;SkillTree /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'achievements' &amp;&amp; (
                      &lt;motion.div
                        key="achievements"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;AchievementPanel /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'stats' &amp;&amp; (
                      &lt;motion.div
                        key="stats"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;StatsPanel /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'map' &amp;&amp; (
                      &lt;motion.div
                        key="map"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;WorldMap onClose={() =&gt; setViewMode('main')} /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'story' &amp;&amp; (
                      &lt;motion.div
                        key="story"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;StoryPanel onClose={() =&gt; setViewMode('main')} /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'shop' &amp;&amp; (
                      &lt;motion.div
                        key="shop"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;ShopPanel onClose={() =&gt; setViewMode('main')} /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'collection' &amp;&amp; (
                      &lt;motion.div
                        key="collection"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;CollectionPanel onClose={() =&gt; setViewMode('main')} /&gt;
                      &lt;/motion.div&gt;
                    )}
                    {viewMode === 'character' &amp;&amp; (
                      &lt;motion.div
                        key="character"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      &gt;
                        &lt;CharacterPanel /&gt;
                      &lt;/motion.div&gt;
                    )}
                  &lt;/AnimatePresence&gt;
                  {viewMode === 'main' &amp;&amp; &lt;WordCounter /&gt;}
                &lt;/div&gt;
                &lt;div className="lg:col-span-8"&gt;
                  &lt;AnimatePresence mode="wait"&gt;
                    {viewMode === 'bossBattle' &amp;&amp; selectedBoss ? (
                      &lt;motion.div
                        key="bossBattle"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      &gt;
                        &lt;BossBattleComponent
                          boss={selectedBoss}
                          onClose={() =&gt; setViewMode('main')}
                          onVictory={handleBossVictory}
                          onDefeat={handleBossDefeat}
                        /&gt;
                      &lt;/motion.div&gt;
                    ) : (
                      &lt;motion.div
                        key="editor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      &gt;
                        &lt;WritingEditor /&gt;
                      &lt;/motion.div&gt;
                    )}
                  &lt;/AnimatePresence&gt;
                &lt;/div&gt;
              &lt;/div&gt;
            &lt;/motion.div&gt;
          )}
        &lt;/AnimatePresence&gt;
      &lt;/main&gt;
      &lt;QuestCompleteAnimation
        isVisible={showQuestAnimation}
        exp={questReward.exp}
        coins={questReward.coins}
        onComplete={() =&gt; setShowQuestAnimation(false)}
      /&gt;
      &lt;footer className="border-t-2 border-pixel-border bg-pixel-panel mt-8"&gt;
        &lt;div className="max-w-7xl mx-auto px-4 py-4"&gt;
          &lt;div className="flex flex-col sm:flex-row items-center justify-between gap-4"&gt;
            &lt;p className="text-xs text-gray-500 font-mono"&gt;
              WriteQuest · 让写作成为一场冒险
            &lt;/p&gt;
            {character &amp;&amp; (
              &lt;div className="flex items-center gap-4 text-xs text-gray-500 font-mono"&gt;
                &lt;span&gt;字数: {character.totalWords.toLocaleString()}&lt;/span&gt;
                &lt;span&gt;时间: {Math.floor(character.totalWritingTime / 60)}小时&lt;/span&gt;
                &lt;span&gt;连续: {character.streakDays}天&lt;/span&gt;
              &lt;/div&gt;
            )}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/footer&gt;
    &lt;/div&gt;
  );
}
```

- [ ] **Step 2: 验证文件创建成功**

检查文件是否存在于 `src/views/MainView.tsx`

---

## Task 3: 创建其他视图组件

**Files:**
- Create: `src/views/BossBattleView.tsx`
- Create: `src/views/AdventureView.tsx`
- Create: `src/views/ShowcaseView.tsx`
- Create: `src/views/ProfileView.tsx`

- [ ] **Step 1: 创建 BossBattleView**

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore, useGameStore } from '../stores';
import { BossBattleComponent, BossSelect } from '../components/boss';
import { PixelButton } from '../components/ui/PixelButton';
import type { Boss } from '../types';

interface BossBattleViewProps {
  onBack: () =&gt; void;
}

export function BossBattleView({ onBack }: BossBattleViewProps) {
  const [selectedBoss, setSelectedBoss] = useState&lt;Boss | null&gt;(null);
  const unlockNextBoss = useGameStore((state) =&gt; state.unlockNextBoss);

  const handleSelectBoss = (boss: Boss) =&gt; {
    setSelectedBoss(boss);
  };

  const handleBossVictory = () =&gt; {
    if (selectedBoss) {
      unlockNextBoss(selectedBoss.id);
    }
    setTimeout(() =&gt; {
      setSelectedBoss(null);
    }, 3000);
  };

  const handleBossDefeat = () =&gt; {
    setTimeout(() =&gt; {
      setSelectedBoss(null);
    }, 3000);
  };

  return (
    &lt;div className="min-h-screen bg-pixel-bg p-4"&gt;
      &lt;div className="mb-4"&gt;
        &lt;PixelButton variant="secondary" size="md" onClick={onBack}&gt;
          ← 返回
        &lt;/PixelButton&gt;
      &lt;/div&gt;
      &lt;motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      &gt;
        {selectedBoss ? (
          &lt;BossBattleComponent
            boss={selectedBoss}
            onClose={() =&gt; setSelectedBoss(null)}
            onVictory={handleBossVictory}
            onDefeat={handleBossDefeat}
          /&gt;
        ) : (
          &lt;BossSelect onSelectBoss={handleSelectBoss} /&gt;
        )}
      &lt;/motion.div&gt;
    &lt;/div&gt;
  );
}
```

- [ ] **Step 2: 创建 AdventureView**

```tsx
import { AdventureModePanel } from '../components/adventure';
import { PixelButton } from '../components/ui/PixelButton';

interface AdventureViewProps {
  onBack: () =&gt; void;
}

export function AdventureView({ onBack }: AdventureViewProps) {
  return (
    &lt;div className="min-h-screen bg-pixel-bg p-4"&gt;
      &lt;div className="mb-4"&gt;
        &lt;PixelButton variant="secondary" size="md" onClick={onBack}&gt;
          ← 返回
        &lt;/PixelButton&gt;
      &lt;/div&gt;
      &lt;AdventureModePanel onClose={onBack} /&gt;
    &lt;/div&gt;
  );
}
```

- [ ] **Step 3: 创建 ShowcaseView**

```tsx
import { ShowcasePage } from '../pages/ShowcasePage';
import { PixelButton } from '../components/ui/PixelButton';

interface ShowcaseViewProps {
  onBack: () =&gt; void;
}

export function ShowcaseView({ onBack }: ShowcaseViewProps) {
  return (
    &lt;div className="min-h-screen bg-pixel-bg"&gt;
      &lt;ShowcasePage onBack={onBack} /&gt;
    &lt;/div&gt;
  );
}
```

- [ ] **Step 4: 创建 ProfileView**

```tsx
import { ProfilePage } from '../pages/ProfilePage';
import { PixelButton } from '../components/ui/PixelButton';

interface ProfileViewProps {
  onBack: () =&gt; void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  return (
    &lt;div className="min-h-screen bg-pixel-bg"&gt;
      &lt;ProfilePage onBack={onBack} /&gt;
    &lt;/div&gt;
  );
}
```

---

## Task 4: 创建路由配置

**Files:**
- Create: `src/router/AppRouter.tsx`

- [ ] **Step 1: 创建 AppRouter 组件**

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { AppPage } from '../pages/AppPage';
import { MainView } from '../views/MainView';
import { BossBattleView } from '../views/BossBattleView';
import { AdventureView } from '../views/AdventureView';
import { ShowcaseView } from '../views/ShowcaseView';
import { ProfileView } from '../views/ProfileView';

export function AppRouter() {
  return (
    &lt;HashRouter&gt;
      &lt;Routes&gt;
        &lt;Route path="/" element={&lt;LandingPage /&gt;} /&gt;
        &lt;Route path="/app" element={&lt;AppPage /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/HashRouter&gt;
  );
}

export { MainView, BossBattleView, AdventureView, ShowcaseView, ProfileView };
```

---

## Task 5: 重构 App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 简化 App.tsx**

替换整个文件内容为：

```tsx
import { useEffect, useState } from 'react';
import { useCharacterStore } from './stores';
import { CharacterCreate } from './components/character';
import { Header } from './components/layout/Header';
import { MainView, ShowcaseView, ProfileView } from './router/AppRouter';

type AppMode = 'create' | 'main' | 'showcase' | 'profile';

function App() {
  const character = useCharacterStore((state) =&gt; state.character);
  const isCreating = useCharacterStore((state) =&gt; state.isCreating);
  const setIsCreating = useCharacterStore((state) =&gt; state.setIsCreating);

  const [appMode, setAppMode] = useState&lt;AppMode&gt;('main');

  useEffect(() =&gt; {
    if (!character &amp;&amp; !isCreating) {
      setIsCreating(true);
    }
  }, [character, isCreating, setIsCreating]);

  const handleCreateComplete = () =&gt; {
    setIsCreating(false);
    setAppMode('main');
  };

  if (!character || isCreating) {
    return (
      &lt;div className="min-h-screen bg-pixel-bg"&gt;
        &lt;CharacterCreate onComplete={handleCreateComplete} /&gt;
      &lt;/div&gt;
    );
  }

  return (
    &lt;div className="min-h-screen bg-pixel-bg"&gt;
      &lt;Header
        onShowcaseClick={() =&gt; setAppMode('showcase')}
        onProfileClick={() =&gt; setAppMode('profile')}
        onBackToMain={() =&gt; setAppMode('main')}
        showBackButton={appMode !== 'main'}
      /&gt;
      {appMode === 'main' &amp;&amp; (
        &lt;MainView
          onNavigateToShowcase={() =&gt; setAppMode('showcase')}
          onNavigateToProfile={() =&gt; setAppMode('profile')}
        /&gt;
      )}
      {appMode === 'showcase' &amp;&amp; (
        &lt;ShowcaseView onBack={() =&gt; setAppMode('main')} /&gt;
      )}
      {appMode === 'profile' &amp;&amp; (
        &lt;ProfileView onBack={() =&gt; setAppMode('main')} /&gt;
      )}
    &lt;/div&gt;
  );
}

export default App;
```

---

## Task 6: 更新 main.tsx

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1: 更新 main.tsx 使用新的 AppRouter**

替换内容为：

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router/AppRouter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  &lt;React.StrictMode&gt;
    &lt;AppRouter /&gt;
  &lt;/React.StrictMode&gt;,
);
```

---

## Task 7: 为 characterStore 添加持久化

**Files:**
- Modify: `src/stores/characterStore.ts`

- [ ] **Step 1: 读取现有 characterStore 内容**

先读取文件内容，然后添加 persist 中间件

- [ ] **Step 2: 更新 characterStore，添加 persist 中间件**

在 import 部分添加：
```typescript
import { persist } from 'zustand-persist';
```

然后将 create 调用包装在 persist 中：
```typescript
export const useCharacterStore = create&lt;CharacterStore &amp; CharacterActions&gt;()(
  persist(
    (set, get) =&gt; ({
      // ... 现有的 store 内容 ...
    }),
    {
      name: 'writequest-character',
      version: 1,
    }
  )
);
```

---

## Task 8: 为其他所有 store 添加持久化

**Files:**
- Modify: `src/stores/gameStore.ts`
- Modify: `src/stores/editorStore.ts`
- Modify: `src/stores/skillStore.ts`
- Modify: `src/stores/achievementStore.ts`
- Modify: `src/stores/mapStore.ts`
- Modify: `src/stores/storyStore.ts`
- Modify: `src/stores/collectionStore.ts`
- Modify: `src/stores/shopStore.ts`
- Modify: `src/stores/adventureStore.ts`
- Modify: `src/stores/heroStore.ts`
- Modify: `src/stores/showcaseStore.ts`
- Modify: `src/stores/userProfileStore.ts`

对于每个 store 文件：

- [ ] **Step 1: 添加 persist 导入**
```typescript
import { persist } from 'zustand-persist';
```

- [ ] **Step 2: 用 persist 包装 create 调用**
```typescript
export const useXxxStore = create&lt;...&gt;()(
  persist(
    (set, get) =&gt; ({
      // ... 现有内容 ...
    }),
    {
      name: 'writequest-xxx', // 唯一的名称
      version: 1,
    }
  )
);
```

每个 store 使用唯一的 name：
- gameStore: `writequest-game`
- editorStore: `writequest-editor`
- skillStore: `writequest-skill`
- achievementStore: `writequest-achievement`
- mapStore: `writequest-map`
- storyStore: `writequest-story`
- collectionStore: `writequest-collection`
- shopStore: `writequest-shop`
- adventureStore: `writequest-adventure`
- heroStore: `writequest-hero`
- showcaseStore: `writequest-showcase`
- userProfileStore: `writequest-userprofile`

---

## Task 9: 创建数据导出导入 store

**Files:**
- Create: `src/stores/useDataExportStore.ts`

- [ ] **Step 1: 创建 useDataExportStore**

```typescript
import { create } from 'zustand';
import { useCharacterStore } from './characterStore';
import { useGameStore } from './gameStore';
import { useEditorStore } from './editorStore';
import { useSkillStore } from './skillStore';
import { useAchievementStore } from './achievementStore';
import { useMapStore } from './mapStore';
import { useStoryStore } from './storyStore';
import { useCollectionStore } from './collectionStore';
import { useShopStore } from './shopStore';
import { useAdventureStore } from './adventureStore';
import { useHeroStore } from './heroStore';
import { useShowcaseStore } from './showcaseStore';
import { useUserProfileStore } from './userProfileStore';

interface ExportOptions {
  includeCharacter: boolean;
  includeGame: boolean;
  includeEditor: boolean;
  includeSkills: boolean;
  includeAchievements: boolean;
  includeMap: boolean;
  includeStory: boolean;
  includeCollection: boolean;
  includeShop: boolean;
  includeAdventure: boolean;
  includeHero: boolean;
  includeShowcase: boolean;
  includeUserProfile: boolean;
}

interface DataExportStore {
  exportOptions: ExportOptions;
  setExportOption: &lt;K extends keyof ExportOptions&gt;(key: K, value: boolean) =&gt; void;
  exportData: () =&gt; string;
  importData: (jsonString: string) =&gt; { success: boolean; error?: string };
  resetAllOptions: () =&gt; void;
}

const defaultExportOptions: ExportOptions = {
  includeCharacter: true,
  includeGame: true,
  includeEditor: true,
  includeSkills: true,
  includeAchievements: true,
  includeMap: true,
  includeStory: true,
  includeCollection: true,
  includeShop: true,
  includeAdventure: true,
  includeHero: true,
  includeShowcase: true,
  includeUserProfile: true,
};

export const useDataExportStore = create&lt;DataExportStore&gt;((set, get) =&gt; ({
  exportOptions: { ...defaultExportOptions },

  setExportOption: (key, value) =&gt;
    set((state) =&gt; ({
      exportOptions: { ...state.exportOptions, [key]: value },
    })),

  resetAllOptions: () =&gt;
    set({ exportOptions: { ...defaultExportOptions } }),

  exportData: () =&gt; {
    const options = get().exportOptions;
    const data: Record&lt;string, any&gt; = {
      version: 1,
      exportedAt: Date.now(),
    };

    if (options.includeCharacter) {
      data.character = useCharacterStore.getState();
    }
    if (options.includeGame) {
      data.game = useGameStore.getState();
    }
    if (options.includeEditor) {
      data.editor = useEditorStore.getState();
    }
    if (options.includeSkills) {
      data.skills = useSkillStore.getState();
    }
    if (options.includeAchievements) {
      data.achievements = useAchievementStore.getState();
    }
    if (options.includeMap) {
      data.map = useMapStore.getState();
    }
    if (options.includeStory) {
      data.story = useStoryStore.getState();
    }
    if (options.includeCollection) {
      data.collection = useCollectionStore.getState();
    }
    if (options.includeShop) {
      data.shop = useShopStore.getState();
    }
    if (options.includeAdventure) {
      data.adventure = useAdventureStore.getState();
    }
    if (options.includeHero) {
      data.hero = useHeroStore.getState();
    }
    if (options.includeShowcase) {
      data.showcase = useShowcaseStore.getState();
    }
    if (options.includeUserProfile) {
      data.userProfile = useUserProfileStore.getState();
    }

    return JSON.stringify(data, null, 2);
  },

  importData: (jsonString: string) =&gt; {
    try {
      const data = JSON.parse(jsonString);

      if (!data.version || data.version !== 1) {
        return { success: false, error: '不支持的数据版本' };
      }

      if (data.character) {
        const setState = useCharacterStore.getState();
        Object.assign(setState, data.character);
      }
      if (data.game) {
        const setState = useGameStore.getState();
        Object.assign(setState, data.game);
      }
      if (data.editor) {
        const setState = useEditorStore.getState();
        Object.assign(setState, data.editor);
      }
      if (data.skills) {
        const setState = useSkillStore.getState();
        Object.assign(setState, data.skills);
      }
      if (data.achievements) {
        const setState = useAchievementStore.getState();
        Object.assign(setState, data.achievements);
      }
      if (data.map) {
        const setState = useMapStore.getState();
        Object.assign(setState, data.map);
      }
      if (data.story) {
        const setState = useStoryStore.getState();
        Object.assign(setState, data.story);
      }
      if (data.collection) {
        const setState = useCollectionStore.getState();
        Object.assign(setState, data.collection);
      }
      if (data.shop) {
        const setState = useShopStore.getState();
        Object.assign(setState, data.shop);
      }
      if (data.adventure) {
        const setState = useAdventureStore.getState();
        Object.assign(setState, data.adventure);
      }
      if (data.hero) {
        const setState = useHeroStore.getState();
        Object.assign(setState, data.hero);
      }
      if (data.showcase) {
        const setState = useShowcaseStore.getState();
        Object.assign(setState, data.showcase);
      }
      if (data.userProfile) {
        const setState = useUserProfileStore.getState();
        Object.assign(setState, data.userProfile);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '导入失败' };
    }
  },
}));
```

---

## Task 10: 创建数据导出导入 UI 组件

**Files:**
- Create: `src/components/data/DataExportModal.tsx`
- Create: `src/components/data/DataImportModal.tsx`

- [ ] **Step 1: 创建 DataExportModal**

```tsx
import { useState } from 'react';
import { useDataExportStore } from '../../stores/useDataExportStore';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { X, Download } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () =&gt; void;
}

export function DataExportModal({ isOpen, onClose }: DataExportModalProps) {
  const { exportOptions, setExportOption, exportData, resetAllOptions } = useDataExportStore();
  const [exported, setExported] = useState(false);

  const handleExport = () =&gt; {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writequest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
  };

  const handleClose = () =&gt; {
    resetAllOptions();
    setExported(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    &lt;div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"&gt;
      &lt;PixelPanel className="max-w-md w-full max-h-[80vh] overflow-y-auto"&gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;h2 className="text-xl font-pixel text-white"&gt;导出数据&lt;/h2&gt;
          &lt;PixelButton variant="secondary" size="sm" onClick={handleClose}&gt;
            &lt;X size={16} /&gt;
          &lt;/PixelButton&gt;
        &lt;/div&gt;

        {exported ? (
          &lt;div className="text-center py-8"&gt;
            &lt;div className="text-green-400 text-4xl mb-4"&gt;✓&lt;/div&gt;
            &lt;p className="text-white mb-4"&gt;导出成功！&lt;/p&gt;
            &lt;PixelButton variant="primary" onClick={handleClose}&gt;
              关闭
            &lt;/PixelButton&gt;
          &lt;/div&gt;
        ) : (
          &lt;&gt;
            &lt;div className="space-y-3 mb-6"&gt;
              &lt;p className="text-gray-300 text-sm"&gt;选择要导出的数据：&lt;/p&gt;
              {Object.entries(exportOptions).map(([key, value]) =&gt; (
                &lt;label key={key} className="flex items-center gap-3 cursor-pointer"&gt;
                  &lt;input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =&gt; setExportOption(key as any, e.target.checked)}
                    className="w-4 h-4"
                  /&gt;
                  &lt;span className="text-gray-200 text-sm"&gt;
                    {key.replace('include', '')}
                  &lt;/span&gt;
                &lt;/label&gt;
              ))}
            &lt;/div&gt;
            &lt;div className="flex gap-3"&gt;
              &lt;PixelButton variant="secondary" onClick={handleClose} className="flex-1"&gt;
                取消
              &lt;/PixelButton&gt;
              &lt;PixelButton variant="primary" onClick={handleExport} className="flex-1"&gt;
                &lt;Download size={16} className="mr-2" /&gt;
                导出
              &lt;/PixelButton&gt;
            &lt;/div&gt;
          &lt;/&gt;
        )}
      &lt;/PixelPanel&gt;
    &lt;/div&gt;
  );
}
```

- [ ] **Step 2: 创建 DataImportModal**

```tsx
import { useState, useRef } from 'react';
import { useDataExportStore } from '../../stores/useDataExportStore';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { X, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () =&gt; void;
}

type ImportStatus = 'idle' | 'importing' | 'success' | 'error';

export function DataImportModal({ isOpen, onClose }: DataImportModalProps) {
  const { importData } = useDataExportStore();
  const [status, setStatus] = useState&lt;ImportStatus&gt;('idle');
  const [error, setError] = useState&lt;string&gt;('');
  const fileInputRef = useRef&lt;HTMLInputElement&gt;(null);

  const handleFileSelect = (e: React.ChangeEvent&lt;HTMLInputElement&gt;) =&gt; {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('importing');
    const reader = new FileReader();
    reader.onload = (event) =&gt; {
      try {
        const content = event.target?.result as string;
        const result = importData(content);
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setError(result.error || '导入失败');
        }
      } catch (err) {
        setStatus('error');
        setError('文件解析失败');
      }
    };
    reader.readAsText(file);
  };

  const handleClose = () =&gt; {
    setStatus('idle');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    &lt;div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"&gt;
      &lt;PixelPanel className="max-w-md w-full"&gt;
        &lt;div className="flex items-center justify-between mb-4"&gt;
          &lt;h2 className="text-xl font-pixel text-white"&gt;导入数据&lt;/h2&gt;
          &lt;PixelButton variant="secondary" size="sm" onClick={handleClose}&gt;
            &lt;X size={16} /&gt;
          &lt;/PixelButton&gt;
        &lt;/div&gt;

        {status === 'idle' &amp;&amp; (
          &lt;&gt;
            &lt;p className="text-gray-300 text-sm mb-4"&gt;
              选择要导入的备份文件（.json）
            &lt;/p&gt;
            &lt;div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4"&gt;
              &lt;input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              /&gt;
              &lt;Upload size={48} className="mx-auto text-gray-400 mb-4" /&gt;
              &lt;PixelButton
                variant="primary"
                onClick={() =&gt; fileInputRef.current?.click()}
              &gt;
                选择文件
              &lt;/PixelButton&gt;
            &lt;/div&gt;
            &lt;p className="text-yellow-400 text-xs"&gt;
              ⚠️ 警告：导入将覆盖现有数据
            &lt;/p&gt;
          &lt;/&gt;
        )}

        {status === 'importing' &amp;&amp; (
          &lt;div className="text-center py-8"&gt;
            &lt;div className="animate-spin w-8 h-8 border-2 border-pixel-primary border-t-transparent rounded-full mx-auto mb-4"&gt;&lt;/div&gt;
            &lt;p className="text-white"&gt;正在导入...&lt;/p&gt;
          &lt;/div&gt;
        )}

        {status === 'success' &amp;&amp; (
          &lt;div className="text-center py-8"&gt;
            &lt;CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" /&gt;
            &lt;p className="text-white mb-4"&gt;导入成功！&lt;/p&gt;
            &lt;PixelButton variant="primary" onClick={handleClose}&gt;
              关闭
            &lt;/PixelButton&gt;
          &lt;/div&gt;
        )}

        {status === 'error' &amp;&amp; (
          &lt;div className="text-center py-8"&gt;
            &lt;AlertCircle size={48} className="mx-auto text-red-400 mb-4" /&gt;
            &lt;p className="text-red-400 mb-2"&gt;导入失败&lt;/p&gt;
            &lt;p className="text-gray-400 text-sm mb-4"&gt;{error}&lt;/p&gt;
            &lt;div className="flex gap-3"&gt;
              &lt;PixelButton variant="secondary" onClick={handleClose} className="flex-1"&gt;
                关闭
              &lt;/PixelButton&gt;
              &lt;PixelButton
                variant="primary"
                onClick={() =&gt; setStatus('idle')}
                className="flex-1"
              &gt;
                重试
              &lt;/PixelButton&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        )}
      &lt;/PixelPanel&gt;
    &lt;/div&gt;
  );
}
```

---

## Task 11: 更新 Header 组件添加数据管理按钮

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: 添加导入导出按钮**

在 Header 组件中添加状态和 UI：
```tsx
import { useState } from 'react';
import { DataExportModal } from '../data/DataExportModal';
import { DataImportModal } from '../data/DataImportModal';
import { Database } from 'lucide-react';

// 在组件内添加：
const [showExportModal, setShowExportModal] = useState(false);
const [showImportModal, setShowImportModal] = useState(false);

// 在 UI 中添加按钮（在适当位置）：
&lt;div className="flex items-center gap-2"&gt;
  &lt;PixelButton
    variant="secondary"
    size="sm"
    onClick={() =&gt; setShowExportModal(true)}
    title="导出数据"
  &gt;
    &lt;Database size={16} /&gt;
  &lt;/PixelButton&gt;
&lt;/div&gt;

// 在组件末尾添加模态框：
&lt;DataExportModal isOpen={showExportModal} onClose={() =&gt; setShowExportModal(false)} /&gt;
&lt;DataImportModal isOpen={showImportModal} onClose={() =&gt; setShowImportModal(false)} /&gt;
```

同时添加一个下拉菜单或者额外的导入按钮。

---

## Task 12: 测试和验证

**Files:**
- Run: `npm run dev`

- [ ] **Step 1: 启动开发服务器**

```bash
cd d:\产品\writequest
npm run dev
```

- [ ] **Step 2: 验证应用正常启动**

在浏览器中打开应用，检查：
- 页面正常加载
- 现有功能正常工作
- 没有控制台错误

- [ ] **Step 3: 测试数据持久化**

1. 进行一些操作（写作、升级等）
2. 刷新页面
3. 验证数据被正确保存和恢复

- [ ] **Step 4: 测试数据导出**

1. 点击导出按钮
2. 选择要导出的数据
3. 下载文件
4. 验证文件内容正确

- [ ] **Step 5: 测试数据导入**

1. 修改一些数据
2. 点击导入按钮
3. 选择之前导出的文件
4. 验证数据被正确恢复

---

## Task 13: 提交更改

**Files:**
- Git

- [ ] **Step 1: 检查 git 状态**

```bash
cd d:\产品\writequest
git status
```

- [ ] **Step 2: 添加更改**

```bash
git add .
```

- [ ] **Step 3: 提交**

```bash
git commit -m "feat: 重构架构并添加数据持久化

- 提取视图组件到独立文件
- 添加 React Router 配置
- 为所有 store 添加持久化
- 实现数据导出/导入功能
- 更新 Header 添加数据管理按钮"
```

---

## 计划完成！

计划 1 已完整创建。接下来你可以选择：

**1. Subagent-Driven (推荐)** - 我为每个任务调度独立的子代理，分阶段审查和实现

**2. Inline Execution** - 在当前会话中执行任务，批量执行带检查点

你想使用哪种方式？

