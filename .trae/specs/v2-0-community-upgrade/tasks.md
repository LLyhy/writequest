# WriteQuest v2.0 - Community Upgrade - 实现计划

## 任务优先级概述

### P0 - 必须实现的核心功能
1. 修复登录/注册白屏问题
2. 完善评论/点赞/关注功能
3. 写作模板和提示生成
4. 移动端体验优化
5. Bug 修复和性能优化

### P1 - 重要功能
1. 组队/公会系统
2. 写作统计仪表板

---

## Phase 1: 稳定性和基础修复 (P0)

### Task 1.1: 修复登录/注册白屏问题
- **Priority**: P0
- **Files**:
  - Modify: `src/stores/authStore.ts`
  - Modify: `src/stores/userProfileStore.ts`
  - Review: `src/services/supabaseService.ts`
- **Description**: 确保认证流程的稳定性，添加更好的错误处理
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - 验证注册流程能正常创建用户和 profile
  - 验证登录流程在成功/失败情况下都能正确反馈
  - 验证注销流程不会导致白屏

### Task 1.2: 完善 Supabase 数据库策略和触发器
- **Priority**: P0
- **Files**:
  - Create/Update: `docs/SUPABASE_INIT_v2.sql`
- **Description**: 更新数据库初始化脚本，添加必要的策略和触发器
- **Acceptance Criteria Addressed**: AC-6

---

## Phase 2: 社区互动功能 (P0)

### Task 2.1: 实现作品点赞功能
- **Priority**: P0
- **Files**:
  - Modify: `src/types/showcase.ts`
  - Modify: `src/stores/showcaseStore.ts`
  - Create: `src/components/showcase/LikeButton.tsx`
  - Modify: `src/components/showcase/WorkCard.tsx` (或类似文件)
  - Modify: `src/views/ShowcaseView.tsx`
- **Description**: 实现作品点赞/取消点赞的完整流程
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - 点击点赞按钮后点赞数增加
  - 再次点击取消点赞
  - 状态在刷新后保持

### Task 2.2: 实现评论功能
- **Priority**: P0
- **Files**:
  - Modify: `src/types/showcase.ts` (Comment 类型)
  - Modify: `src/stores/showcaseStore.ts`
  - Create: `src/components/showcase/CommentSection.tsx`
  - Create: `src/components/showcase/CommentInput.tsx`
- **Description**: 实现评论发表、查看、回复功能
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - 登录用户可以发表评论
  - 评论显示用户头像和时间
  - 支持回复特定评论

### Task 2.3: 实现关注作者功能
- **Priority**: P0
- **Files**:
  - Modify: `src/types/showcase.ts` (UserProfile 类型确认)
  - Modify: `src/stores/userProfileStore.ts`
  - Create: `src/components/profile/FollowButton.tsx`
  - Modify: `src/views/ProfileView.tsx`
- **Description**: 实现关注/取消关注作者功能
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - 可以在作者资料页点击关注
  - 关注数实时更新
  - 个人资料页显示粉丝和关注列表

### Task 2.4: 作品标签和分类优化
- **Priority**: P0
- **Files**:
  - Modify: `src/types/showcase.ts`
  - Modify: `src/components/showcase/PublishModal.tsx`
  - Modify: `src/views/ShowcaseView.tsx`
- **Description**: 优化作品发布时的标签选择，支持按标签筛选作品
- **Acceptance Criteria Addressed**: FR-7

---

## Phase 3: 写作辅助工具 (P0)

### Task 3.1: 写作模板库
- **Priority**: P0
- **Files**:
  - Create: `src/constants/writingTemplates.ts`
  - Create: `src/components/editor/TemplateSelector.tsx`
  - Modify: `src/components/editor/index.ts` (或 Editor 组件)
- **Description**: 内置多种写作模板（小说、散文、日记等）
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - 用户可以在编辑器中选择模板
  - 模板正确插入到编辑器中
  - 提供足够的模板类型

### Task 3.2: AI 写作提示生成 (简单版本)
- **Priority**: P0
- **Files**:
  - Create: `src/services/promptGenerator.ts`
  - Create: `src/components/editor/PromptGenerator.tsx`
- **Description**: 内置简单的写作提示生成逻辑（非外部 API）
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - 基于用户输入生成相关提示
  - 提供多个提示选项
  - 可以一键插入到编辑器

---

## Phase 4: 移动端体验优化 (P0)

### Task 4.1: 响应式布局优化
- **Priority**: P0
- **Files**:
  - Review/Modify: `src/components/layout/index.ts`
  - Review/Modify: `src/hooks/useMediaQuery.ts`
  - Review all views: `src/views/*.tsx`
- **Description**: 优化所有页面的移动端显示
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - 移动端无横向滚动
  - 按钮大小合适
  - 关键信息可见

### Task 4.2: 触摸交互优化
- **Priority**: P0
- **Files**:
  - Review main UI components
- **Description**: 确保触摸交互流畅
- **Acceptance Criteria Addressed**: AC-7

---

## Phase 5: Bug 修复和性能优化 (P0)

### Task 5.1: Bug 扫荡
- **Priority**: P0
- **Files**:
  - Check all components and stores
- **Description**: 修复已知 bug，添加错误边界
- **Acceptance Criteria Addressed**: FR-10

### Task 5.2: 性能优化
- **Priority**: P0
- **Files**:
  - Review: `vite.config.ts`
  - Review main components
- **Description**: 优化加载速度，添加加载状态
- **Acceptance Criteria Addressed**: NFR-1

---

## Phase 6: P1 功能

### Task 6.1: 写作统计仪表板
- **Priority**: P1
- **Files**:
  - Create: `src/types/stats.ts`
  - Create: `src/stores/statsStore.ts`
  - Create: `src/views/StatsView.tsx`
  - Create: `src/components/stats/*.tsx`
- **Description**: 实现写作统计和可视化
- **Acceptance Criteria Addressed**: AC-9

### Task 6.2: 公会系统基础
- **Priority**: P1
- **Files**:
  - Create: `src/types/guild.ts`
  - Create: `src/stores/guildStore.ts`
  - Create: `src/views/GuildView.tsx`
  - Create: `src/components/guild/*.tsx`
- **Description**: 实现基础的公会创建和加入功能
- **Acceptance Criteria Addressed**: AC-8

---

## 部署计划
- 每个 Phase 完成后可以进行小规模测试
- P0 全部完成后发布 v2.0 beta
- 根据反馈调整，然后发布正式版
