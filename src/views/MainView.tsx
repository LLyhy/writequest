import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore, useGameStore, useCollectionStore, useHeroStore, usePetStore, useLeaderboardStore } from '../stores';
import { CharacterStats } from '../components/character';
import { WritingEditor, WordCounter } from '../components/editor';
import { DailyQuests } from '../components/quests';
import { BossSelect, BossBattleComponent } from '../components/boss';
import { SkillTree } from '../components/skills';
import { AchievementPanel } from '../components/achievements';
import { StatsPanel } from '../components/stats';
import { WorldMap } from '../components/map';
import { StoryPanel } from '../components/story';
import { ShopPanel } from '../components/shop';
import { CollectionPanel } from '../components/collection';
import { AdventureModePanel } from '../components/adventure';
import { CharacterPanel } from '../components/character/CharacterPanel';
import { PixelPanel } from '../components/ui/PixelPanel';
import { CoinDisplay } from '../components/ui/CoinDisplay';
import { QuestCompleteAnimation } from '../components/ui/QuestCompleteAnimation';
import { PixelButton } from '../components/ui/PixelButton';
import { SidebarDrawer } from '../components/ui/SidebarDrawer';
import { MobileBottomNav } from '../components/layout';
import { PetDisplay, PetPanel } from '../components/pet';
import { LeaderboardPanel } from '../components/leaderboard';
import { Trophy, Zap, Swords, Brain, BarChart3, Map, BookOpen, ShoppingCart, Backpack, Sword, User, Sparkles, Menu, PawPrint } from 'lucide-react';
import type { Boss } from '../types';
import { DAILY_QUEST_DRAW_REWARD } from '../constants/game';

type ViewMode = 'main' | 'boss' | 'bossBattle' | 'skills' | 'achievements' | 'stats' | 'map' | 'story' | 'shop' | 'collection' | 'adventure' | 'character';

interface MainViewProps {
  onNavigateToShowcase: () => void;
  onNavigateToProfile: () => void;
}

export function MainView({ onNavigateToShowcase, onNavigateToProfile }: MainViewProps) {
  const character = useCharacterStore((state) => state.character);
  const coins = useGameStore((state) => state.coins);
  const checkAndRefreshDailyQuests = useGameStore((state) => state.checkAndRefreshDailyQuests);
  const unlockNextBoss = useGameStore((state) => state.unlockNextBoss);
  const { collectFragment, getRandomFragment } = useCollectionStore();
  const { addDraws } = useHeroStore();
  const { checkPetUnlocks, addPetExp } = usePetStore();
  const { addToWeeklyStats } = useLeaderboardStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [showQuestAnimation, setShowQuestAnimation] = useState(false);
  const [questReward, setQuestReward] = useState({ exp: 0, coins: 0 });
  const [showPetPanel, setShowPetPanel] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (character) {
      checkAndRefreshDailyQuests();
    }
  }, [character, checkAndRefreshDailyQuests]);

  useEffect(() => {
    if (character && Math.random() < 0.1) {
      const fragment = getRandomFragment();
      if (fragment) {
        collectFragment(fragment.id);
      }
    }
  }, [character?.totalWords, collectFragment, getRandomFragment]);

  useEffect(() => {
    if (character) {
      checkPetUnlocks(character.level, character.streakDays);
      addToWeeklyStats(character.totalWords, character.streakDays, character.bossesDefeated);
    }
  }, [character, checkPetUnlocks, addToWeeklyStats]);

  useEffect(() => {
    if (character) {
      addPetExp(1);
    }
  }, [character?.totalWords, addPetExp]);

  const handleSelectBoss = (boss: Boss) => {
    setSelectedBoss(boss);
  };

  const handleBossVictory = () => {
    if (selectedBoss) {
      unlockNextBoss(selectedBoss.id);
    }
    setTimeout(() => {
      setSelectedBoss(null);
    }, 3000);
  };

  const handleBossDefeat = () => {
    setTimeout(() => {
      setSelectedBoss(null);
    }, 3000);
  };

  const handleQuestComplete = (exp: number, coins: number, isDaily: boolean = false) => {
    setQuestReward({ exp, coins });
    setShowQuestAnimation(true);
    if (isDaily) {
      addDraws(DAILY_QUEST_DRAW_REWARD);
    }
  };

  const handleNavigateToMain = () => {
    setViewMode('main');
    setSidebarOpen(false);
  };

  const handleNavigateToBoss = () => {
    setViewMode('boss');
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="space-y-4">
      <CharacterStats />
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
              <p className="font-pixel text-sm text-white">{character?.level}</p>
            </div>
          </div>
        </PixelPanel>
      </div>
      {/* 核心功能 - 两排布局 */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <PixelButton
          variant="danger"
          size="sm"
          onClick={() => {
            setViewMode('boss');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <Swords size={16} />
          <span className="text-xs hidden sm:inline">Boss</span>
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setViewMode('skills');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <Brain size={16} />
          <span className="text-xs hidden sm:inline">技能</span>
        </PixelButton>
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setViewMode('achievements');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <Trophy size={16} />
          <span className="text-xs hidden sm:inline">成就</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={() => {
            setShowLeaderboard(true);
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <BarChart3 size={16} />
          <span className="text-xs hidden sm:inline">排行</span>
        </PixelButton>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setShowPetPanel(true);
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <PawPrint size={16} />
          <span className="text-xs hidden sm:inline">宠物</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={() => {
            setViewMode('stats');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <BarChart3 size={16} />
          <span className="text-xs hidden sm:inline">统计</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={() => {
            setViewMode('map');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <Map size={16} />
          <span className="text-xs hidden sm:inline">地图</span>
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setViewMode('story');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <BookOpen size={16} />
          <span className="text-xs hidden sm:inline">剧情</span>
        </PixelButton>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setViewMode('shop');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <ShoppingCart size={16} />
          <span className="text-xs hidden sm:inline">商店</span>
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setViewMode('collection');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <Backpack size={16} />
          <span className="text-xs hidden sm:inline">收集</span>
        </PixelButton>
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setViewMode('character');
            setSidebarOpen(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-2"
        >
          <User size={16} />
          <span className="text-xs hidden sm:inline">角色</span>
        </PixelButton>
        <div></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <PixelButton
          variant="accent"
          size="md"
          onClick={() => {
            onNavigateToShowcase();
            setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>广场</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="md"
          onClick={() => {
            onNavigateToProfile();
            setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-2"
        >
          <User size={16} />
          <span>我的</span>
        </PixelButton>
      </div>
      <PixelButton
        variant="primary"
        size="md"
        onClick={() => {
          setViewMode('adventure');
          setSidebarOpen(false);
        }}
        className="w-full flex items-center justify-center gap-2"
      >
        <Sword size={16} />
        <span>🐉 冒险创作模式</span>
      </PixelButton>
      {viewMode === 'main' && (
        <DailyQuests onQuestComplete={handleQuestComplete} />
      )}
      {viewMode === 'main' && <WordCounter />}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-4 pb-24 md:pb-4">
        {/* 移动端菜单按钮 - 仅移动端显示 */}
        <div className="md:hidden mb-4">
          <PixelButton
            variant="secondary"
            size="md"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu size={16} />
            <span>菜单</span>
          </PixelButton>
        </div>

        <AnimatePresence mode="wait">
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
          ) : viewMode === 'boss' ? (
            <motion.div
              key="boss"
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
              <BossSelect onSelectBoss={handleSelectBoss} />
            </motion.div>
          ) : viewMode === 'skills' ? (
            <motion.div
              key="skills"
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
              <SkillTree />
            </motion.div>
          ) : viewMode === 'achievements' ? (
            <motion.div
              key="achievements"
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
              <AchievementPanel />
            </motion.div>
          ) : viewMode === 'stats' ? (
            <motion.div
              key="stats"
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
              <StatsPanel />
            </motion.div>
          ) : viewMode === 'map' ? (
            <motion.div
              key="map"
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
              <WorldMap onClose={() => setViewMode('main')} />
            </motion.div>
          ) : viewMode === 'story' ? (
            <motion.div
              key="story"
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
              <StoryPanel onClose={() => setViewMode('main')} />
            </motion.div>
          ) : viewMode === 'shop' ? (
            <motion.div
              key="shop"
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
              <ShopPanel onClose={() => setViewMode('main')} />
            </motion.div>
          ) : viewMode === 'collection' ? (
            <motion.div
              key="collection"
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
              <CollectionPanel onClose={() => setViewMode('main')} />
            </motion.div>
          ) : viewMode === 'character' ? (
            <motion.div
              key="character"
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
              <CharacterPanel />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* 桌面端侧边栏 - 仅大屏幕显示 */}
                <div className="hidden lg:block lg:col-span-4">
                  <SidebarContent />
                </div>

                {/* 主内容区域 - 所有屏幕都占满 */}
                <div className="col-span-1 lg:col-span-8">
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
                          onClose={() => setSelectedBoss(null)}
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

      {/* 移动端侧边栏抽屉 - 仅移动端显示 */}
      <div className="md:hidden">
        <SidebarDrawer
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="菜单"
        >
          <SidebarContent />
        </SidebarDrawer>
      </div>

      {/* 移动端底部导航 - 仅移动端显示 */}
      <MobileBottomNav
        onNavigateToMain={handleNavigateToMain}
        onNavigateToBoss={handleNavigateToBoss}
        onNavigateToShowcase={onNavigateToShowcase}
        onNavigateToProfile={onNavigateToProfile}
        activeView={viewMode}
      />

      <QuestCompleteAnimation
        isVisible={showQuestAnimation}
        exp={questReward.exp}
        coins={questReward.coins}
        onComplete={() => setShowQuestAnimation(false)}
      />

      {/* 桌面端页脚 - 仅大屏幕显示 */}
      <footer className="hidden md:block border-t-2 border-pixel-border bg-pixel-panel mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-mono">
              WriteQuest · 让写作成为一场冒险
            </p>
            {character && (
              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                <span>字数: {character.totalWords.toLocaleString()}</span>
                <span>时间: {Math.floor(character.totalWritingTime / 60)}小时</span>
                <span>连续: {character.streakDays}天</span>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* 宠物显示 */}
      <PetDisplay />
      
      {/* 宠物面板 */}
      <PetPanel isOpen={showPetPanel} onClose={() => setShowPetPanel(false)} />
      
      {/* 排行榜面板 */}
      <LeaderboardPanel isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}
