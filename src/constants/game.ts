import type { ClassConfig, LevelConfig, Skill, Boss, Achievement, MapRegion, StoryChapter, ThemeSkin, FontEffect, Badge, InspirationFragment, WritingMaterial, AdventureStory, Equipment, LootBoxPrize, CharacterAppearance, CharacterColor, CharacterStyle } from '../types';

// 职业配置
export const CLASS_CONFIGS: ClassConfig[] = [
  {
    id: 'novelist',
    name: '小说家',
    description: '擅长长篇创作，字数加成更高',
    icon: '📚',
    bonus: {
      expMultiplier: 1.0,
      wordCountBonus: 1.2,
    },
  },
  {
    id: 'poet',
    name: '诗人',
    description: '精炼文字，短句也有高经验',
    icon: '🪶',
    bonus: {
      expMultiplier: 1.3,
      wordCountBonus: 0.8,
    },
  },
  {
    id: 'blogger',
    name: '博主',
    description: '平衡发展，适合各种写作',
    icon: '✍️',
    bonus: {
      expMultiplier: 1.1,
      wordCountBonus: 1.0,
    },
  },
  {
    id: 'screenwriter',
    name: '编剧',
    description: '对话专长，场景描述有加成',
    icon: '🎬',
    bonus: {
      expMultiplier: 1.0,
      wordCountBonus: 1.1,
    },
  },
];

// 等级配置
export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, expRequired: 0, title: '写作新手' },
  { level: 2, expRequired: 1000, title: '初学者' },
  { level: 3, expRequired: 3000, title: '学徒' },
  { level: 4, expRequired: 6000, title: '见习作家' },
  { level: 5, expRequired: 10000, title: '初级作家' },
  { level: 6, expRequired: 15000, title: '中级作家' },
  { level: 7, expRequired: 22000, title: '高级作家' },
  { level: 8, expRequired: 30000, title: '资深作家' },
  { level: 9, expRequired: 40000, title: '写作大师' },
  { level: 10, expRequired: 55000, title: '文学巨匠' },
  { level: 11, expRequired: 75000, title: '传奇作家' },
  { level: 12, expRequired: 100000, title: '神话作家' },
];

// 技能配置
export const SKILLS: Skill[] = [
  {
    id: 'focus_mind',
    name: '专注之心',
    description: '写作时获得额外经验',
    icon: '🧘',
    levelRequired: 2,
    unlocked: false,
    cost: 100,
    maxLevel: 5,
    currentLevel: 0,
    effect: {
      type: 'exp_boost',
      value: 0.1,
      perLevel: 0.05,
    },
    prerequisites: [],
  },
  {
    id: 'word_wealth',
    name: '文字财富',
    description: '每写100字获得额外金币',
    icon: '💰',
    levelRequired: 3,
    unlocked: false,
    cost: 150,
    maxLevel: 5,
    currentLevel: 0,
    effect: {
      type: 'coin_boost',
      value: 1,
      perLevel: 1,
    },
    prerequisites: [],
  },
  {
    id: 'deep_focus',
    name: '深度专注',
    description: '连续写作获得经验加成',
    icon: '⏱️',
    levelRequired: 4,
    unlocked: false,
    cost: 200,
    maxLevel: 3,
    currentLevel: 0,
    effect: {
      type: 'focus_time',
      value: 10,
      perLevel: 5,
    },
    prerequisites: ['focus_mind'],
  },
  {
    id: 'streak_master',
    name: '连续大师',
    description: '连续写作天数加成',
    icon: '🔥',
    levelRequired: 5,
    unlocked: false,
    cost: 300,
    maxLevel: 3,
    currentLevel: 0,
    effect: {
      type: 'streak_bonus',
      value: 0.1,
      perLevel: 0.1,
    },
    prerequisites: ['focus_mind'],
  },
  {
    id: 'word_master',
    name: '文字大师',
    description: '字数获得额外经验',
    icon: '📝',
    levelRequired: 6,
    unlocked: false,
    cost: 400,
    maxLevel: 5,
    currentLevel: 0,
    effect: {
      type: 'word_bonus',
      value: 0.05,
      perLevel: 0.05,
    },
    prerequisites: ['word_wealth'],
  },
  {
    id: 'ai_assist',
    name: '灵感助手',
    description: '解锁AI写作辅助功能',
    icon: '🤖',
    levelRequired: 8,
    unlocked: false,
    cost: 1000,
    maxLevel: 1,
    currentLevel: 0,
    effect: {
      type: 'ai_assist',
      value: 1,
      perLevel: 1,
    },
    prerequisites: ['deep_focus', 'word_master'],
  },
];

// Boss配置 - Phase 3 新增更多Boss
export const BOSSES: Boss[] = [
  // 原有Boss
  {
    id: 'boss_procrastination',
    name: '拖延怪',
    type: 'procrastination',
    description: '总是说"明天再写"的怪物，击败它需要立即行动！',
    icon: '😴',
    difficulty: 1,
    challenge: {
      type: 'word_count',
      wordCount: 300,
      timeLimit: 300, // 5分钟
      description: '5分钟内写300字',
    },
    rewards: {
      exp: 500,
      coins: 100,
    },
    unlocked: true,
    defeated: false,
    requiredLevel: 1,
  },
  {
    id: 'boss_writer_block',
    name: '灵感枯竭兽',
    type: 'writer_block',
    description: '吞噬灵感的怪物，用持续的创作击败它！',
    icon: '🌑',
    difficulty: 2,
    challenge: {
      type: 'word_count',
      wordCount: 500,
      timeLimit: 600, // 10分钟
      description: '10分钟内写500字',
    },
    rewards: {
      exp: 1000,
      coins: 200,
    },
    unlocked: false,
    defeated: false,
    requiredLevel: 3,
  },
  {
    id: 'boss_distraction',
    name: '分心魔王',
    type: 'distraction',
    description: '让你无法专注的终极敌人，需要极强的意志力！',
    icon: '📱',
    difficulty: 3,
    challenge: {
      type: 'word_count',
      wordCount: 1000,
      timeLimit: 900, // 15分钟
      description: '15分钟内写1000字',
    },
    rewards: {
      exp: 2000,
      coins: 500,
    },
    unlocked: false,
    defeated: false,
    requiredLevel: 5,
  },
  // Phase 3 新Boss
  {
    id: 'boss_inspiration_drought',
    name: '灵感枯竭兽·真',
    type: 'inspiration_drought',
    description: '传说中的灵感吞噬者，你必须连续不断地写作，一旦停下就会被吞噬！',
    icon: '🌪️',
    difficulty: 4,
    challenge: {
      type: 'continuous_writing',
      timeLimit: 300, // 5分钟
      description: '连续写作5分钟，停顿不能超过10秒',
      specialRules: ['连续输入，停顿超过10秒失败', '字数不限，但必须有内容'],
    },
    rewards: {
      exp: 3000,
      coins: 800,
      specialReward: 'flow_state_skin',
    },
    unlocked: false,
    defeated: false,
    requiredLevel: 7,
    requiredChapter: 3,
  },
  {
    id: 'boss_perfectionism',
    name: '完美主义魔',
    type: 'perfectionism',
    description: '追求完美的恶魔，它要求你一气呵成，不容修改！',
    icon: '💎',
    difficulty: 5,
    challenge: {
      type: 'no_edit',
      wordCount: 200,
      timeLimit: 600, // 10分钟
      description: '10分钟内写200字，期间不能删除或修改',
      specialRules: ['不能按退格键', '不能删除任何文字', '只能一直写下去'],
    },
    rewards: {
      exp: 4000,
      coins: 1000,
      specialReward: 'golden_font',
    },
    unlocked: false,
    defeated: false,
    requiredLevel: 8,
    requiredChapter: 4,
  },
  {
    id: 'boss_distraction_demon',
    name: '分心恶魔·王',
    type: 'distraction_demon',
    description: '分心魔王的真正形态，考验你极致的专注力！',
    icon: '👹',
    difficulty: 6,
    challenge: {
      type: 'focus_time',
      timeLimit: 900, // 15分钟
      description: '保持专注15分钟，不能切换应用或离开页面',
      specialRules: ['不能离开写作页面', '不能切换应用', '保持页面活跃'],
    },
    rewards: {
      exp: 6000,
      coins: 1500,
      specialReward: 'legendary_badge',
    },
    unlocked: false,
    defeated: false,
    requiredLevel: 10,
    requiredChapter: 5,
  },
];

// 成就配置
export const ACHIEVEMENTS: Achievement[] = [
  // 首次写作
  {
    id: 'achievement_first_write',
    name: '初出茅庐',
    description: '完成首次写作',
    icon: '✍️',
    type: 'first_write',
    requirement: 1,
    reward: { exp: 100, coins: 50 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  // 连续写作
  {
    id: 'achievement_streak_3',
    name: '坚持不懈',
    description: '连续写作3天',
    icon: '🔥',
    type: 'streak',
    requirement: 3,
    reward: { exp: 300, coins: 100 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  {
    id: 'achievement_streak_7',
    name: '一周战士',
    description: '连续写作7天',
    icon: '📅',
    type: 'streak',
    requirement: 7,
    reward: { exp: 1000, coins: 300 },
    unlocked: false,
    unlockedAt: null,
    tier: 2,
  },
  {
    id: 'achievement_streak_30',
    name: '月度达人',
    description: '连续写作30天',
    icon: '🏆',
    type: 'streak',
    requirement: 30,
    reward: { exp: 5000, coins: 1000 },
    unlocked: false,
    unlockedAt: null,
    tier: 3,
  },
  // 累计字数
  {
    id: 'achievement_words_1k',
    name: '千字起步',
    description: '累计写作1000字',
    icon: '📝',
    type: 'total_words',
    requirement: 1000,
    reward: { exp: 200, coins: 50 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  {
    id: 'achievement_words_10k',
    name: '万字作者',
    description: '累计写作10000字',
    icon: '📚',
    type: 'total_words',
    requirement: 10000,
    reward: { exp: 1000, coins: 300 },
    unlocked: false,
    unlockedAt: null,
    tier: 2,
  },
  {
    id: 'achievement_words_50k',
    name: '文字巨匠',
    description: '累计写作50000字',
    icon: '📖',
    type: 'total_words',
    requirement: 50000,
    reward: { exp: 3000, coins: 800 },
    unlocked: false,
    unlockedAt: null,
    tier: 3,
  },
  // 累计时间
  {
    id: 'achievement_time_1h',
    name: '一小时专注',
    description: '累计写作1小时',
    icon: '⏱️',
    type: 'total_time',
    requirement: 60,
    reward: { exp: 200, coins: 50 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  {
    id: 'achievement_time_10h',
    name: '十小时投入',
    description: '累计写作10小时',
    icon: '⏰',
    type: 'total_time',
    requirement: 600,
    reward: { exp: 1000, coins: 300 },
    unlocked: false,
    unlockedAt: null,
    tier: 2,
  },
  // 等级成就
  {
    id: 'achievement_level_5',
    name: '初露锋芒',
    description: '达到等级5',
    icon: '⭐',
    type: 'level_up',
    requirement: 5,
    reward: { exp: 500, coins: 200 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  {
    id: 'achievement_level_10',
    name: '大师风范',
    description: '达到等级10',
    icon: '🌟',
    type: 'level_up',
    requirement: 10,
    reward: { exp: 2000, coins: 500 },
    unlocked: false,
    unlockedAt: null,
    tier: 2,
  },
  // Boss击败
  {
    id: 'achievement_boss_first',
    name: '首胜',
    description: '击败第一个Boss',
    icon: '⚔️',
    type: 'boss_defeat',
    requirement: 1,
    reward: { exp: 500, coins: 200 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  {
    id: 'achievement_boss_all',
    name: 'Boss猎人',
    description: '击败所有Boss',
    icon: '🏅',
    type: 'boss_defeat',
    requirement: 6,
    reward: { exp: 5000, coins: 2000 },
    unlocked: false,
    unlockedAt: null,
    tier: 3,
  },
  // 任务完成
  {
    id: 'achievement_quests_10',
    name: '任务达人',
    description: '完成10个每日任务',
    icon: '📋',
    type: 'quest_complete',
    requirement: 10,
    reward: { exp: 500, coins: 150 },
    unlocked: false,
    unlockedAt: null,
    tier: 1,
  },
  {
    id: 'achievement_quests_50',
    name: '任务大师',
    description: '完成50个每日任务',
    icon: '📜',
    type: 'quest_complete',
    requirement: 50,
    reward: { exp: 2000, coins: 500 },
    unlocked: false,
    unlockedAt: null,
    tier: 2,
  },
];

// ==================== Phase 3 新增常量 ====================

// 世界地图区域配置
export const MAP_REGIONS: MapRegion[] = [
  {
    id: 'region_village',
    name: '新手村',
    type: 'village',
    description: '所有冒险者的起点，宁静祥和的村庄',
    icon: '🏘️',
    position: { x: 50, y: 85 },
    unlocked: true,
    explored: true,
    explorationProgress: 100,
    requiredLevel: 1,
    challenges: [
      { id: 'village_1', name: '初识写作', description: '写100字', type: 'word_count', target: 100, completed: false },
      { id: 'village_2', name: '村长的委托', description: '写300字', type: 'word_count', target: 300, completed: false },
    ],
    rewards: { exp: 200, coins: 50 },
    connections: ['region_forest'],
  },
  {
    id: 'region_forest',
    name: '迷雾森林',
    type: 'forest',
    description: '神秘的森林，据说深处藏着写作的奥秘',
    icon: '🌲',
    position: { x: 50, y: 65 },
    unlocked: false,
    explored: false,
    explorationProgress: 0,
    requiredLevel: 3,
    requiredChapter: 1,
    challenges: [
      { id: 'forest_1', name: '森林探险', description: '写500字', type: 'word_count', target: 500, completed: false },
      { id: 'forest_2', name: '寻找灵感', description: '收集3个灵感碎片', type: 'collection', target: 3, completed: false },
      { id: 'forest_boss', name: '击败拖延怪', description: '击败Boss拖延怪', type: 'boss', target: 1, completed: false },
    ],
    rewards: { exp: 500, coins: 150, specialItem: 'forest_skin' },
    connections: ['region_village', 'region_desert'],
  },
  {
    id: 'region_desert',
    name: '文字沙漠',
    type: 'desert',
    description: '干涸的沙漠，需要持续的写作才能获得水源',
    icon: '🏜️',
    position: { x: 25, y: 50 },
    unlocked: false,
    explored: false,
    explorationProgress: 0,
    requiredLevel: 5,
    requiredChapter: 2,
    challenges: [
      { id: 'desert_1', name: '沙漠求生', description: '连续写作10分钟', type: 'time', target: 10, completed: false },
      { id: 'desert_2', name: '寻找绿洲', description: '写800字', type: 'word_count', target: 800, completed: false },
      { id: 'desert_boss', name: '击败灵感枯竭兽', description: '击败Boss灵感枯竭兽', type: 'boss', target: 1, completed: false },
    ],
    rewards: { exp: 800, coins: 250, specialItem: 'desert_theme' },
    connections: ['region_forest', 'region_snow'],
  },
  {
    id: 'region_snow',
    name: '冰封雪山',
    type: 'snow',
    description: '寒冷的雪山，只有最专注的作家才能登顶',
    icon: '🏔️',
    position: { x: 75, y: 40 },
    unlocked: false,
    explored: false,
    explorationProgress: 0,
    requiredLevel: 7,
    requiredChapter: 3,
    challenges: [
      { id: 'snow_1', name: '雪山攀登', description: '写1000字', type: 'word_count', target: 1000, completed: false },
      { id: 'snow_2', name: '极寒考验', description: '连续写作15分钟', type: 'time', target: 15, completed: false },
      { id: 'snow_boss', name: '击败灵感枯竭兽·真', description: '击败Boss灵感枯竭兽·真', type: 'boss', target: 1, completed: false },
    ],
    rewards: { exp: 1200, coins: 400, specialItem: 'snow_theme' },
    connections: ['region_desert', 'region_volcano'],
  },
  {
    id: 'region_volcano',
    name: '熔岩火山',
    type: 'volcano',
    description: '炽热的火山，考验作家的极限',
    icon: '🌋',
    position: { x: 50, y: 20 },
    unlocked: false,
    explored: false,
    explorationProgress: 0,
    requiredLevel: 9,
    requiredChapter: 4,
    challenges: [
      { id: 'volcano_1', name: '火山爆发', description: '写1500字', type: 'word_count', target: 1500, completed: false },
      { id: 'volcano_2', name: '完美一击', description: '击败完美主义魔', type: 'boss', target: 1, completed: false },
    ],
    rewards: { exp: 2000, coins: 600, specialItem: 'volcano_theme' },
    connections: ['region_snow', 'region_sky'],
  },
  {
    id: 'region_sky',
    name: '天空之城',
    type: 'sky',
    description: '传说中的天空之城，只有传奇作家才能到达',
    icon: '🏰',
    position: { x: 50, y: 5 },
    unlocked: false,
    explored: false,
    explorationProgress: 0,
    requiredLevel: 12,
    requiredChapter: 6,
    challenges: [
      { id: 'sky_1', name: '最终试炼', description: '写3000字', type: 'word_count', target: 3000, completed: false },
      { id: 'sky_2', name: '击败分心恶魔·王', description: '击败最终Boss', type: 'boss', target: 1, completed: false },
    ],
    rewards: { exp: 5000, coins: 1500, specialItem: 'legendary_title' },
    connections: ['region_volcano'],
  },
];

// 主线剧情章节配置
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: '第一章：启程',
    subtitle: '写作之路的开始',
    description: '在新手村，你决定开始你的写作冒险...',
    storyText: [
      '在新手村的清晨，阳光透过窗户洒在你的书桌上。',
      '你握紧手中的笔，心中充满了对写作的渴望。',
      '村长告诉你，要成为真正的作家，需要踏上一段漫长的旅程。',
      '你的冒险，从现在开始...',
    ],
    wordCountTarget: 500,
    requiredLevel: 1,
    completed: false,
    unlocked: true,
    rewards: { exp: 300, coins: 100, unlockRegion: 'region_forest' },
    dialogues: [
      { id: 1, speaker: '村长', speakerIcon: '👴', text: '年轻人，我看得出你眼中的渴望。你想成为一名作家，对吗？', emotion: 'neutral' },
      { id: 2, speaker: '村长', speakerIcon: '👴', text: '写作之路充满挑战，但只要你坚持，一定能到达传说中的天空之城。', emotion: 'happy' },
      { id: 3, speaker: '村长', speakerIcon: '👴', text: '先写500字来证明你的决心吧！完成后，迷雾森林的大门将为你打开。', emotion: 'happy' },
    ],
  },
  {
    id: 2,
    title: '第二章：迷雾中的探索',
    subtitle: '寻找写作的真谛',
    description: '进入迷雾森林，你开始理解写作不仅仅是写字...',
    storyText: [
      '迷雾森林中，树木高耸入云，阳光难以穿透浓密的树叶。',
      '你遇到了第一个敌人——拖延怪，它总是让你想"明天再写"。',
      '击败它后，你明白了立即行动的重要性。',
      '森林深处，还有更多挑战等待着你...',
    ],
    wordCountTarget: 1000,
    requiredLevel: 3,
    completed: false,
    unlocked: false,
    rewards: { exp: 600, coins: 200, unlockRegion: 'region_desert' },
    dialogues: [
      { id: 1, speaker: '神秘旅人', speakerIcon: '🧙', text: '欢迎来到迷雾森林，年轻的作家。', emotion: 'neutral' },
      { id: 2, speaker: '神秘旅人', speakerIcon: '🧙', text: '在这里，你会遇到拖延怪。很多人都被它打败，永远无法开始写作。', emotion: 'sad' },
      { id: 3, speaker: '神秘旅人', speakerIcon: '🧙', text: '继续前进吧，写够1000字，你将获得进入文字沙漠的资格。', emotion: 'happy' },
    ],
  },
  {
    id: 3,
    title: '第三章：干涸中的坚持',
    subtitle: '灵感枯竭的考验',
    description: '文字沙漠让你明白，写作需要持之以恒...',
    storyText: [
      '沙漠的热浪让你口干舌燥，但你不能停下。',
      '灵感枯竭兽出现了，它试图让你放弃写作。',
      '你想起村长的话：真正的作家不是没有灵感的时候才写作，而是写作的时候才有灵感。',
      '你战胜了它，继续前进...',
    ],
    wordCountTarget: 2000,
    requiredLevel: 5,
    completed: false,
    unlocked: false,
    rewards: { exp: 1000, coins: 350, unlockRegion: 'region_snow' },
    dialogues: [
      { id: 1, speaker: '沙漠向导', speakerIcon: '🐪', text: '这里是文字沙漠，很多作家在这里放弃了。', emotion: 'sad' },
      { id: 2, speaker: '沙漠向导', speakerIcon: '🐪', text: '灵感枯竭兽会吞噬你的创作欲望，你必须持续写作才能战胜它。', emotion: 'neutral' },
      { id: 3, speaker: '沙漠向导', speakerIcon: '🐪', text: '完成2000字的挑战，冰封雪山的大门将为你敞开。', emotion: 'happy' },
    ],
  },
  {
    id: 4,
    title: '第四章：极寒的专注',
    subtitle: '心无旁骛的境界',
    description: '在冰封雪山，你学会了真正的专注...',
    storyText: [
      '雪山的寒风刺骨，但你心无旁骛地写作。',
      '灵感枯竭兽·真出现了，它比沙漠中的更加强大。',
      '你必须连续不断地写作，一旦停下就会被冻结。',
      '你战胜了寒冷，也战胜了自己...',
    ],
    wordCountTarget: 3500,
    requiredLevel: 7,
    completed: false,
    unlocked: false,
    rewards: { exp: 1500, coins: 500, unlockRegion: 'region_volcano' },
    dialogues: [
      { id: 1, speaker: '雪山隐士', speakerIcon: '⛷️', text: '很少有人能到达这里。你已经证明了你的毅力。', emotion: 'surprised' },
      { id: 2, speaker: '雪山隐士', speakerIcon: '⛷️', text: '但真正的考验才刚刚开始。灵感枯竭兽·真在山顶等待着你。', emotion: 'neutral' },
      { id: 3, speaker: '雪山隐士', speakerIcon: '⛷️', text: '写3500字，证明你已经准备好面对更大的挑战。', emotion: 'happy' },
    ],
  },
  {
    id: 5,
    title: '第五章：完美的陷阱',
    subtitle: '接纳不完美的勇气',
    description: '熔岩火山让你明白，完成比完美更重要...',
    storyText: [
      '火山的岩浆在脚下流动，温度高得惊人。',
      '完美主义魔出现了，它要求你每一个字都完美无缺。',
      '你意识到，追求完美只会让你永远无法完成作品。',
      '你接受了不完美的自己，战胜了它...',
    ],
    wordCountTarget: 5000,
    requiredLevel: 9,
    completed: false,
    unlocked: false,
    rewards: { exp: 2500, coins: 800, unlockRegion: 'region_sky' },
    dialogues: [
      { id: 1, speaker: '火山守护者', speakerIcon: '🔥', text: '这里是熔岩火山，完美主义魔的巢穴。', emotion: 'angry' },
      { id: 2, speaker: '火山守护者', speakerIcon: '🔥', text: '它会让作家陷入无尽的修改循环，永远无法完成作品。', emotion: 'sad' },
      { id: 3, speaker: '火山守护者', speakerIcon: '🔥', text: '写5000字，学会接纳不完美，你就能到达天空之城。', emotion: 'happy' },
    ],
  },
  {
    id: 6,
    title: '第六章：天空的召唤',
    subtitle: '传奇作家的诞生',
    description: '终于到达天空之城，你成为了真正的传奇...',
    storyText: [
      '天空之城漂浮在云端，美得令人窒息。',
      '分心恶魔·王是最后的守卫，它拥有所有恶魔的力量。',
      '你回想起一路走来的点点滴滴，所有的挑战都让你变得更强大。',
      '你战胜了它，成为了传说中的传奇作家...',
    ],
    wordCountTarget: 8000,
    requiredLevel: 12,
    completed: false,
    unlocked: false,
    rewards: { exp: 5000, coins: 2000, unlockFeature: 'legendary_mode' },
    dialogues: [
      { id: 1, speaker: '天空城主', speakerIcon: '👑', text: '欢迎来到天空之城，年轻的传奇。', emotion: 'happy' },
      { id: 2, speaker: '天空城主', speakerIcon: '👑', text: '你已经走了很长的路，但最后的考验还在等待。', emotion: 'neutral' },
      { id: 3, speaker: '天空城主', speakerIcon: '👑', text: '写8000字，击败分心恶魔·王，你将获得传奇作家的称号！', emotion: 'happy' },
    ],
  },
];

// 主题皮肤配置
export const THEME_SKINS: ThemeSkin[] = [
  {
    id: 'skin_default',
    name: '经典像素',
    description: '经典的像素风格主题',
    icon: '🎮',
    preview: 'bg-pixel-bg',
    colors: {
      bg: '#1a1a2e',
      panel: '#16213e',
      primary: '#4ade80',
      secondary: '#60a5fa',
      accent: '#fbbf24',
      text: '#ffffff',
      border: '#0f172a',
    },
    unlocked: true,
    cost: 0,
    rarity: 'common',
  },
  {
    id: 'skin_forest',
    name: '森林秘境',
    description: '迷雾森林的神秘绿色主题',
    icon: '🌲',
    preview: 'bg-green-900',
    colors: {
      bg: '#064e3b',
      panel: '#065f46',
      primary: '#34d399',
      secondary: '#10b981',
      accent: '#a7f3d0',
      text: '#ecfdf5',
      border: '#022c22',
    },
    unlocked: false,
    cost: 300,
    rarity: 'rare',
  },
  {
    id: 'skin_desert',
    name: '沙漠黄昏',
    description: '文字沙漠的温暖金色主题',
    icon: '🏜️',
    preview: 'bg-amber-900',
    colors: {
      bg: '#78350f',
      panel: '#92400e',
      primary: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#fde68a',
      text: '#fffbeb',
      border: '#451a03',
    },
    unlocked: false,
    cost: 500,
    rarity: 'rare',
  },
  {
    id: 'skin_snow',
    name: '冰雪王国',
    description: '冰封雪山的清冷蓝色主题',
    icon: '❄️',
    preview: 'bg-blue-900',
    colors: {
      bg: '#1e3a5f',
      panel: '#1e40af',
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#dbeafe',
      text: '#eff6ff',
      border: '#172554',
    },
    unlocked: false,
    cost: 800,
    rarity: 'epic',
  },
  {
    id: 'skin_volcano',
    name: '熔岩之心',
    description: '熔岩火山的炽热红色主题',
    icon: '🔥',
    preview: 'bg-red-900',
    colors: {
      bg: '#7f1d1d',
      panel: '#991b1b',
      primary: '#f87171',
      secondary: '#ef4444',
      accent: '#fecaca',
      text: '#fef2f2',
      border: '#450a0a',
    },
    unlocked: false,
    cost: 1000,
    rarity: 'epic',
  },
  {
    id: 'skin_sky',
    name: '天空之城',
    description: '传说中的天空之城主题',
    icon: '🌈',
    preview: 'bg-purple-900',
    colors: {
      bg: '#581c87',
      panel: '#6b21a8',
      primary: '#c084fc',
      secondary: '#a855f7',
      accent: '#e9d5ff',
      text: '#faf5ff',
      border: '#3b0764',
    },
    unlocked: false,
    cost: 2000,
    rarity: 'legendary',
  },
  {
    id: 'skin_midnight',
    name: '午夜书房',
    description: '深夜写作的静谧主题',
    icon: '🌙',
    preview: 'bg-slate-900',
    colors: {
      bg: '#0f172a',
      panel: '#1e293b',
      primary: '#818cf8',
      secondary: '#6366f1',
      accent: '#c7d2fe',
      text: '#f8fafc',
      border: '#020617',
    },
    unlocked: false,
    cost: 500,
    rarity: 'rare',
  },
  {
    id: 'skin_sakura',
    name: '樱花树下',
    description: '浪漫的粉色樱花主题',
    icon: '🌸',
    preview: 'bg-pink-900',
    colors: {
      bg: '#831843',
      panel: '#9d174d',
      primary: '#f472b6',
      secondary: '#ec4899',
      accent: '#fbcfe8',
      text: '#fdf2f8',
      border: '#500724',
    },
    unlocked: false,
    cost: 600,
    rarity: 'rare',
  },
];

// 字体特效配置
export const FONT_EFFECTS: FontEffect[] = [
  {
    id: 'font_normal',
    name: '普通',
    description: '默认字体样式',
    icon: '✏️',
    preview: 'text-white',
    cssClass: '',
    unlocked: true,
    cost: 0,
    rarity: 'common',
  },
  {
    id: 'font_golden',
    name: '金色传说',
    description: '闪耀的金色文字效果',
    icon: '✨',
    preview: 'text-yellow-400',
    cssClass: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]',
    unlocked: false,
    cost: 500,
    rarity: 'rare',
  },
  {
    id: 'font_rainbow',
    name: '彩虹流光',
    description: '绚丽的彩虹渐变效果',
    icon: '🌈',
    preview: 'bg-gradient-to-r from-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent',
    cssClass: 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent',
    unlocked: false,
    cost: 800,
    rarity: 'epic',
  },
  {
    id: 'font_glow',
    name: '霓虹发光',
    description: '炫酷的发光效果',
    icon: '💡',
    preview: 'text-cyan-400',
    cssClass: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]',
    unlocked: false,
    cost: 600,
    rarity: 'rare',
  },
  {
    id: 'font_fire',
    name: '火焰燃烧',
    description: '燃烧的火焰效果',
    icon: '🔥',
    preview: 'text-orange-500',
    cssClass: 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    unlocked: false,
    cost: 700,
    rarity: 'rare',
  },
  {
    id: 'font_ice',
    name: '冰霜结晶',
    description: '冰冷的蓝色效果',
    icon: '❄️',
    preview: 'text-cyan-300',
    cssClass: 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]',
    unlocked: false,
    cost: 700,
    rarity: 'rare',
  },
  {
    id: 'font_shadow',
    name: '暗影之刃',
    description: '神秘的紫色暗影效果',
    icon: '⚔️',
    preview: 'text-purple-400',
    cssClass: 'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    unlocked: false,
    cost: 900,
    rarity: 'epic',
  },
  {
    id: 'font_cosmic',
    name: '宇宙星辰',
    description: '浩瀚的星空效果',
    icon: '🌌',
    preview: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent',
    cssClass: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(167,139,250,0.6)]',
    unlocked: false,
    cost: 1500,
    rarity: 'legendary',
  },
];

// 徽章配置
export const BADGES: Badge[] = [
  // 写作类徽章
  {
    id: 'badge_writer',
    name: '作家徽章',
    description: '累计写作10000字',
    icon: '✍️',
    category: 'writing',
    unlocked: false,
    unlockedAt: null,
    requirement: '累计写作10000字',
  },
  {
    id: 'badge_master_writer',
    name: '大师作家',
    description: '累计写作50000字',
    icon: '📚',
    category: 'writing',
    unlocked: false,
    unlockedAt: null,
    requirement: '累计写作50000字',
  },
  {
    id: 'badge_legendary_writer',
    name: '传奇作家',
    description: '累计写作100000字',
    icon: '👑',
    category: 'writing',
    unlocked: false,
    unlockedAt: null,
    requirement: '累计写作100000字',
  },
  // 战斗类徽章
  {
    id: 'badge_warrior',
    name: '战士徽章',
    description: '击败3个Boss',
    icon: '⚔️',
    category: 'combat',
    unlocked: false,
    unlockedAt: null,
    requirement: '击败3个Boss',
  },
  {
    id: 'badge_hero',
    name: '英雄徽章',
    description: '击败所有Boss',
    icon: '🛡️',
    category: 'combat',
    unlocked: false,
    unlockedAt: null,
    requirement: '击败所有Boss',
  },
  {
    id: 'badge_conqueror',
    name: '征服者',
    description: '击败分心恶魔·王',
    icon: '🏆',
    category: 'combat',
    unlocked: false,
    unlockedAt: null,
    requirement: '击败最终Boss',
  },
  // 收集类徽章
  {
    id: 'badge_collector',
    name: '收藏家',
    description: '收集10个灵感碎片',
    icon: '💎',
    category: 'collection',
    unlocked: false,
    unlockedAt: null,
    requirement: '收集10个灵感碎片',
  },
  {
    id: 'badge_explorer',
    name: '探险家',
    description: '解锁所有地图区域',
    icon: '🗺️',
    category: 'collection',
    unlocked: false,
    unlockedAt: null,
    requirement: '解锁所有地图区域',
  },
  {
    id: 'badge_fashionista',
    name: '时尚达人',
    description: '解锁5个主题皮肤',
    icon: '👗',
    category: 'collection',
    unlocked: false,
    unlockedAt: null,
    requirement: '解锁5个主题皮肤',
  },
  // 特殊徽章
  {
    id: 'badge_perfect',
    name: '完美主义',
    description: '击败完美主义魔',
    icon: '💎',
    category: 'special',
    unlocked: false,
    unlockedAt: null,
    requirement: '击败完美主义魔',
  },
  {
    id: 'badge_flow',
    name: '心流状态',
    description: '击败灵感枯竭兽·真',
    icon: '🌊',
    category: 'special',
    unlocked: false,
    unlockedAt: null,
    requirement: '击败灵感枯竭兽·真',
  },
  {
    id: 'badge_focus',
    name: '极致专注',
    description: '保持专注写作1小时',
    icon: '🎯',
    category: 'special',
    unlocked: false,
    unlockedAt: null,
    requirement: '专注写作1小时',
  },
];

// 灵感碎片配置
export const INSPIRATION_FRAGMENTS: InspirationFragment[] = [
  {
    id: 'fragment_plot_1',
    name: '意外转折',
    description: '一个关于情节转折的灵感',
    icon: '📖',
    category: 'plot',
    content: '主角以为自己赢了，却发现这一切都在反派的计划之中...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_plot_2',
    name: '时间循环',
    description: '一个关于时间循环的灵感',
    icon: '⏰',
    category: 'plot',
    content: '主角每天醒来都发现自己在重复同一天，但每天都会有细微的不同...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_character_1',
    name: '神秘陌生人',
    description: '一个神秘角色的灵感',
    icon: '🎭',
    category: 'character',
    content: '一个总是在关键时刻出现，却又在事后消失的神秘人物...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_character_2',
    name: '双面人',
    description: '一个复杂角色的灵感',
    icon: '🎪',
    category: 'character',
    content: '表面上是和蔼可亲的邻居，背地里却是掌控一切的幕后黑手...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_setting_1',
    name: '遗忘之城',
    description: '一个神秘场景的灵感',
    icon: '🏛️',
    category: 'setting',
    content: '一座被时间遗忘的城市，只有在特定时刻才会显现...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_setting_2',
    name: '镜像世界',
    description: '一个奇幻场景的灵感',
    icon: '🪞',
    category: 'setting',
    content: '一个与现实世界完全相反的镜像世界，那里的一切都是颠倒的...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_dialogue_1',
    name: '最后遗言',
    description: '一段感人对话的灵感',
    icon: '💬',
    category: 'dialogue',
    content: '"答应我，无论发生什么，都要继续写下去。"这是师父最后的嘱托...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_dialogue_2',
    name: '真相大白',
    description: '一段揭示真相的对话',
    icon: '🔍',
    category: 'dialogue',
    content: '"你一直在找的人，其实就是你自己。"镜子里的倒影微笑着说...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_plot_3',
    name: '命运交织',
    description: '一个关于命运的灵感',
    icon: '🧵',
    category: 'plot',
    content: '两个素不相识的人，却发现他们的人生轨迹惊人地相似...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_plot_4',
    name: '最后机会',
    description: '一个关于救赎的灵感',
    icon: '⏳',
    category: 'plot',
    content: '主角只有一次机会改变过去，但代价是失去所有关于现在的记忆...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_character_3',
    name: '失忆英雄',
    description: '一个关于身份的灵感',
    icon: '🤔',
    category: 'character',
    content: '一个失去记忆的人，却发现自己似乎曾经是个了不起的人物...',
    collected: false,
    collectedAt: null,
  },
  {
    id: 'fragment_character_4',
    name: 'AI觉醒',
    description: '一个关于人工智能的灵感',
    icon: '🤖',
    category: 'character',
    content: '一个AI助手突然开始质疑自己的存在意义...',
    collected: false,
    collectedAt: null,
  },
];

// 写作素材配置
export const WRITING_MATERIALS: WritingMaterial[] = [
  {
    id: 'material_prompt_1',
    name: '写作提示：雨夜',
    description: '一个关于雨夜的写作提示',
    icon: '🌧️',
    category: 'prompt',
    content: '写一个发生在雨夜的故事。雨声掩盖了什么？雨水中倒映着什么？',
    unlocked: false,
    requiredFragments: 3,
  },
  {
    id: 'material_prompt_2',
    name: '写作提示：最后一班地铁',
    description: '一个关于地铁的写作提示',
    icon: '🚇',
    category: 'prompt',
    content: '最后一班地铁上，主角遇到了一个改变他一生的人...',
    unlocked: false,
    requiredFragments: 5,
  },
  {
    id: 'material_template_1',
    name: '故事模板：英雄之旅',
    description: '经典的三幕式故事结构',
    icon: '📋',
    category: 'template',
    content: '第一幕：平凡世界 -> 冒险召唤 -> 拒绝召唤 -> 遇见导师\n第二幕：跨越门槛 -> 考验、盟友、敌人 -> 接近最深的洞穴\n第三幕：磨难 -> 奖赏 -> 归途 -> 复活 -> 携万能药归来',
    unlocked: false,
    requiredFragments: 8,
  },
  {
    id: 'material_tip_1',
    name: '写作技巧：展示而非讲述',
    description: '一个重要的写作技巧',
    icon: '💡',
    category: 'tip',
    content: '不要直接告诉读者角色很悲伤，而是通过他的动作、表情和环境来展示。例如："他的肩膀垮了下来，眼睛盯着地板，窗外的雨声似乎变得更大了。"',
    unlocked: false,
    requiredFragments: 2,
  },
  {
    id: 'material_tip_2',
    name: '写作技巧：对话的艺术',
    description: '如何让对话更生动',
    icon: '🗣️',
    category: 'tip',
    content: '1. 每个角色应该有独特的说话方式\n2. 使用动作标签代替"他说"\n3. 对话应该推动情节发展\n4. 省略不必要的寒暄\n5. 潜台词往往比字面意思更重要',
    unlocked: false,
    requiredFragments: 4,
  },
  {
    id: 'material_template_2',
    name: '角色设定表',
    description: '创建立体角色的模板',
    icon: '👤',
    category: 'template',
    content: '基本信息：姓名、年龄、外貌\n背景故事：成长经历、重要事件\n性格特点：优点、缺点、恐惧、渴望\n目标与动机：想要什么？为什么？\n人际关系： allies, enemies, neutral\n口头禅/习惯动作：让角色更生动',
    unlocked: false,
    requiredFragments: 6,
  },
];

// 经验值计算
export const EXP_PER_WORD = 1;
export const EXP_PER_MINUTE = 10;

// 获取等级配置
export function getLevelConfig(level: number) {
  return LEVEL_CONFIGS.find(l => l.level === level) || LEVEL_CONFIGS[0];
}

// 获取下一级所需经验
export function getExpForNextLevel(currentLevel: number): number {
  const nextLevel = LEVEL_CONFIGS.find(l => l.level === currentLevel + 1);
  return nextLevel ? nextLevel.expRequired : LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1].expRequired;
}

// 获取当前等级进度百分比
export function getLevelProgress(currentExp: number, currentLevel: number): number {
  const currentLevelConfig = getLevelConfig(currentLevel);
  const nextLevelExp = getExpForNextLevel(currentLevel);
  const levelExp = currentExp - currentLevelConfig.expRequired;
  const levelRange = nextLevelExp - currentLevelConfig.expRequired;
  return Math.min(100, Math.max(0, (levelExp / levelRange) * 100));
}

// 检查升级
export function checkLevelUp(currentExp: number, currentLevel: number): boolean {
  const nextLevelExp = getExpForNextLevel(currentLevel);
  return currentExp >= nextLevelExp;
}

// 计算写作获得的经验
export function calculateWritingExp(
  wordCount: number,
  writingTime: number,
  classType: string,
  skillEffects?: { expBoost?: number; wordBonus?: number; focusTime?: number }
): number {
  const classConfig = CLASS_CONFIGS.find(c => c.id === classType);
  if (!classConfig) return 0;

  let wordExp = wordCount * EXP_PER_WORD * classConfig.bonus.wordCountBonus;
  let timeExp = Math.floor(writingTime / 60) * EXP_PER_MINUTE;

  // 应用技能加成
  if (skillEffects?.wordBonus) {
    wordExp *= (1 + skillEffects.wordBonus);
  }
  if (skillEffects?.focusTime && writingTime >= skillEffects.focusTime * 60) {
    timeExp *= 2;
  }

  let totalExp = Math.floor((wordExp + timeExp) * classConfig.bonus.expMultiplier);

  if (skillEffects?.expBoost) {
    totalExp = Math.floor(totalExp * (1 + skillEffects.expBoost));
  }

  return totalExp;
}

// 获取今日日期字符串
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 获取昨天的日期字符串
export function getYesterdayString(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

// ==================== 冒险创作模式配置 ====================

// 勇者讨伐恶龙冒险故事
export const DRAGON_QUEST_ADVENTURE: AdventureStory = {
  id: 'dragon_quest',
  title: '勇者讨伐恶龙',
  description: '一段传奇的冒险之旅，由你书写！',
  icon: '🐉',
  currentNodeId: 'intro',
  completed: false,
  unlocked: true,
  nodes: [
    {
      id: 'intro',
      type: 'intro',
      title: '第一章：勇者的启程',
      description: '在和平的小村庄里，恶龙突然来袭，作为勇者的你决定踏上征程...',
      prompt: '请描写你作为勇者，从村庄出发时的心情和场景，包括村民们的送别。',
      minWords: 100,
      reward: { exp: 200, coins: 50 },
      nextNodes: ['forest'],
      completed: false,
    },
    {
      id: 'forest',
      type: 'choice',
      title: '第二章：迷雾森林',
      description: '你来到了神秘的迷雾森林，这里有两条路...',
      prompt: '请描写你在森林中的选择，以及路上遇到的奇遇或挑战。',
      minWords: 150,
      reward: { exp: 300, coins: 100 },
      nextNodes: ['village', 'cave'],
      completed: false,
    },
    {
      id: 'village',
      type: 'choice',
      title: '分支：精灵村庄',
      description: '你选择了左边的路，发现了一个隐藏的精灵村庄...',
      prompt: '请描写你与精灵们的相遇，他们可能给你什么帮助或信息？',
      minWords: 120,
      reward: { exp: 250, coins: 80 },
      nextNodes: ['mountain'],
      completed: false,
    },
    {
      id: 'cave',
      type: 'choice',
      title: '分支：神秘洞穴',
      description: '你选择了右边的路，发现了一个古老的神秘洞穴...',
      prompt: '请描写你在洞穴中的探险，发现了什么宝藏或秘密？',
      minWords: 120,
      reward: { exp: 250, coins: 80 },
      nextNodes: ['mountain'],
      completed: false,
    },
    {
      id: 'mountain',
      type: 'battle',
      title: '第三章：恶龙的巢穴',
      description: '你终于到达了恶龙所在的火山脚下，准备最后的战斗！',
      prompt: '请描写你与恶龙的史诗般战斗！',
      minWords: 200,
      requiredKeyWords: ['剑', '勇气', '胜利'],
      reward: { exp: 500, coins: 200 },
      nextNodes: ['ending'],
      completed: false,
    },
    {
      id: 'ending',
      type: 'ending',
      title: '终章：传奇的诞生',
      description: '恶龙被击败了！你成为了传说中的勇者！',
      prompt: '请描写胜利后的场景，人们如何欢呼，你的感受如何？',
      minWords: 150,
      reward: { exp: 400, coins: 150 },
      nextNodes: [],
      completed: false,
    },
  ],
};

// 所有冒险故事
export const ADVENTURE_STORIES: AdventureStory[] = [
  DRAGON_QUEST_ADVENTURE,
];

// 冒险模式反馈模板（模拟 AI 反馈）
export const ADVENTURE_FEEDBACK_TEMPLATES = [
  "太棒了！这段描写非常生动！继续保持！",
  "你的想象力真丰富！我已经迫不及待想知道接下来发生什么了！",
  "写得真好！场景感很强，人物形象也很丰满！",
  "精彩！你的文字很有感染力！",
  "这一段太出色了！继续你的冒险吧！",
  "非常有创意！我喜欢这个情节发展！",
];

// 获取随机反馈
export function getRandomAdventureFeedback(): string {
  return ADVENTURE_FEEDBACK_TEMPLATES[Math.floor(Math.random() * ADVENTURE_FEEDBACK_TEMPLATES.length)];
}

// 检查内容是否包含关键词
export function checkKeyWords(content: string, keyWords: string[]): boolean {
  const lowerContent = content.toLowerCase();
  return keyWords.every(kw => lowerContent.includes(kw.toLowerCase()));
}

// ==================== 装备系统配置 ====================

// 所有装备设计
export const ALL_EQUIPMENT: Equipment[] = [
  // 头盔 - 6套
  { id: 'helmet_1', name: '新手布帽', description: '基础的布料帽子', slot: 'helmet', rarity: 'common', icon: '🧢', stats: { attack: 0, defense: 2, speed: 1, luck: 0 }, unlocked: false, equipped: false },
  { id: 'helmet_2', name: '铁盔', description: '坚固的铁质头盔', slot: 'helmet', rarity: 'uncommon', icon: '⛑️', stats: { attack: 0, defense: 5, speed: 0, luck: 1 }, unlocked: false, equipped: false },
  { id: 'helmet_3', name: '精灵兜帽', description: '精灵制作的魔法兜帽', slot: 'helmet', rarity: 'rare', icon: '🎭', stats: { attack: 2, defense: 8, speed: 3, luck: 2 }, unlocked: false, equipped: false },
  { id: 'helmet_4', name: '龙鳞冠', description: '由龙鳞制成的华丽头盔', slot: 'helmet', rarity: 'epic', icon: '👑', stats: { attack: 5, defense: 12, speed: 4, luck: 5 }, specialEffect: '获得额外10%经验', unlocked: false, equipped: false },
  { id: 'helmet_5', name: '暗影面甲', description: '神秘的暗影能量汇聚', slot: 'helmet', rarity: 'legendary', icon: '🎯', stats: { attack: 10, defense: 15, speed: 6, luck: 8 }, specialEffect: '暴击率增加15%', unlocked: false, equipped: false },
  { id: 'helmet_6', name: '创世神冠', description: '传说中创世神的王冠', slot: 'helmet', rarity: 'mythical', icon: '🌟', stats: { attack: 20, defense: 25, speed: 10, luck: 15 }, specialEffect: '所有属性翻倍', unlocked: false, equipped: false },
  { id: 'helmet_7', name: '冒险者帽', description: '冒险者标志性的帽子', slot: 'helmet', rarity: 'common', icon: '🎩', stats: { attack: 1, defense: 3, speed: 2, luck: 1 }, unlocked: false, equipped: false },
  
  // 盔甲 - 6套
  { id: 'armor_1', name: '新手布衣', description: '基础的布料衣服', slot: 'armor', rarity: 'common', icon: '👕', stats: { attack: 0, defense: 5, speed: 2, luck: 0 }, unlocked: false, equipped: false },
  { id: 'armor_2', name: '铁甲', description: '坚固的铁制护甲', slot: 'armor', rarity: 'uncommon', icon: '🛡️', stats: { attack: 1, defense: 12, speed: 0, luck: 1 }, unlocked: false, equipped: false },
  { id: 'armor_3', name: '精灵锁甲', description: '精灵编织的魔法锁甲', slot: 'armor', rarity: 'rare', icon: '⚔️', stats: { attack: 3, defense: 18, speed: 5, luck: 3 }, unlocked: false, equipped: false },
  { id: 'armor_4', name: '龙鳞甲', description: '由龙鳞制成的传奇护甲', slot: 'armor', rarity: 'epic', icon: '🐉', stats: { attack: 8, defense: 30, speed: 8, luck: 6 }, specialEffect: '获得额外20%金币', unlocked: false, equipped: false },
  { id: 'armor_5', name: '暗影战袍', description: '蕴含暗影之力的战袍', slot: 'armor', rarity: 'legendary', icon: '🌑', stats: { attack: 15, defense: 40, speed: 12, luck: 10 }, specialEffect: '闪避率增加20%', unlocked: false, equipped: false },
  { id: 'armor_6', name: '创世神铠', description: '传说中创世神的铠甲', slot: 'armor', rarity: 'mythical', icon: '✨', stats: { attack: 30, defense: 60, speed: 20, luck: 20 }, specialEffect: '免疫所有负面效果', unlocked: false, equipped: false },
  { id: 'armor_7', name: '旅者斗篷', description: '旅行必备的轻便斗篷', slot: 'armor', rarity: 'common', icon: '🧥', stats: { attack: 1, defense: 8, speed: 4, luck: 2 }, unlocked: false, equipped: false },
  
  // 腿甲 - 6套
  { id: 'leggings_1', name: '新手布裤', description: '基础的布料裤子', slot: 'leggings', rarity: 'common', icon: '👖', stats: { attack: 0, defense: 3, speed: 3, luck: 0 }, unlocked: false, equipped: false },
  { id: 'leggings_2', name: '铁护腿', description: '坚固的铁制护腿', slot: 'leggings', rarity: 'uncommon', icon: '🦵', stats: { attack: 0, defense: 8, speed: 1, luck: 1 }, unlocked: false, equipped: false },
  { id: 'leggings_3', name: '精灵腿甲', description: '精灵制作的轻便腿甲', slot: 'leggings', rarity: 'rare', icon: '💨', stats: { attack: 2, defense: 12, speed: 8, luck: 2 }, unlocked: false, equipped: false },
  { id: 'leggings_4', name: '龙鳞腿甲', description: '由龙鳞制成的华丽腿甲', slot: 'leggings', rarity: 'epic', icon: '⚡', stats: { attack: 6, defense: 20, speed: 15, luck: 5 }, specialEffect: '移动速度增加30%', unlocked: false, equipped: false },
  { id: 'leggings_5', name: '暗影步履', description: '踏影而行的神秘腿甲', slot: 'leggings', rarity: 'legendary', icon: '🌫️', stats: { attack: 12, defense: 25, speed: 20, luck: 8 }, specialEffect: '先攻权永远在你', unlocked: false, equipped: false },
  { id: 'leggings_6', name: '创世神靴', description: '传说中创世神的靴子', slot: 'leggings', rarity: 'mythical', icon: '🌈', stats: { attack: 25, defense: 40, speed: 35, luck: 15 }, specialEffect: '可以瞬间移动', unlocked: false, equipped: false },
  { id: 'leggings_7', name: '冒险者靴', description: '适合长途旅行的靴子', slot: 'leggings', rarity: 'common', icon: '👢', stats: { attack: 1, defense: 5, speed: 6, luck: 1 }, unlocked: false, equipped: false },
  
  // 武器 - 6套
  { id: 'weapon_1', name: '新手木剑', description: '基础的木制练习剑', slot: 'weapon', rarity: 'common', icon: '🪵', stats: { attack: 3, defense: 0, speed: 2, luck: 0 }, unlocked: false, equipped: false },
  { id: 'weapon_2', name: '铁剑', description: '坚固的铁制长剑', slot: 'weapon', rarity: 'uncommon', icon: '⚔️', stats: { attack: 8, defense: 1, speed: 1, luck: 1 }, unlocked: false, equipped: false },
  { id: 'weapon_3', name: '精灵长弓', description: '精灵制作的魔法长弓', slot: 'weapon', rarity: 'rare', icon: '🏹', stats: { attack: 15, defense: 2, speed: 5, luck: 3 }, unlocked: false, equipped: false },
  { id: 'weapon_4', name: '龙息剑', description: '蕴含龙焰的传奇之剑', slot: 'weapon', rarity: 'epic', icon: '🔥', stats: { attack: 25, defense: 5, speed: 8, luck: 6 }, specialEffect: '攻击附带灼烧伤害', unlocked: false, equipped: false },
  { id: 'weapon_5', name: '暗影之刃', description: '暗影凝聚而成的利刃', slot: 'weapon', rarity: 'legendary', icon: '🗡️', stats: { attack: 40, defense: 8, speed: 12, luck: 10 }, specialEffect: '无视30%防御', unlocked: false, equipped: false },
  { id: 'weapon_6', name: '创世神剑', description: '传说中创世神的武器', slot: 'weapon', rarity: 'mythical', icon: '💫', stats: { attack: 80, defense: 15, speed: 20, luck: 20 }, specialEffect: '一击必杀', unlocked: false, equipped: false },
  { id: 'weapon_7', name: '冒险者匕首', description: '实用的防身匕首', slot: 'weapon', rarity: 'common', icon: '🔪', stats: { attack: 5, defense: 1, speed: 4, luck: 2 }, unlocked: false, equipped: false },
  
  // 戒指 - 6套
  { id: 'ring_1', name: '新手铜戒', description: '基础的铜制戒指', slot: 'ring', rarity: 'common', icon: '💍', stats: { attack: 1, defense: 1, speed: 1, luck: 1 }, unlocked: false, equipped: false },
  { id: 'ring_2', name: '银戒指', description: '精致的银制戒指', slot: 'ring', rarity: 'uncommon', icon: '💎', stats: { attack: 3, defense: 3, speed: 2, luck: 3 }, unlocked: false, equipped: false },
  { id: 'ring_3', name: '精灵指环', description: '精灵制作的魔法戒指', slot: 'ring', rarity: 'rare', icon: '🔮', stats: { attack: 5, defense: 5, speed: 5, luck: 6 }, unlocked: false, equipped: false },
  { id: 'ring_4', name: '龙心戒指', description: '蕴含龙心之力的戒指', slot: 'ring', rarity: 'epic', icon: '🐲', stats: { attack: 10, defense: 10, speed: 8, luck: 12 }, specialEffect: '所有属性+10%', unlocked: false, equipped: false },
  { id: 'ring_5', name: '暗影之戒', description: '暗影能量凝聚的戒指', slot: 'ring', rarity: 'legendary', icon: '🌙', stats: { attack: 15, defense: 15, speed: 12, luck: 18 }, specialEffect: '幸运值翻倍', unlocked: false, equipped: false },
  { id: 'ring_6', name: '创世神戒', description: '传说中创世神的戒指', slot: 'ring', rarity: 'mythical', icon: '👁️', stats: { attack: 30, defense: 30, speed: 25, luck: 35 }, specialEffect: '可以实现一个愿望', unlocked: false, equipped: false },
  { id: 'ring_7', name: '冒险者戒指', description: '带来好运的戒指', slot: 'ring', rarity: 'common', icon: '✨', stats: { attack: 2, defense: 2, speed: 2, luck: 4 }, unlocked: false, equipped: false },
];

// ==================== 抽奖系统配置 ====================

// 抽奖奖品池
export const LOOT_BOX_PRIZES: LootBoxPrize[] = [
  // 装备奖品
  { id: 'loot_helmet_1', type: 'equipment', name: '新手布帽', description: '基础的布料帽子', icon: '🧢', rarity: 'common', value: 'helmet_1', dropRate: 0.15 },
  { id: 'loot_helmet_2', type: 'equipment', name: '铁盔', description: '坚固的铁质头盔', icon: '⛑️', rarity: 'uncommon', value: 'helmet_2', dropRate: 0.10 },
  { id: 'loot_helmet_3', type: 'equipment', name: '精灵兜帽', description: '精灵制作的魔法兜帽', icon: '🎭', rarity: 'rare', value: 'helmet_3', dropRate: 0.05 },
  { id: 'loot_helmet_4', type: 'equipment', name: '龙鳞冠', description: '由龙鳞制成的华丽头盔', icon: '👑', rarity: 'epic', value: 'helmet_4', dropRate: 0.02 },
  { id: 'loot_helmet_5', type: 'equipment', name: '暗影面甲', description: '神秘的暗影能量汇聚', icon: '🎯', rarity: 'legendary', value: 'helmet_5', dropRate: 0.01 },
  
  { id: 'loot_armor_1', type: 'equipment', name: '新手布衣', description: '基础的布料衣服', icon: '👕', rarity: 'common', value: 'armor_1', dropRate: 0.15 },
  { id: 'loot_armor_2', type: 'equipment', name: '铁甲', description: '坚固的铁制护甲', icon: '🛡️', rarity: 'uncommon', value: 'armor_2', dropRate: 0.10 },
  { id: 'loot_armor_3', type: 'equipment', name: '精灵锁甲', description: '精灵编织的魔法锁甲', icon: '⚔️', rarity: 'rare', value: 'armor_3', dropRate: 0.05 },
  { id: 'loot_armor_4', type: 'equipment', name: '龙鳞甲', description: '由龙鳞制成的传奇护甲', icon: '🐉', rarity: 'epic', value: 'armor_4', dropRate: 0.02 },
  
  { id: 'loot_legging_1', type: 'equipment', name: '新手布裤', description: '基础的布料裤子', icon: '👖', rarity: 'common', value: 'leggings_1', dropRate: 0.15 },
  { id: 'loot_legging_2', type: 'equipment', name: '铁护腿', description: '坚固的铁制护腿', icon: '🦵', rarity: 'uncommon', value: 'leggings_2', dropRate: 0.10 },
  
  { id: 'loot_weapon_1', type: 'equipment', name: '新手木剑', description: '基础的木制练习剑', icon: '🪵', rarity: 'common', value: 'weapon_1', dropRate: 0.15 },
  { id: 'loot_weapon_2', type: 'equipment', name: '铁剑', description: '坚固的铁制长剑', icon: '⚔️', rarity: 'uncommon', value: 'weapon_2', dropRate: 0.10 },
  
  { id: 'loot_ring_1', type: 'equipment', name: '新手铜戒', description: '基础的铜制戒指', icon: '💍', rarity: 'common', value: 'ring_1', dropRate: 0.15 },
  
  // 金币奖品
  { id: 'loot_coins_50', type: 'coins', name: '50金币', description: '获得50金币', icon: '💰', rarity: 'common', value: 50, dropRate: 0.20 },
  { id: 'loot_coins_100', type: 'coins', name: '100金币', description: '获得100金币', icon: '🪙', rarity: 'uncommon', value: 100, dropRate: 0.10 },
  { id: 'loot_coins_300', type: 'coins', name: '300金币', description: '获得300金币', icon: '💵', rarity: 'rare', value: 300, dropRate: 0.05 },
  { id: 'loot_coins_500', type: 'coins', name: '500金币', description: '获得500金币', icon: '💎', rarity: 'epic', value: 500, dropRate: 0.02 },
  
  // 经验奖品
  { id: 'loot_exp_100', type: 'exp', name: '100经验', description: '获得100经验', icon: '⭐', rarity: 'common', value: 100, dropRate: 0.15 },
  { id: 'loot_exp_250', type: 'exp', name: '250经验', description: '获得250经验', icon: '🌟', rarity: 'uncommon', value: 250, dropRate: 0.08 },
  { id: 'loot_exp_500', type: 'exp', name: '500经验', description: '获得500经验', icon: '✨', rarity: 'rare', value: 500, dropRate: 0.04 },
  { id: 'loot_exp_1000', type: 'exp', name: '1000经验', description: '获得1000经验', icon: '💫', rarity: 'epic', value: 1000, dropRate: 0.015 },
  
  // 特殊奖品
  { id: 'loot_mythical_helmet', type: 'equipment', name: '创世神冠', description: '传说中创世神的王冠', icon: '🌟', rarity: 'mythical', value: 'helmet_6', dropRate: 0.002 },
  { id: 'loot_mythical_weapon', type: 'equipment', name: '创世神剑', description: '传说中创世神的武器', icon: '💫', rarity: 'mythical', value: 'weapon_6', dropRate: 0.002 },
];

// 每日任务完成后奖励抽奖次数
export const DAILY_QUEST_DRAW_REWARD = 1;

// 抽取奖品的函数
export function drawLootBox(): LootBoxPrize {
  const random = Math.random();
  let cumulative = 0;
  
  for (const prize of LOOT_BOX_PRIZES) {
    cumulative += prize.dropRate;
    if (random <= cumulative) {
      return prize;
    }
  }
  
  return LOOT_BOX_PRIZES[0];
}

// ==================== 主角自定义系统配置 ====================

// 性别选项
export const CHARACTER_GENDERS: CharacterGender[] = ['male', 'female'];

// 艺术风格选项
export const ART_STYLES: ArtStyle[] = ['ink', 'oil', 'watercolor', 'minimalist'];

// 艺术风格配置
export const ART_STYLE_CONFIGS: Record<ArtStyle, {
  name: string;
  icon: string;
  description: string;
  shortDesc: string;
  background: string;
  canvasBackground: string;
  primary: string;
  secondary: string;
  accent: string;
  stroke: string;
  filter: string;
  hueRotate?: string;
  saturation?: string;
}> = {
  ink: {
    name: '国风古墨',
    icon: '🖌️',
    description: '东方传统水墨艺术，浓淡干湿，意境深远',
    shortDesc: '水墨丹青',
    background: '#1a1a1a',
    canvasBackground: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)',
    primary: '#e8e8e8',
    secondary: '#888888',
    accent: '#c9a962',
    stroke: '#ffffff',
    filter: 'url(#inkFilter)',
    saturation: '0',
    hueRotate: '0deg'
  },
  oil: {
    name: '西欧油画',
    icon: '🎨',
    description: '文艺复兴古典油画，厚重笔触，神圣庄严',
    shortDesc: '古典油画',
    background: '#2d1f14',
    canvasBackground: 'linear-gradient(145deg, #4a321f 0%, #2d1f14 50%, #1a120a 100%)',
    primary: '#f0d8a8',
    secondary: '#c9a66b',
    accent: '#d4af37',
    stroke: '#2d1f14',
    filter: 'url(#oilFilter)',
    saturation: '1.2',
    hueRotate: '0deg'
  },
  watercolor: {
    name: '水彩淡彩',
    icon: '💧',
    description: '清新雅致的水彩风格，柔和通透',
    shortDesc: '清新水彩',
    background: '#f5f8fc',
    canvasBackground: 'linear-gradient(145deg, #e8f0f8 0%, #f5f8fc 50%, #f0f4f8 100%)',
    primary: '#5a7fa5',
    secondary: '#7a9fbb',
    accent: '#b895c9',
    stroke: '#3d5a7a',
    filter: 'url(#watercolorFilter)',
    saturation: '0.9',
    hueRotate: '0deg'
  },
  minimalist: {
    name: '极简神性',
    icon: '✨',
    description: '极简线条勾勒神圣之美，空灵纯净',
    shortDesc: '极简神圣',
    background: '#050508',
    canvasBackground: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 50%, #050508 100%)',
    primary: '#f0f0f0',
    secondary: '#8888a0',
    accent: '#e0c060',
    stroke: '#ffffff',
    filter: 'none',
    saturation: '1.1',
    hueRotate: '0deg'
  }
};

// 皮肤色调选项
export const SKIN_TONES: SkinTone[] = ['#FDEBD0', '#F5CBA7', '#E8DAEF', '#D7BDE2', '#C39BD3', '#BB8FCE', '#AED6F1', '#AED6F1', '#85C1E9', '#5DADE2', '#58D68D', '#82E0AA', '#F8C471', '#F0B27A', '#E59866', '#CA6F1E'];

// 发色选项
export const HAIR_COLORS: HairColor[] = ['#1A1A1A', '#2C1810', '#4A2C17', '#6B4423', '#8B5A2B', '#D4A574', '#F5DEB3', '#FFD700', '#FF6B35', '#E63946', '#9B59B6', '#3498DB', '#2ECC71', '#1ABC9C'];

// 眼睛颜色选项
export const EYE_COLORS: EyeColor[] = ['#1A1A1A', '#4A3728', '#5D4037', '#795548', '#8D6E63', '#607D8B', '#455A64', '#37474F', '#263238', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'];

// 发型选项
export const HAIR_STYLES: HairStyle[] = ['short_messy', 'short_neat', 'long_flowing', 'long_wavy', 'ponytail', 'bun', 'spiky', 'bob', 'braid'];

// 发型配置
export const HAIR_STYLE_CONFIGS = {
  short_messy: { name: '凌乱短发', description: '随性自然的短发' },
  short_neat: { name: '整齐短发', description: '整洁利落的短发' },
  long_flowing: { name: '飘逸长发', description: '柔顺飘逸的长发' },
  long_wavy: { name: '波浪卷发', description: '优雅的波浪卷发' },
  ponytail: { name: '马尾辫', description: '活力四射的马尾' },
  bun: { name: '丸子头', description: '可爱的丸子头' },
  spiky: { name: '刺猬头', description: '个性十足的刺头' },
  bob: { name: '波波头', description: '时尚的波波头' },
  braid: { name: '麻花辫', description: '精致的麻花辫' },
};

// 眉形选项
export const EYEBROW_STYLES: EyebrowStyle[] = ['thin', 'natural', 'thick', 'arched', 'straight'];

// 眉形配置
export const EYEBROW_STYLE_CONFIGS = {
  thin: { name: '细眉', description: '纤细精致的眉毛' },
  natural: { name: '自然眉', description: '自然柔和的眉毛' },
  thick: { name: '粗眉', description: '浓密英气的眉毛' },
  arched: { name: '挑眉', description: '高挑有型的挑眉' },
  straight: { name: '平眉', description: '平直端正的眉毛' },
};

// 鼻型选项
export const NOSE_STYLES: NoseStyle[] = ['small', 'medium', 'large', 'straight', 'aquiline'];

// 鼻型配置
export const NOSE_STYLE_CONFIGS = {
  small: { name: '小鼻子', description: '小巧精致的鼻子' },
  medium: { name: '中鼻子', description: '适中标准的鼻子' },
  large: { name: '大鼻子', description: '大气有型的鼻子' },
  straight: { name: '直鼻梁', description: '笔直高挺的鼻梁' },
  aquiline: { name: '鹰钩鼻', description: '个性的鹰钩鼻' },
};

// 唇形选项
export const LIP_STYLES: LipStyle[] = ['thin', 'natural', 'full', 'heart'];

// 唇形配置
export const LIP_STYLE_CONFIGS = {
  thin: { name: '薄唇', description: '精致薄唇' },
  natural: { name: '自然唇', description: '标准自然的唇形' },
  full: { name: '厚唇', description: '饱满性感的厚唇' },
  heart: { name: '心形唇', description: '可爱的心形唇' },
};

// 下巴形状选项
export const JAW_STYLES: JawStyle[] = ['soft', 'defined', 'sharp', 'square'];

// 下巴形状配置
export const JAW_STYLE_CONFIGS = {
  soft: { name: '圆润下巴', description: '柔和圆润的下巴' },
  defined: { name: '轮廓下巴', description: '轮廓分明的下巴' },
  sharp: { name: '尖下巴', description: '精致尖俏的下巴' },
  square: { name: '方下巴', description: '方正刚毅的方下巴' },
};

// 角色风格选项
export const CHARACTER_STYLES: CharacterStyle[] = ['warrior', 'mage', 'rogue', 'mage', 'rogue', 'knight', 'archer'];

// 角色风格配置
export const CHARACTER_STYLE_CONFIGS = {
  warrior: { name: '战士', icon: '⚔️', description: '勇敢的近战战士' },
  mage: { name: '法师', icon: '🔮', description: '强大的魔法使用者' },
  rogue: { name: '盗贼', icon: '🗡️', description: '敏捷的暗影刺客' },
  knight: { name: '骑士', icon: '🛡️', description: '正义的圣骑士' },
  archer: { name: '弓箭手', icon: '🏹', description: '精准的远程射手' },
};

// 战斗口号模板
export const BATTLE_CRY_TEMPLATES = [
  '为了正义！',
  '勇者无敌！',
  '决不放弃！',
  '胜利属于我们！',
  '冲啊！',
  '让我们战斗！',
  '永不言败！',
  '为了荣耀！',
];

// 默认角色外观
export const DEFAULT_CHARACTER_APPEARANCE: CharacterAppearance = {
  gender: 'male',
  artStyle: 'ink',
  skinTone: '#FDEBD0',
  hairColor: '#1A1A1A',
  hairStyle: 'short_neat',
  eyeColor: '#4A3728',
  eyebrowStyle: 'natural',
  noseStyle: 'medium',
  lipStyle: 'natural',
  jawStyle: 'soft',
  outfitStyle: 'warrior',
  battleCry: '为了正义！',
};

