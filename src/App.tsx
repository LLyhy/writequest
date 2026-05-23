import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore, useGameStore, useCollectionStore, useHeroStore } from './stores';
import { Header } from './components/layout/Header';
import { CharacterCreate, CharacterStats } from './components/character';
import { WritingEditor, WordCounter } from './components/editor';
import { DailyQuests } from './components/quests';
import { BossSelect, BossBattleComponent } from './components/boss';
import { SkillTree } from './components/skills';
import { AchievementPanel } from './components/achievements';
import { StatsPanel } from './components/stats';
import { WorldMap } from './components/map';
import { StoryPanel } from './components/story';
import { ShopPanel } from './components/shop';
import { CollectionPanel } from './components/collection';
import { AdventureModePanel } from './components/adventure';
import { CharacterPanel } from './components/character/CharacterPanel';
import { PixelPanel } from './components/ui/PixelPanel';
import { CoinDisplay } from './components/ui/CoinDisplay';
import { QuestCompleteAnimation } from './components/ui/QuestCompleteAnimation';
import { PixelButton } from './components/ui/PixelButton';
import { Trophy, Zap, Swords, Brain, BarChart3, Map, BookOpen, ShoppingCart, Backpack, Sword, User, Sparkles } from 'lucide-react';
import type { Boss } from './types';
import { DAILY_QUEST_DRAW_REWARD } from './constants/game';
import { ShowcasePage } from './pages/ShowcasePage';
import { ProfilePage } from './pages/ProfilePage';

type ViewMode = 'main' | 'boss' | 'bossBattle' | 'skills' | 'achievements' | 'stats' | 'map' | 'story' | 'shop' | 'collection' | 'adventure' | 'character' | 'showcase' | 'profile';

function App() {
  const character = useCharacterStore((state) => state.character);
  const isCreating = useCharacterStore((state) => state.isCreating);
  const setIsCreating = useCharacterStore((state) => state.setIsCreating);
  const coins = useGameStore((state) => state.coins);
  const checkAndRefreshDailyQuests = useGameStore((state) => state.checkAndRefreshDailyQuests);
  const unlockNextBoss = useGameStore((state) => state.unlockNextBoss);
  
  // Phase 3: 收集系统
  const { collectFragment, getRandomFragment } = useCollectionStore();
  
  // 新角色系统
  const { addDraws } = useHeroStore();

  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [showQuestAnimation, setShowQuestAnimation] = useState(false);
  const [questReward, setQuestReward] = useState({ exp: 0, coins: 0 });

  // 如果没有角色并且不在创建流程中，自动开始创建
  useEffect(() => {
    if (!character && !isCreating) {
      setIsCreating(true);
    }
  }, [character, isCreating, setIsCreating]);

  // 检查每日任务刷新
  useEffect(() => {
    if (character) {
      checkAndRefreshDailyQuests();
    }
  }, [character]);

  // Phase 3: 随机获得灵感碎片
  useEffect(() => {
    if (character && Math.random() < 0.1) { // 10% 概率获得灵感碎片
      const fragment = getRandomFragment();
      if (fragment) {
        collectFragment(fragment.id);
      }
    }
  }, [character?.totalWords]);

  // 角色创建完成
  const handleCreateComplete = () => {
    setIsCreating(false);
  };

  // 处理Boss选择
  const handleSelectBoss = (boss: Boss) => {
    setSelectedBoss(boss);
    setViewMode('bossBattle');
  };

  // 处理Boss战胜利
  const handleBossVictory = () => {
    if (selectedBoss) {
      unlockNextBoss(selectedBoss.id);
    }
    setTimeout(() => {
      setViewMode('main');
      setSelectedBoss(null);
    }, 3000);
  };

  // 处理Boss战失败
  const handleBossDefeat = () => {
    setTimeout(() => {
      setViewMode('main');
      setSelectedBoss(null);
    }, 3000);
  };

  // 处理任务完成动画
  const handleQuestComplete = (exp: number, coins: number, isDaily: boolean = false) => {
    setQuestReward({ exp, coins });
    setShowQuestAnimation(true);
    
    // 如果是每日任务，额外奖励抽奖机会
    if (isDaily) {
      addDraws(DAILY_QUEST_DRAW_REWARD);
    }
  };

  // 显示创建界面
  if (!character) {
    return (
      <div className="min-h-screen bg-pixel-bg">
        <CharacterCreate onComplete={handleCreateComplete} />
      </div>
    );
  }

  // 作品广场页面
  if (viewMode === 'showcase') {
    return (
      <div className="min-h-screen bg-pixel-bg">
        <Header
          onShowcaseClick={() => setViewMode('showcase')}
          onProfileClick={() => setViewMode('profile')}
          onBackToMain={() => setViewMode('main')}
          showBackButton={true}
        />
        <ShowcasePage onBack={() => setViewMode('main')} />
      </div>
    );
  }

  // 用户主页页面
  if (viewMode === 'profile') {
    return (
      <div className="min-h-screen bg-pixel-bg">
        <Header
          onShowcaseClick={() => setViewMode('showcase')}
          onProfileClick={() => setViewMode('profile')}
          onBackToMain={() => setViewMode('main')}
          showBackButton={true}
        />
        <ProfilePage onBack={() => setViewMode('main')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header
        onShowcaseClick={() => setViewMode('showcase')}
        onProfileClick={() => setViewMode('profile')}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        <AnimatePresence mode="wait">
          {/* 冒险创作模式 - 全屏 */}
          {viewMode === 'adventure' ? (
            <motion.div
              key="adventure"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="mb-4">
                <PixelButton
                  variant="secondary"
                  size="md"
                  onClick={() => setViewMode('main')}
                >
                  ← 返回主界面
                </PixelButton>
              </div>
              <AdventureModePanel onClose={() => setViewMode('main')} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 左侧边栏 - 角色信息和任务 */}
                <div className="lg:col-span-4 space-y-4">
                  {/* 角色统计 */}
                  <CharacterStats />

                  {/* 快速统计 */}
                  <div className="grid grid-cols-2 gap-3">
                    <PixelPanel className="p-3" animate={false}>
                      <div className="flex items-center gap-2">
                        <Trophy size={20} className="text-pixel-accent" />
                        <div>
                          <p className="text-xs text-gray-500 font-mono">金币</p>
                          <CoinDisplay amount={coins} size="sm" showIcon={false} />
                        </div>
                      </div>
                    </PixelPanel>
                    <PixelPanel className="p-3" animate={false}>
                      <div className="flex items-center gap-2">
                        <Zap size={20} className="text-pixel-primary" />
                        <div>
                          <p className="text-xs text-gray-500 font-mono">等级</p>
                          <p className="font-pixel text-sm text-white">{character.level}</p>
                        </div>
                      </div>
                    </PixelPanel>
                  </div>

                  {/* 功能按钮 */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <PixelButton
                      variant="danger"
                      size="sm"
                      onClick={() => setViewMode('boss')}
                      className="flex items-center justify-center gap-1"
                    >
                      <Swords size={14} />
                      <span className="text-xs">Boss</span>
                    </PixelButton>
                    <PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewMode('skills')}
                      className="flex items-center justify-center gap-1"
                    >
                      <Brain size={14} />
                      <span className="text-xs">技能</span>
                    </PixelButton>
                    <PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() => setViewMode('achievements')}
                      className="flex items-center justify-center gap-1"
                    >
                      <Trophy size={14} />
                      <span className="text-xs">成就</span>
                    </PixelButton>
                    <PixelButton
                      variant="primary"
                      size="sm"
                      onClick={() => setViewMode('stats')}
                      className="flex items-center justify-center gap-1"
                    >
                      <BarChart3 size={14} />
                      <span className="text-xs">统计</span>
                    </PixelButton>
                    <PixelButton
                      variant="primary"
                      size="sm"
                      onClick={() => setViewMode('map')}
                      className="flex items-center justify-center gap-1"
                    >
                      <Map size={14} />
                      <span className="text-xs">地图</span>
                    </PixelButton>
                    <PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewMode('story')}
                      className="flex items-center justify-center gap-1"
                    >
                      <BookOpen size={14} />
                      <span className="text-xs">剧情</span>
                    </PixelButton>
                    <PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() => setViewMode('shop')}
                      className="flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={14} />
                      <span className="text-xs">商店</span>
                    </PixelButton>
                    <PixelButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewMode('collection')}
                      className="flex items-center justify-center gap-1"
                    >
                      <Backpack size={14} />
                      <span className="text-xs">收集</span>
                    </PixelButton>
                    <PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() => setViewMode('character')}
                      className="flex items-center justify-center gap-1"
                    >
                      <User size={14} />
                      <span className="text-xs">角色</span>
                    </PixelButton>
                  </div>

                  {/* 广场和我的主页按钮 */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <PixelButton
                      variant="accent"
                      size="md"
                      onClick={() => setViewMode('showcase')}
                      className="flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>广场</span>
                    </PixelButton>
                    <PixelButton
                      variant="primary"
                      size="md"
                      onClick={() => setViewMode('profile')}
                      className="flex items-center justify-center gap-2"
                    >
                      <User size={16} />
                      <span>我的</span>
                    </PixelButton>
                  </div>

                  {/* 冒险创作模式按钮 */}
                  <PixelButton
                    variant="primary"
                    size="md"
                    onClick={() => setViewMode('adventure')}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Sword size={16} />
                    <span>🐉 冒险创作模式</span>
                  </PixelButton>

                  {/* 每日任务 */}
                  {viewMode === 'main' && (
                    <DailyQuests onQuestComplete={handleQuestComplete} />
                  )}

                  {/* 其他视图 */}
                  <AnimatePresence mode="wait">
                    {viewMode === 'boss' && (
                      <motion.div
                        key="boss"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <BossSelect onSelectBoss={handleSelectBoss} />
                      </motion.div>
                    )}

                    {viewMode === 'skills' && (
                      <motion.div
                        key="skills"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <SkillTree />
                      </motion.div>
                    )}

                    {viewMode === 'achievements' && (
                      <motion.div
                        key="achievements"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <AchievementPanel />
                      </motion.div>
                    )}

                    {viewMode === 'stats' && (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <StatsPanel />
                      </motion.div>
                    )}

                    {/* Phase 3 新视图 */}
                    {viewMode === 'map' && (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <WorldMap onClose={() => setViewMode('main')} />
                      </motion.div>
                    )}

                    {viewMode === 'story' && (
                      <motion.div
                        key="story"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <StoryPanel onClose={() => setViewMode('main')} />
                      </motion.div>
                    )}

                    {viewMode === 'shop' && (
                      <motion.div
                        key="shop"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <ShopPanel onClose={() => setViewMode('main')} />
                      </motion.div>
                    )}

                    {viewMode === 'collection' && (
                      <motion.div
                        key="collection"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <CollectionPanel onClose={() => setViewMode('main')} />
                      </motion.div>
                    )}
                    
                    {viewMode === 'character' && (
                      <motion.div
                        key="character"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <CharacterPanel />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 字数统计 */}
                  {viewMode === 'main' && <WordCounter />}
                </div>

                {/* 右侧主区域 */}
                <div className="lg:col-span-8">
                  <AnimatePresence mode="wait">
                    {viewMode === 'bossBattle' && selectedBoss ? (
                      <motion.div
                        key="bossBattle"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <BossBattleComponent
                          boss={selectedBoss}
                          onClose={() => setViewMode('main')}
                          onVictory={handleBossVictory}
                          onDefeat={handleBossDefeat}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="editor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <WritingEditor />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 任务完成动画 */}
      <QuestCompleteAnimation
        isVisible={showQuestAnimation}
        exp={questReward.exp}
        coins={questReward.coins}
        onComplete={() => setShowQuestAnimation(false)}
      />

      {/* 页脚 */}
      <footer className="border-t-2 border-pixel-border bg-pixel-panel mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-mono">
              WriteQuest · 让写作成为一场冒险
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
              <span>字数: {character.totalWords.toLocaleString()}</span>
              <span>时间: {Math.floor(character.totalWritingTime / 60)}小时</span>
              <span>连续: {character.streakDays}天</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
