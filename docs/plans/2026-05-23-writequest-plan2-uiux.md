# WriteQuest 第一轮迭代 - 计划 2：UI/UX 改进

## 概述

本计划包含响应式优化和新手引导教程两个主要功能模块。

## 文件结构

### 新建文件：
- `src/components/tutorial/TutorialModal.tsx` - 新手引导模态框
- `src/components/tutorial/TutorialStep.tsx` - 单个引导步骤组件
- `src/components/tutorial/index.ts` - 引导组件导出文件
- `src/hooks/useTutorial.ts` - 教程状态管理 Hook
- `src/stores/useTutorialStore.ts` - 教程状态管理 Store

### 修改文件：
- `src/components/layout/Header.tsx` - 添加新手引导按钮
- `src/views/MainView.tsx` - 添加响应式优化

---

## Task 1: 创建教程状态管理

### 1.1 创建 useTutorialStore

文件：`src/stores/useTutorialStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TutorialStep = 'welcome' | 'character' | 'editor' | 'quests' | 'boss' | 'complete';

interface TutorialStore {
  completed: boolean;
  currentStep: TutorialStep | null;
  setCurrentStep: (step: TutorialStep | null) => void;
  markComplete: () => void;
  reset: () => void;
}

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set) => ({
      completed: false,
      currentStep: null,
      setCurrentStep: (step) => set({ currentStep: step }),
      markComplete: () => set({ completed: true, currentStep: null }),
      reset: () => set({ completed: false, currentStep: 'welcome' }),
    }),
    {
      name: 'writequest-tutorial',
    }
  )
);
```

### 1.2 更新 stores/index.ts

将 `useTutorialStore` 添加到导出列表中。

---

## Task 2: 创建新手引导组件

### 2.1 创建 TutorialStep 组件

文件：`src/components/tutorial/TutorialStep.tsx`

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { ScrollText, PenTool, Target, Zap, CheckCircle2 } from 'lucide-react';

interface TutorialStepProps {
  step: string;
  title: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
  isLast?: boolean;
}

const stepIcons: Record<string, React.ReactNode> = {
  welcome: <ScrollText size={32} />,
  character: <PenTool size={32} />,
  editor: <ScrollText size={32} />,
  quests: <Target size={32} />,
  boss: <Zap size={32} />,
  complete: <CheckCircle2 size={32} />,
};

export function TutorialStep({ step, title, description, onNext, onSkip, isLast = false }: TutorialStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <div className="text-pixel-primary mb-4">
        {stepIcons[step] || <ScrollText size={32} />}
      </div>
      <h3 className="font-pixel text-xl text-white mb-3">{title}</h3>
      <p className="text-gray-300 mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex gap-3 justify-center">
        {!isLast && (
          <PixelButton variant="secondary" onClick={onSkip}>
            跳过教程
          </PixelButton>
        )}
        <PixelButton variant="primary" onClick={onNext}>
          {isLast ? '开始冒险！' : '下一步'}
        </PixelButton>
      </div>
    </motion.div>
  );
}
```

### 2.2 创建 TutorialModal 组件

文件：`src/components/tutorial/TutorialModal.tsx`

```typescript
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTutorialStore } from '../../stores';
import { TutorialStep } from './TutorialStep';
import { PixelPanel } from '../ui/PixelPanel';
import { X } from 'lucide-react';

const steps = [
  {
    id: 'welcome',
    title: '欢迎来到 WriteQuest！',
    description: '这是一个将写作变成冒险游戏的应用。让我们快速了解一下如何使用它！',
  },
  {
    id: 'character',
    title: '创建你的角色',
    description: '首先创建属于你的冒险者角色，选择一个职业开始你的旅程。你的角色会随着写作不断成长！',
  },
  {
    id: 'editor',
    title: '开始写作',
    description: '使用编辑器写下你的故事。每写一个字都会让你的角色获得经验值和金币！',
  },
  {
    id: 'quests',
    title: '完成每日任务',
    description: '每天都有新的任务等待你完成。完成任务可以获得额外奖励！',
  },
  {
    id: 'boss',
    title: '挑战 Boss',
    description: '通过写作积累力量，挑战强大的 Boss，解锁更多内容！',
  },
  {
    id: 'complete',
    title: '准备好了！',
    description: '你已经了解了 WriteQuest 的基本玩法。现在开始你的写作冒险吧！',
  },
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const { currentStep, setCurrentStep, markComplete } = useTutorialStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (isOpen && !currentStep) {
      setCurrentStep('welcome');
      setCurrentIndex(0);
    }
  }, [isOpen, currentStep, setCurrentStep]);

  if (!isOpen) return null;

  const currentStepData = steps[currentIndex];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentStep(steps[nextIndex].id as any);
    } else {
      markComplete();
      onClose();
    }
  };

  const handleSkip = () => {
    markComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <PixelPanel className="max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 进度指示器 */}
        <div className="flex gap-1 justify-center mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentIndex ? 'w-8 bg-pixel-primary' : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TutorialStep
              step={currentStepData.id}
              title={currentStepData.title}
              description={currentStepData.description}
              onNext={handleNext}
              onSkip={handleSkip}
              isLast={currentIndex === steps.length - 1}
            />
          </motion.div>
        </AnimatePresence>
      </PixelPanel>
    </div>
  );
}
```

### 2.3 创建组件导出文件

文件：`src/components/tutorial/index.ts`

```typescript
export { TutorialModal } from './TutorialModal';
export { TutorialStep } from './TutorialStep';
```

---

## Task 3: 响应式优化

### 3.1 更新 MainView 组件的响应式布局

文件：`src/views/MainView.tsx`

我们需要对 MainView 进行以下修改：

1. 添加移动端底部导航栏
2. 优化小屏幕布局
3. 将侧边栏改为可收起的抽屉

修改要点：
- 添加 `isMobile` 检测
- 添加 `sidebarOpen` 状态
- 添加移动端底部导航
- 在小屏幕上调整布局

让我们修改现有的 MainView 组件（只显示新增的部分）：

```typescript
// 在文件顶部添加：
import { useMediaQuery } from '../hooks/useMediaQuery';

// 在组件内部添加：
const isMobile = useMediaQuery('(max-width: 768px)');
const [sidebarOpen, setSidebarOpen] = useState(false);

// 在 JSX 中添加条件渲染
// 将侧边栏包裹在条件中
// 添加底部导航栏
```

### 3.2 创建 useMediaQuery Hook

文件：`src/hooks/useMediaQuery.ts`

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}
```

### 3.3 创建 hooks 导出文件

文件：`src/hooks/index.ts`

```typescript
export { useMediaQuery } from './useMediaQuery';
```

---

## Task 4: 更新 Header 添加新手引导按钮

修改 `src/components/layout/Header.tsx`，添加：
1. 新手引导按钮
2. 导入 TutorialModal

新增代码部分：
```typescript
import { TutorialModal } from '../tutorial';
import { useTutorialStore } from '../../stores';
import { HelpCircle } from 'lucide-react';

// 在组件中添加
const { completed: tutorialCompleted, reset: resetTutorial } = useTutorialStore();
const [showTutorial, setShowTutorial] = useState(false);

// 在按钮区域添加
{character && (
  <PixelButton
    variant="secondary"
    size="sm"
    onClick={() => setShowTutorial(true)}
    className="p-2"
    title="新手引导"
  >
    <HelpCircle size={16} />
  </PixelButton>
)}

// 在组件末尾添加
<TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

// 在 useEffect 中检查是否需要自动显示教程
useEffect(() => {
  if (character && !tutorialCompleted) {
    setShowTutorial(true);
  }
}, [character, tutorialCompleted]);
```

---

## Task 5: 创建响应式抽屉侧边栏

让我们创建一个可复用的侧边栏抽屉组件。

文件：`src/components/ui/SidebarDrawer.tsx`

```typescript
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PixelButton } from './PixelButton';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function SidebarDrawer({ isOpen, onClose, title, children }: SidebarDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* 抽屉 */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-pixel-panel border-r-2 border-pixel-border z-50 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                {title && <h3 className="font-pixel text-white">{title}</h3>}
                <PixelButton variant="secondary" size="sm" onClick={onClose}>
                  <X size={16} />
                </PixelButton>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## Task 6: 创建移动端底部导航栏

文件：`src/components/layout/MobileBottomNav.tsx`

```typescript
import React from 'react';
import { Home, PenTool, Zap, Sparkles, User } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';

type NavItem = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

interface MobileBottomNavProps {
  onNavigateToMain: () => void;
  onNavigateToBoss: () => void;
  onNavigateToShowcase: () => void;
  onNavigateToProfile: () => void;
  activeView?: string;
}

export function MobileBottomNav({
  onNavigateToMain,
  onNavigateToBoss,
  onNavigateToShowcase,
  onNavigateToProfile,
  activeView,
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-pixel-panel border-t-2 border-pixel-border z-40 md:hidden">
      <div className="flex justify-around py-2">
        <PixelButton
          variant={activeView === 'main' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToMain}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <Home size={18} />
          <span className="text-xs">首页</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'boss' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToBoss}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <Zap size={18} />
          <span className="text-xs">Boss</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'showcase' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToShowcase}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <Sparkles size={18} />
          <span className="text-xs">广场</span>
        </PixelButton>
        
        <PixelButton
          variant={activeView === 'profile' ? 'primary' : 'secondary'}
          size="sm"
          onClick={onNavigateToProfile}
          className="flex flex-col items-center gap-1 py-2 px-3"
        >
          <User size={18} />
          <span className="text-xs">我的</span>
        </PixelButton>
      </div>
    </div>
  );
}
```

---

## Task 7: 更新 ui 组件导出文件

修改 `src/components/ui/index.ts`，添加新组件：

```typescript
export { SidebarDrawer } from './SidebarDrawer';
```

---

## Task 8: 创建 layout 组件导出文件

文件：`src/components/layout/index.ts`

```typescript
export { Header } from './Header';
export { MobileBottomNav } from './MobileBottomNav';
```

---

## Task 9: 完整重构 MainView 的响应式版本

现在让我们创建完整的响应式 MainView 组件。由于文件内容较多，让我们创建一个全新的完整版本。

修改 `src/views/MainView.tsx`，添加完整的响应式支持，包括：
- 移动设备检测
- 侧边栏抽屉
- 底部导航
- 响应式布局调整

---

## 验证检查清单

- [ ] 新手引导在首次加载时自动显示
- [ ] 引导步骤正确显示和切换
- [ ] 可以跳过或完成引导
- [ ] 引导完成后不再自动显示
- [ ] 可以从 Header 重新打开引导
- [ ] 在移动端显示底部导航栏
- [ ] 在移动端侧边栏变为抽屉
- [ ] 布局在不同屏幕尺寸下都正常
- [ ] 触摸目标大小合适
