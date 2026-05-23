# WriteQuest 第一轮优化设计文档

**日期：** 2026-05-23
**版本：** v1.0
**状态：** 设计完成，待实现

---

## 概述

本次迭代采用"平衡发展策略"，同时包含基础架构优化、用户体验提升、写作功能增强和游戏化新玩法。

### 本次迭代范围
- ✅ 架构重构（App.tsx 解耦 + Store 持久化）
- ✅ UI/UX 改进（响应式优化 + 新手引导）
- ✅ 写作功能（文档管理 + Markdown + AI 老爷爷）
- ✅ 游戏化增强（宠物系统 + 每周排行榜）

---

## 一、架构设计

### 1.1 App.tsx 重构

**现状问题：**
- [App.tsx](d:\产品\writequest\src\App.tsx) 有 500+ 行代码
- 所有视图管理逻辑混在一起
- 难以维护和扩展

**重构方案：**

```
src/
├── views/                    # 新建：视图容器
│   ├── MainView.tsx         # 主视图（原 App.tsx 主要内容）
│   ├── BossBattleView.tsx   # Boss 战视图
│   ├── AdventureView.tsx    # 冒险模式视图
│   ├── ShowcaseView.tsx     # 广场视图
│   └── ProfileView.tsx      # 个人主页视图
├── router/                   # 新建：路由管理
│   └── AppRouter.tsx        # 路由配置
└── App.tsx                   # 简化：只负责初始化和错误边界
```

**主要改动：**
- 提取视图状态管理到各自的 View 组件
- 使用 React Router 替代内部状态管理的视图切换
- 保持所有现有功能不变，确保向后兼容

### 1.2 Zustand Store 优化

**新增依赖：**
```json
{
  "zustand-persist": "^4.x"
}
```

**优化内容：**

1. **持久化中间件**
   - 为所有 store 添加 `persist` 中间件
   - 存储到 localStorage
   - 支持版本迁移机制

2. **数据导出/导入**
   - 创建 `useDataExportStore`
   - 导出格式：JSON
   - 支持选择性导出（角色数据、写作内容、设置等）
   - 导入时做数据验证

3. **性能优化**
   - 使用 `shallow` 比较减少不必要的重渲染
   - 拆分大型 store 为更小的单元
   - 添加 `useMemo` 和 `useCallback` 优化

---

## 二、UI/UX 设计

### 2.1 响应式优化

**断点设计：**
- < 640px：移动端（垂直布局 + 底部导航）
- 640-1024px：平板端（混合布局）
- > 1024px：桌面端（现有布局）

**移动端布局：**
```
┌─────────────────┐
│     Header      │
├─────────────────┤
│                 │
│   主内容区域    │
│                 │
├─────────────────┤
│  底部导航栏     │
└─────────────────┘
```

**底部导航项：**
- 🏠 主页
- ✍️ 编辑器
- ⚔️ Boss
- 🏆 广场
- 👤 我的

**左侧面板改为抽屉：**
- 从左侧滑出
- 包含：角色信息、任务、功能按钮等

### 2.2 新手引导教程

**技术选型：** `react-joyride`

**引导步骤：**
1. **角色创建** - 介绍职业选择和基础设定
2. **编辑器入门** - 展示字数统计、保存、基本操作
3. **任务系统** - 介绍每日任务和奖励机制
4. **Boss 战** - 演示如何挑战和胜利条件
5. **功能概览** - 快速浏览其他功能入口

**持久化：**
- 在 `useGameStore` 中记录引导完成状态
- Header 添加"帮助"按钮，可重新触发引导
- 支持随时跳过

---

## 三、写作功能设计

### 3.1 文档管理系统

**新增类型：**
```typescript
interface Document {
  id: string;
  title: string;
  description?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  isActive: boolean;
}
```

**新增 Store：** `useDocumentStore`

**功能：**
- 创建新文档
- 切换活跃文档
- 编辑文档元信息
- 删除文档（带确认）
- 文档列表视图

**UI 位置：**
- 编辑器顶部添加文档切换下拉菜单
- 新增"文档管理"页面（通过左侧面板访问）

### 3.2 Markdown 支持

**新增依赖：**
```json
{
  "react-markdown": "^9.x",
  "remark-gfm": "^4.x"
}
```

**功能：**
- 分屏预览模式（编辑 | 预览）
- Markdown 工具栏：
  - 加粗、斜体、下划线
  - H1-H3 标题
  - 有序/无序列表
  - 链接、图片
  - 引用、代码块
- 纯文本模式切换
- 导出 .md 文件

### 3.3 🧙‍♂️ 戒指里的老爷爷 AI 助手

**角色设定：**
- 名字：玄机子（或用户自定义）
- 性格：幽默、智慧、偶尔唠叨
- 住在一枚神秘的古戒里

**新增类型：**
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

**新增 Store：** `useMentorStore`

**功能：**
1. **触发方式：**
   - 编辑器右下角戒指图标按钮
   - 选中文本 → 右键/快捷菜单 → "问老爷爷"
   - 写作停滞 > 5 分钟 → 主动提示

2. **交互类型：**
   - 💡 灵感生成："接下来怎么写？"
   - ✍️ 润色建议："这段帮我改改"
   - 🤔 内容答疑："这里合理吗？"
   - 🎯 目标提醒："今天还差 X 字！"

3. **经济系统：**
   - 每次咨询消耗 5-20 金币（根据问题复杂度）
   - 每日 3 次免费咨询
   - 解锁不同性格的老爷爷需要达成特定成就

**UI 设计：**
- 浮动聊天窗口（可最小化）
- 像素风格老爷爷头像
- 打字机效果显示回复
- 快速回复按钮

---

## 四、游戏化增强设计

### 4.1 🐾 写作伙伴/宠物系统

**新增类型：**
```typescript
type PetType = 'dragon' | 'cat' | 'owl' | 'fox' | 'wolf';

interface Pet {
  id: string;
  type: PetType;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  happiness: number; // 0-100
  equipped: boolean;
  skills: PetSkill[];
}

interface PetSkill {
  id: string;
  name: string;
  description: string;
  effect: {
    type: 'expBonus' | 'coinBonus' | 'bossDamage' | 'streakBonus';
    value: number;
  };
  unlocked: boolean;
}
```

**新增 Store：** `usePetStore`

**宠物类型及加成：**

| 宠物 | 图标 | 被动效果 |
|------|------|----------|
| 🐉 小龙 | 🔥 | Boss 战攻击力 +15% |
| 🐱 猫咪 | 😺 | 连续写作奖励 +20% |
| 🦉 猫头鹰 | 📚 | 经验获取 +10% |
| 🦊 狐狸 | ✨ | 金币掉落 +15% |
| 🐺 狼 | 🌙 | 夜间写作（20:00-6:00）所有奖励 +25% |

**功能：**
- 初始解锁 1 只宠物，其他通过成就/商店解锁
- 宠物经验 = 写作字数 / 10
- 升级解锁新外观和技能
- 互动：
  - 点击宠物 → 玩耍（恢复快乐值）
  - 喂食（消耗金币，恢复快乐值）
  - 快乐值满时，加成效果翻倍
- 宠物在屏幕角落以小动画形式陪伴写作

### 4.2 🏆 每周挑战排行榜

**新增类型：**
```typescript
interface WeeklyChallenge {
  id: string;
  week: string; // YYYY-WW
  theme: string;
  description: string;
  endDate: number;
}

interface LeaderboardEntry {
  rank: number;
  characterName: string;
  characterClass: CharacterClass;
  value: number; // 字数/天数/Boss数
  avatar?: string;
}

interface Leaderboard {
  challengeId: string;
  type: 'words' | 'streak' | 'bosses';
  entries: LeaderboardEntry[];
  lastUpdated: number;
}
```

**新增 Store：** `useLeaderboardStore`

**排行榜维度：**
1. 📝 总字数榜 - 本周写作总字数
2. 🔥 连续天数榜 - 本周连续写作天数
3. ⚔️ Boss 击杀榜 - 本周击败 Boss 数量

**奖励机制：**
| 排名 | 奖励 |
|------|------|
| 前 10% | 🏆 传奇徽章 + 500 金币 + 特殊宠物皮肤 |
| 前 50% | 🥈 优秀徽章 + 200 金币 |
| 参与者 | 🎖️ 参与徽章 + 50 金币 |

**UI 位置：**
- 在"广场"页面添加排行榜标签页
- 展示当前排名、距离上一名还差多少
- 每周一 00:00 重置

**注：** 第一版使用本地模拟数据，后续迭代可添加后端支持。

---

## 五、实现顺序

### 阶段一：基础架构
1. App.tsx 重构
2. Store 持久化
3. 数据导出/导入

### 阶段二：UI/UX
4. 响应式布局优化
5. 新手引导教程

### 阶段三：写作功能
6. 文档管理系统
7. Markdown 支持
8. AI 老爷爷助手

### 阶段四：游戏化
9. 宠物系统
10. 每周排行榜

---

## 六、风险与注意事项

1. **向后兼容** - 所有重构必须保持现有数据格式兼容
2. **渐进式发布** - 可以分阶段上线，不需要等待全部完成
3. **性能影响** - 添加新功能时注意监测包大小和加载时间
4. **AI 功能** - 第一版可以使用模拟 AI，后续接入真实 API

---

## 七、验收标准

- [ ] 所有现有功能在重构后正常工作
- [ ] 移动端布局流畅可用
- [ ] 新手引导完整可用
- [ ] 文档管理系统可正常创建/切换/删除
- [ ] Markdown 编辑和预览正常
- [ ] AI 老爷爷界面和交互流畅
- [ ] 宠物系统正常成长和互动
- [ ] 排行榜正常展示和更新
- [ ] 数据导出/导入功能正常

