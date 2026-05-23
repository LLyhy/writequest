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
import { useMediaQuery } from '../hooks';
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

  const isMobile = useMediaQuery('(max-width: 768px)');
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
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNavigateToBoss = () => {
    setViewMode('boss');
    if (isMobile) {
      setSidebarOpen(false);
    }
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
      <div className="grid grid-cols-3 gap-2 mb-3">
        <PixelButton
          variant="danger"
          size="sm"
          onClick={() => {
            setViewMode('boss');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <Swords size={14} />
          <span className="text-xs">Boss</span>
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setViewMode('skills');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <Brain size={14} />
          <span className="text-xs">技能</span>
        </PixelButton>
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setViewMode('achievements');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <Trophy size={14} />
          <span className="text-xs">成就</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={() => {
            setShowLeaderboard(true);
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <Trophy size={14} />
          <span className="text-xs">排行</span>
        </PixelButton>
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setShowPetPanel(true);
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <PawPrint size={14} />
          <span className="text-xs">宠物</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={() => {
            setViewMode('stats');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <BarChart3 size={14} />
          <span className="text-xs">统计</span>
        </PixelButton>
        <PixelButton
          variant="primary"
          size="sm"
          onClick={() => {
            setViewMode('map');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <Map size={14} />
          <span className="text-xs">地图</span>
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setViewMode('story');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <BookOpen size={14} />
          <span className="text-xs">剧情</span>
        </PixelButton>
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setViewMode('shop');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <ShoppingCart size={14} />
          <span className="text-xs">商店</span>
        </PixelButton>
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => {
            setViewMode('collection');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <Backpack size={14} />
          <span className="text-xs">收集</span>
        </PixelButton>
        <PixelButton
          variant="accent"
          size="sm"
          onClick={() => {
            setViewMode('character');
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-1"
        >
          <User size={14} />
          <span className="text-xs">角色</span>
        </PixelButton>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <PixelButton
          variant="accent"
          size="md"
          onClick={() => {
            onNavigateToShowcase();
            if (isMobile) setSidebarOpen(false);
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
            if (isMobile) setSidebarOpen(false);
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
          if (isMobile) setSidebarOpen(false);
        }}
        className="w-full flex items-center justify-center gap-2"
      >
        <Sword size={16} />
        <span>🐉 冒险创作模式</span>
      </PixelButton>
      {viewMode === 'main' && (
        <DailyQuests onQuestComplete={handleQuestComplete} />
      )}
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
      {viewMode === 'main' && <WordCounter />}
    </div>
  );

  return (
    <div className="flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 pb-20 md:pb-4">
        {/* 移动端菜单按钮 */}
        {isMobile && (
          <div className="mb-4">
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
        )}

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
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 桌面端侧边栏 */}
                {!isMobile && (
                  <div className="lg:col-span-4">
                    <SidebarContent />
                  </div>
                )}

                {/* 主内容区域 */}
                <div className={isMobile ? 'lg:col-span-12' : 'lg:col-span-8'}>
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

      {/* 移动端侧边栏抽屉 */}
      {isMobile && (
        <SidebarDrawer
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          title="菜单"
        >
          <SidebarContent />
        </SidebarDrawer>
      )}

      {/* 移动端底部导航 */}
      {isMobile && (
        <MobileBottomNav
          onNavigateToMain={handleNavigateToMain}
          onNavigateToBoss={handleNavigateToBoss}
          onNavigateToShowcase={onNavigateToShowcase}
          onNavigateToProfile={onNavigateToProfile}
          activeView={viewMode}
        />
      )}

      <QuestCompleteAnimation
        isVisible={showQuestAnimation}
        exp={questReward.exp}
        coins={questReward.coins}
        onComplete={() => setShowQuestAnimation(false)}
      />

      {/* 桌面端页脚 */}
      {!isMobile && (
        <footer className="border-t-2 border-pixel-border bg-pixel-panel mt-8">
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
      )}

      {/* 宠物显示 */}
      <PetDisplay />
      
      {/* 宠物面板 */}
      <PetPanel isOpen={showPetPanel} onClose={() => setShowPetPanel(false)} />
      
      {/* 排行榜面板 */}
      <LeaderboardPanel isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}
