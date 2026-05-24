# WriteQuest v2.0 - Community Upgrade - Product Requirement Document

## Overview
- **Summary**: WriteQuest v2.0 是一次重大更新，重点在于完善社区互动、增加写作辅助工具、修复现有问题并优化用户体验。
- **Purpose**: 解决当前版本的痛点问题（特别是登录/注册流程不稳定），并通过丰富的社区功能和写作工具提升用户留存和活跃度。
- **Target Users**: 喜欢用 RPG 游戏化方式写作的创作者，包括小说作者、学生、写作爱好者等。

## Goals
- [P0] 完善社区互动功能（评论、点赞、关注作者）
- [P0] 新增写作模板和提示生成
- [P0] 修复现有 bug 并进行性能优化
- [P0] 提升移动端用户体验
- [P1] 实现组队/公会系统
- [P1] 增加写作统计仪表板

## Non-Goals (Out of Scope)
- 此次版本不实现实时聊天功能
- 不进行大规模 UI 重新设计（保持现有设计风格）
- 不增加全新的 RPG 系统（如宠物进化等）

## Background & Context
- 当前版本已拥有完整的 RPG 写作框架：角色系统、技能树、Boss 战斗、成就系统、每日任务等
- 社区模块已初步实现（作品展示和发布），但互动功能（评论、点赞、关注）尚未完整实现
- 存在一些稳定性问题（如用户反馈的注册/登录白屏）
- 移动端适配还有提升空间

## Functional Requirements

### P0 功能
- **FR-1**: 用户可以对作品点赞/取消点赞
- **FR-2**: 用户可以在作品下发表评论，支持回复评论
- **FR-3**: 用户可以关注/取消关注其他作者
- **FR-4**: 用户可以在个人资料页查看自己的粉丝和关注列表
- **FR-5**: 提供内置的写作模板库（小说、散文、日记等）
- **FR-6**: 提供 AI 写作提示生成功能（基于主题、风格等参数）
- **FR-7**: 作品支持添加分类标签和封面图片
- **FR-8**: 修复登录/注册流程问题
- **FR-9**: 优化移动端布局和交互
- **FR-10**: 清理长期存在的 bug

### P1 功能
- **FR-11**: 用户可以创建或加入公会
- **FR-12**: 用户可以组队进行写作挑战
- **FR-13**: 提供个人写作统计仪表板（字数、作品数量、连续写作天数等）
- **FR-14**: 实现写作进度可视化图表

## Non-Functional Requirements
- **NFR-1**: 页面加载时间 < 2s（移动端和桌面端）
- **NFR-2**: 移动端触摸交互响应时间 < 100ms
- **NFR-3**: 所有新功能有良好的 TypeScript 类型覆盖
- **NFR-4**: 社区互动实时更新（无需刷新页面）

## Constraints
- **Technical**: 继续使用现有的技术栈（React + TypeScript + Supabase + Tailwind CSS）
- **Business**: 需要保持与现有用户数据的兼容性
- **Dependencies**: 依赖 Supabase 的数据库和认证功能

## Assumptions
- Supabase 服务稳定可用
- 用户能够接受适度的视觉变化（保持现有设计风格）
- 现有代码库可以在不进行大规模重构的情况下添加新功能

## Acceptance Criteria

### AC-1: 作品点赞功能
- **Given**: 用户已登录并查看某个公开作品
- **When**: 用户点击点赞按钮
- **Then**: 作品点赞数 +1，按钮状态变为已点赞
- **Verification**: `programmatic`

### AC-2: 评论功能
- **Given**: 用户已登录并查看某个公开作品
- **When**: 用户在评论框输入内容并提交
- **Then**: 评论立即显示在作品下方，包含用户头像和时间戳
- **Verification**: `programmatic`

### AC-3: 关注作者功能
- **Given**: 用户已登录并查看某个作者的个人资料
- **When**: 用户点击关注按钮
- **Then**: 按钮状态变为已关注，关注数 +1
- **Verification**: `programmatic`

### AC-4: 写作模板库
- **Given**: 用户正在编辑器中
- **When**: 用户点击"插入模板"
- **Then**: 显示模板选择器，用户选择模板后内容插入编辑器
- **Verification**: `human-judgment`

### AC-5: AI 写作提示生成
- **Given**: 用户在写作提示生成页面
- **When**: 用户输入主题、风格等参数并点击生成
- **Then**: 显示 3-5 个写作提示供选择
- **Verification**: `human-judgment`

### AC-6: 登录流程稳定性
- **Given**: 用户在登录页面
- **When**: 用户输入正确/错误的凭据
- **Then**: 正确反馈结果，不会出现白屏
- **Verification**: `programmatic`

### AC-7: 移动端体验
- **Given**: 用户在移动设备上使用应用
- **When**: 用户进行各种操作
- **Then**: 布局自适应，按钮大小合适，无横向滚动
- **Verification**: `human-judgment`

### AC-8: 公会系统 (P1)
- **Given**: 用户已登录
- **When**: 用户创建公会或申请加入公会
- **Then**: 流程顺利完成，公会信息正确显示
- **Verification**: `human-judgment`

### AC-9: 写作统计仪表板 (P1)
- **Given**: 用户进入统计页面
- **When**: 页面加载
- **Then**: 显示清晰的统计图表和数据
- **Verification**: `human-judgment`

## Open Questions
- [ ] AI 写作提示是通过内置简单逻辑还是调用外部 API 实现？
- [ ] 公会系统是否需要包含公会任务或公会排行榜？
- [ ] 是否需要通知系统（新点赞、新评论、新粉丝）？
