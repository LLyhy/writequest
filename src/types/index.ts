export * from './showcase';

// 职业类型
export type CharacterClass = 'novelist' | 'poet' | 'blogger' | 'screenwriter';

// 角色信息
export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  exp: number;
  totalWords: number;
  totalWritingTime: number; // 分钟
  createdAt: number;
  lastWritingAt: number | null;
  streakDays: number; // 连续写作天数
  lastStreakDate: string | null; // 上次连续日期 YYYY-MM-DD
}

// 职业配置
export interface ClassConfig {
  id: CharacterClass;
  name: string;
  description: string;
  icon: string;
  bonus: {
    expMultiplier: number;
    wordCountBonus: number;
  };
}

// 写作会话
export interface WritingSession {
  id: string;
  startTime: number;
  endTime: number | null;
  wordCount: number;
  content: string;
  expGained: number;
}

// 写作历史记录
export interface WritingHistory {
  id: string;
  date: string; // YYYY-MM-DD
  wordCount: number;
  writingTime: number; // 分钟
  sessions: number;
}

// 任务类型
export type QuestType = 'daily' | 'main' | 'challenge' | 'streak';

// 任务
export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: {
    exp: number;
    coins: number;
  };
  completed: boolean;
  claimed: boolean;
  createdAt: number;
  expiresAt: number | null;
  category: 'word' | 'time' | 'streak' | 'challenge';
}

// 游戏状态
export interface GameState {
  coins: number;
  currentSession: WritingSession | null;
  isWriting: boolean;
  dailyQuests: Quest[];
  lastQuestRefresh: number | null;
}

// 编辑器状态
export interface EditorState {
  content: string;
  wordCount: number;
  charCount: number;
  lastSaved: number | null;
}

// 等级配置
export interface LevelConfig {
  level: number;
  expRequired: number;
  title: string;
}

// 技能类型
export type SkillType = 'exp_boost' | 'coin_boost' | 'focus_time' | 'ai_assist' | 'word_bonus' | 'streak_bonus';

// 技能
export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  levelRequired: number;
  unlocked: boolean;
  cost: number; // 金币消耗
  maxLevel: number;
  currentLevel: number;
  effect: {
    type: SkillType;
    value: number;
    perLevel: number;
  };
  prerequisites: string[]; // 前置技能ID
}

// Boss类型
export type BossType = 'procrastination' | 'writer_block' | 'distraction' | 'inspiration_drought' | 'perfectionism' | 'distraction_demon';

// Boss挑战规则类型
export type BossChallengeType = 'word_count' | 'continuous_writing' | 'no_edit' | 'focus_time' | 'speed_writing';

// Boss
export interface Boss {
  id: string;
  name: string;
  type: BossType;
  description: string;
  icon: string;
  difficulty: number;
  challenge: {
    type: BossChallengeType;
    wordCount?: number;
    timeLimit: number; // 秒
    description: string;
    specialRules?: string[];
  };
  rewards: {
    exp: number;
    coins: number;
    specialReward?: string;
  };
  unlocked: boolean;
  defeated: boolean;
  requiredLevel?: number;
  requiredChapter?: number;
}

// Boss战状态
export interface BossBattle {
  bossId: string;
  startTime: number;
  endTime: number | null;
  wordCount: number;
  timeRemaining: number;
  status: 'active' | 'won' | 'lost' | 'abandoned';
  // Phase 3 新增
  lastInputTime?: number; // 上次输入时间（用于连续写作挑战）
  editCount?: number; // 编辑次数（用于不修改挑战）
  initialContent?: string; // 初始内容（用于不修改挑战）
}

// 成就类型
export type AchievementType = 'first_write' | 'streak' | 'total_words' | 'total_time' | 'level_up' | 'boss_defeat' | 'quest_complete';

// 成就
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  requirement: number;
  reward: {
    exp: number;
    coins: number;
  };
  unlocked: boolean;
  unlockedAt: number | null;
  tier: number; // 成就等级（铜/银/金）
}

// 成就进度
export interface AchievementProgress {
  achievementId: string;
  current: number;
}

// ==================== Phase 3 新增类型 ====================

// 地图区域类型
export type RegionType = 'village' | 'forest' | 'desert' | 'snow' | 'volcano' | 'sky';

// 地图区域
export interface MapRegion {
  id: string;
  name: string;
  type: RegionType;
  description: string;
  icon: string;
  position: { x: number; y: number }; // 地图上的位置（百分比）
  unlocked: boolean;
  explored: boolean;
  explorationProgress: number; // 0-100
  requiredLevel: number;
  requiredChapter?: number;
  challenges: RegionChallenge[];
  rewards: {
    exp: number;
    coins: number;
    specialItem?: string;
  };
  connections: string[]; // 连接的其他区域ID
}

// 区域挑战
export interface RegionChallenge {
  id: string;
  name: string;
  description: string;
  type: 'word_count' | 'time' | 'boss' | 'collection';
  target: number;
  completed: boolean;
}

// 剧情章节
export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  storyText: string[]; // 剧情文本段落
  wordCountTarget: number;
  requiredLevel: number;
  completed: boolean;
  unlocked: boolean;
  rewards: {
    exp: number;
    coins: number;
    unlockRegion?: string;
    unlockFeature?: string;
  };
  // 剧情对话
  dialogues: Dialogue[];
}

// 对话
export interface Dialogue {
  id: number;
  speaker: string;
  speakerIcon: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised';
}

// 主题皮肤
export interface ThemeSkin {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview: string;
  colors: {
    bg: string;
    panel: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    border: string;
  };
  unlocked: boolean;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 字体特效
export interface FontEffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview: string;
  cssClass: string;
  unlocked: boolean;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// 徽章
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'writing' | 'combat' | 'collection' | 'special';
  unlocked: boolean;
  unlockedAt: number | null;
  requirement: string;
}

// 商店商品
export interface ShopItem {
  id: string;
  type: 'skin' | 'font' | 'badge' | 'consumable';
  itemId: string;
  cost: number;
  discount?: number; // 折扣百分比
  limited: boolean;
  stock?: number; // 限时商品库存
  availableUntil?: number; // 限时截止时间
}

// 灵感碎片
export interface InspirationFragment {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'plot' | 'character' | 'setting' | 'dialogue';
  content: string; // 具体的灵感内容
  collected: boolean;
  collectedAt: number | null;
}

// 写作素材
export interface WritingMaterial {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'prompt' | 'template' | 'tip';
  content: string;
  unlocked: boolean;
  requiredFragments: number;
}

// 地图探索状态
export interface MapExplorationState {
  currentRegion: string | null;
  visitedRegions: string[];
  totalExplorationProgress: number;
}

// 剧情进度
export interface StoryProgress {
  currentChapter: number;
  completedChapters: number[];
  totalWordCountInStory: number;
}

// 收集进度
export interface CollectionProgress {
  unlockedSkins: string[];
  unlockedFonts: string[];
  unlockedBadges: string[];
  collectedFragments: string[];
  currentSkin: string;
  currentFont: string;
}

// ==================== 冒险创作模式新增类型 ====================

// 冒险剧情节点
export interface AdventureNode {
  id: string;
  type: 'intro' | 'choice' | 'battle' | 'ending';
  title: string;
  description: string;
  prompt: string; // 提示玩家写什么
  minWords: number;
  requiredKeyWords?: string[]; // 可选的关键词要求
  reward: {
    exp: number;
    coins: number;
  };
  nextNodes: string[];
  completed: boolean;
  playerContent?: string; // 玩家填写的内容
  feedback?: string; // AI 反馈（模拟）
}

// 冒险剧情
export interface AdventureStory {
  id: string;
  title: string;
  description: string;
  icon: string;
  nodes: AdventureNode[];
  currentNodeId: string;
  completed: boolean;
  unlocked: boolean;
}

// 冒险模式进度
export interface AdventureProgress {
  currentStoryId: string | null;
  completedStories: string[];
  totalAdventureWords: number;
}

// ==================== 装备系统新增类型 ====================

// 装备部位
export type EquipmentSlot = 'helmet' | 'armor' | 'leggings' | 'weapon' | 'ring';

// 装备稀有度
export type EquipmentRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';

// 单件装备
export interface Equipment {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  rarity: EquipmentRarity;
  icon: string;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    luck: number;
  };
  specialEffect?: string; // 特殊效果
  unlocked: boolean;
  equipped: boolean;
}

// 抽奖奖品类型
export type LootBoxPrizeType = 'equipment' | 'coins' | 'exp' | 'special_item';

// 抽奖奖品
export interface LootBoxPrize {
  id: string;
  type: LootBoxPrizeType;
  name: string;
  description: string;
  icon: string;
  rarity: EquipmentRarity;
  value: number | string;
  dropRate: number; // 掉落概率 0-1
}

// 抽奖历史
export interface LootBoxHistory {
  id: string;
  timestamp: number;
  prize: LootBoxPrize;
}

// ==================== 主角自定义系统新增类型 ====================

// 角色性别
export type CharacterGender = 'male' | 'female';

// 皮肤色调
export type SkinTone = '#FDEBD0' | '#F5CBA7' | '#E8DAEF' | '#D7BDE2' | '#C39BD3' | '#BB8FCE' | '#AED6F1' | '#AED6F1' | '#85C1E9' | '#5DADE2' | '#58D68D' | '#82E0AA' | '#F8C471' | '#F0B27A' | '#E59866' | '#CA6F1E';

// 发色
export type HairColor = '#1A1A1A' | '#2C1810' | '#4A2C17' | '#6B4423' | '#8B5A2B' | '#D4A574' | '#F5DEB3' | '#FFD700' | '#FF6B35' | '#E63946' | '#9B59B6' | '#3498DB' | '#2ECC71' | '#1ABC9C';

// 眼睛颜色
export type EyeColor = '#1A1A1A' | '#4A3728' | '#5D4037' | '#795548' | '#8D6E63' | '#607D8B' | '#455A64' | '#37474F' | '#263238' | '#2196F3' | '#03A9F4' | '#00BCD4' | '#009688' | '#4CAF50';

// 发型
export type HairStyle = 'short_messy' | 'short_neat' | 'long_flowing' | 'long_wavy' | 'ponytail' | 'bun' | 'spiky' | 'bob' | 'braid';

// 眉形
export type EyebrowStyle = 'thin' | 'natural' | 'thick' | 'arched' | 'straight';

// 鼻型
export type NoseStyle = 'small' | 'medium' | 'large' | 'straight' | 'aquiline';

// 唇形
export type LipStyle = 'thin' | 'natural' | 'full' | 'heart';

// 下巴形状
export type JawStyle = 'soft' | 'defined' | 'sharp' | 'square';

// 角色风格
export type CharacterStyle = 'warrior' | 'mage' | 'rogue' | 'knight' | 'archer';

// 艺术风格
export type ArtStyle = 'ink' | 'oil' | 'watercolor' | 'minimalist';

// 角色外观
export interface CharacterAppearance {
  gender: CharacterGender;
  artStyle: ArtStyle;
  skinTone: SkinTone;
  hairColor: HairColor;
  hairStyle: HairStyle;
  eyeColor: EyeColor;
  eyebrowStyle: EyebrowStyle;
  noseStyle: NoseStyle;
  lipStyle: LipStyle;
  jawStyle: JawStyle;
  outfitStyle: CharacterStyle;
  battleCry: string; // 战斗口号
}

// ==================== 综合状态管理 ====================

// 装备商店状态
export interface EquipmentState {
  inventory: Equipment[]; // 已获得的装备
  equipped: Record<EquipmentSlot, string | null>; // 当前装备的装备ID
}

// 抽奖系统状态
export interface LootBoxState {
  drawsRemaining: number; // 今日剩余抽奖次数
  history: LootBoxHistory[]; // 抽奖历史
  totalDraws: number; // 总抽奖次数
  lastDrawDate: string | null; // 上次抽奖日期 YYYY-MM-DD
}

// 主角自定义状态
export interface CustomCharacterState {
  appearance: CharacterAppearance;
}
