# WriteQuest Plan 4 - 游戏化增强

> **日期：** 2026-05-23  
> **目标：** 实现宠物系统和每周排行榜

---

## 概述

本计划实现游戏化增强功能，包括：
1. **宠物系统** - 陪伴写作的可爱伙伴，提供加成效果
2. **每周排行榜** - 激励用户持续写作的竞争机制

---

## 一、宠物系统

### 1.1 数据模型

```typescript
type PetType = 'dragon' | 'cat' | 'owl' | 'fox' | 'wolf';

interface PetSkill {
  id: string;
  name: string;
  description: string;
  effectType: 'expBonus' | 'coinBonus' | 'bossDamage' | 'streakBonus';
  effectValue: number;
  levelRequired: number;
}

interface Pet {
  id: string;
  type: PetType;
  name: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  happiness: number; // 0-100
  equipped: boolean;
  unlocked: boolean;
  skills: PetSkill[];
  lastInteraction: number;
}
```

### 1.2 宠物类型和效果

| 宠物 | 图标 | 被动效果 | 描述 |
|------|------|----------|------|
| 🐉 小龙 | 🔥 | Boss 战攻击力 +15% | 勇敢的小龙，战斗得力助手 |
| 🐱 小猫 | 😺 | 连续写作奖励 +20% | 温柔的伙伴，让你坚持更久 |
| 🦉 猫头鹰 | 📚 | 经验获取 +10% | 智慧的象征，学习事半功倍 |
| 🦊 狐狸 | ✨ | 金币掉落 +15% | 狡猾的朋友，总能找到宝藏 |
| 🐺 狼 | 🌙 | 夜间写作（20-6点）所有奖励 +25% | 神秘的夜行者，在黑暗中力量倍增 |

### 1.3 创建 Pet Store

新建 `src/stores/usePetStore.ts`：
- 管理当前宠物状态
- 升级系统
- 互动（玩耍、喂食）
- 切换装备的宠物
- 解锁新宠物

### 1.4 创建 UI 组件

新建以下组件：
- `src/components/pet/PetAvatar.tsx` - 宠物头像显示
- `src/components/pet/PetPanel.tsx` - 宠物管理主面板
- `src/components/pet/PetInteraction.tsx` - 互动界面
- `src/components/pet/PetDisplay.tsx` - 屏幕角落的小宠物动画

---

## 二、每周排行榜

### 2.1 数据模型

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
  value: number;
  avatar?: string;
}

interface Leaderboard {
  challengeId: string;
  type: 'words' | 'streak' | 'bosses';
  entries: LeaderboardEntry[];
  lastUpdated: number;
}
```

### 2.2 排行榜维度

1. **📝 总字数榜** - 本周写作总字数
2. **🔥 连续天数榜** - 本周连续写作天数
3. **⚔️ Boss 击杀榜** - 本周击败 Boss 数量

### 2.3 奖励机制

| 排名 | 奖励 |
|------|------|
| 前 10% | 🏆 传奇徽章 + 500 金币 + 特殊宠物皮肤 |
| 前 50% | 🥈 优秀徽章 + 200 金币 |
| 参与者 | 🎖️ 参与徽章 + 50 金币 |

### 2.4 创建 Leaderboard Store

新建 `src/stores/useLeaderboardStore.ts`：
- 管理排行榜数据
- 计算当前用户排名
- 每周重置机制
- 奖励发放

### 2.5 创建 UI 组件

新建以下组件：
- `src/components/leaderboard/LeaderboardPanel.tsx` - 排行榜主界面
- `src/components/leaderboard/LeaderboardTabs.tsx` - 不同维度的标签页
- `src/components/leaderboard/LeaderboardEntry.tsx` - 单个排名项

---

## 三、实现顺序

1. 创建宠物类型和 store
2. 创建宠物 UI 组件
3. 集成宠物到主界面
4. 创建排行榜类型和 store
5. 创建排行榜 UI 组件
6. 集成排行榜到广场页面
7. 添加宠物奖励和成就

---

## 验收标准

- [ ] 宠物系统正常运作，可以升级、互动
- [ ] 宠物加成效果正确应用
- [ ] 排行榜显示正常数据
- [ ] 每周重置机制正确
- [ ] 所有功能保持向后兼容
