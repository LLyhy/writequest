export interface WritingTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'novel' | 'essay' | 'diary' | 'story' | 'poem' | 'outline';
  content: string;
}

export const WRITING_TEMPLATES: WritingTemplate[] = [
  {
    id: 'hero-journey',
    name: '英雄之旅',
    description: '经典小说故事结构模板',
    icon: '⚔️',
    category: 'novel',
    content: `# 英雄之旅

## 第一幕：平凡世界
- 介绍主角的日常生活
- 显示主角的渴望或问题

## 冒险召唤
- 某个事件打破了平静
- 主角面临选择

## 拒绝召唤
- 主角犹豫或拒绝
- 展现内心挣扎

## 遇见导师
- 遇到帮助者或引路人
- 获得指导或神器

## 跨越第一道门槛
- 主角正式进入新世界
- 冒险真正开始

## 第二幕：考验、盟友、敌人
- 主角遇到各种挑战
- 结交朋友，树立敌人
- 学习新规则

## 接近洞穴深处
- 接近最大危险
- 紧张气氛升级

## 磨难
- 最黑暗的时刻
- 主角面临死亡或失败

## 奖赏
- 获得重要东西
- 有了新的领悟

## 第三幕：回归之路
- 带着奖赏踏上归途
- 追兵或新危险

## 复活
- 最后的考验
- 主角脱胎换骨

## 满载而归
- 回到平凡世界
- 带来改变

---
开始你的英雄故事吧！`
  },
  {
    id: 'three-act',
    name: '三幕剧结构',
    description: '经典剧本/小说结构',
    icon: '🎭',
    category: 'story',
    content: `# 三幕剧故事

## 第一幕：铺垫
- 展示人物关系
- 建立世界观
- 引入核心冲突
- 第一个情节点（约25%处）

## 第二幕：对抗
- 主角面对重重困难
- 逐步升级的挑战
- 中期转折点（约50%处）
- 主角跌入低谷
- 第二个情节点（约75%处）

## 第三幕：解决
- 高潮战斗/对决
- 问题最终解决
- 展示结果
- 尾声/余波

---
现在开始创作你的故事！`
  },
  {
    id: 'character-profile',
    name: '人物小传',
    description: '详细的角色塑造模板',
    icon: '👤',
    category: 'outline',
    content: `# 人物小传

## 基本信息
- 姓名：
- 年龄：
- 职业：
- 外貌描述：

## 性格特点
- 优点：
- 缺点：
- 口头禅：
- 习惯动作：

## 背景故事
- 童年：
- 重要经历：
- 心结/创伤：

## 目标与动机
- 短期目标：
- 长期目标：
- 最看重的东西：

## 人际关系
- 家人：
- 朋友：
- 敌人：
- 爱情：

## 人物弧线
- 开始时：
- 经历变化：
- 结束时：

---
开始塑造你的角色！`
  },
  {
    id: 'daily-diary',
    name: '每日日记',
    description: '个人日记记录模板',
    icon: '📔',
    category: 'diary',
    content: `# 年月日 星期

## 今日心情
😊 😐 😢 😤 🤩

## 今日事件
1. 
2. 
3. 

## 今日感想

## 今日感恩
1. 
2. 
3. 

## 明日计划

---
记录每一天！`
  },
  {
    id: 'personal-essay',
    name: '个人散文',
    description: '抒发个人感悟的散文结构',
    icon: '✍️',
    category: 'essay',
    content: `# 题目

## 开头
- 引入场景或话题
- 设置情感基调

## 主体
- 第一段：具体事件或观察
- 第二段：深入思考
- 第三段：联系更广泛的意义

## 结尾
- 总结感悟
- 给读者留下思考

---
开始写下你的感悟！`
  },
  {
    id: 'short-story',
    name: '短篇小说',
    description: '短篇小说创作模板',
    icon: '📖',
    category: 'story',
    content: `# 故事标题

## 开端（第1-2段）
- 介绍主角
- 展示场景
- 建立氛围
- 暗示冲突

## 发展（中间部分）
- 冲突展开
- 情节上升
- 复杂情况出现

## 高潮
- 决定性时刻
- 选择或转折

## 结局
- 问题解决
- 人物变化
- 余韵

---
写下你的短篇小说！`
  },
  {
    id: 'world-building',
    name: '世界观设定',
    description: '奇幻/科幻世界观构建模板',
    icon: '🌍',
    category: 'outline',
    content: `# 世界观设定

## 地理环境
- 世界地图/主要地点
- 气候与地貌
- 重要地标

## 社会结构
- 政治制度
- 社会阶层
- 经济系统

## 文化
- 语言
- 宗教/信仰
- 节日习俗
- 艺术风格

## 魔法/科技
- 力量体系
- 使用规则
- 历史发展

## 历史
- 重要事件
- 神话传说
- 当前局势

---
构建你的世界！`
  },
  {
    id: 'poem-free',
    name: '自由诗',
    description: '现代诗歌创作',
    icon: '🎵',
    category: 'poem',
    content: `# 诗题

（第一小节）


（第二小节）


（第三小节）


---
让思绪流淌成诗！`
  }
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'novel', name: '小说' },
  { id: 'story', name: '故事' },
  { id: 'essay', name: '散文' },
  { id: 'diary', name: '日记' },
  { id: 'poem', name: '诗歌' },
  { id: 'outline', name: '大纲' }
];
