# WriteQuest Plan 3 - 写作功能增强

> **日期：** 2026-05-23  
> **目标：** 完善文档管理、添加 Markdown 支持、实现 AI 老爷爷助手

---

## 概述

本次计划实现写作功能的三大核心增强：
1. **完善文档管理系统** - 更好的文档组织和管理界面
2. **Markdown 支持** - 分屏编辑预览、工具栏
3. **AI 老爷爷助手** - 写作辅导、灵感生成

---

## 一、文档管理系统增强

### 1.1 创建文档管理组件

**新建文件：**
- `src/components/editor/DocumentManager.tsx` - 文档管理主面板
- `src/components/editor/DocumentList.tsx` - 文档列表
- `src/components/editor/DocumentItem.tsx` - 单个文档项

**功能说明：**
- 文档列表展示（标题、字数、更新时间）
- 创建新文档
- 重命名文档
- 删除文档（带确认）
- 切换活跃文档
- 搜索和筛选

### 1.2 增强编辑器工具栏

**修改文件：**
- `src/components/editor/WritingEditor.tsx`

**添加功能：**
- 文档切换下拉菜单
- 快速保存按钮
- 文档信息展示

---

## 二、Markdown 支持

### 2.1 安装依赖

```bash
npm install react-markdown remark-gfm
```

### 2.2 创建 Markdown 相关组件

**新建文件：**
- `src/components/editor/MarkdownEditor.tsx` - Markdown 编辑器（分屏）
- `src/components/editor/MarkdownToolbar.tsx` - Markdown 工具栏
- `src/components/editor/MarkdownPreview.tsx` - Markdown 预览组件

### 2.3 工具栏功能

**按钮功能：**
- 加粗 (Ctrl+B)
- 斜体 (Ctrl+I)
- 标题 (H1-H3)
- 有序/无序列表
- 链接
- 图片
- 引用
- 代码块
- 分屏切换（编辑/预览/分屏）

---

## 三、AI 老爷爷助手

### 3.1 创建类型定义

**新建/修改文件：**
- `src/types/index.ts` - 添加 Mentor 相关类型

```typescript
interface Mentor {
  id: string;
  name: string;
  personality: 'wise' | 'strict' | 'friendly';
  unlocked: boolean;
  avatar: string;
}

interface MentorMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  timestamp: number;
}
```

### 3.2 创建 Mentor Store

**新建文件：**
- `src/stores/useMentorStore.ts`

**功能：**
- 管理对话历史
- 每日免费次数
- 金币消耗
- 模拟 AI 回复（第一版用预设回复）

### 3.3 创建 UI 组件

**新建文件：**
- `src/components/mentor/MentorChat.tsx` - 聊天主界面
- `src/components/mentor/MentorAvatar.tsx` - 老爷爷头像
- `src/components/mentor/MentorButton.tsx` - 触发按钮
- `src/components/mentor/MentorQuickReply.tsx` - 快捷回复

---

## 实现顺序

1. ✅ **检查现有功能** - 确认哪些已经实现
2. 📝 **文档管理 UI 增强** - 创建 DocumentManager 组件
3. 📄 **Markdown 支持** - 添加编辑器和预览
4. 🧙 **AI 老爷爷** - 实现助手系统

---

## 验收标准

- [ ] 文档管理面板可正常使用
- [ ] Markdown 编辑和预览正常
- [ ] AI 老爷爷聊天界面流畅
- [ ] 所有功能保持向后兼容
