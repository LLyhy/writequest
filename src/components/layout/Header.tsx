import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore, useGameStore, useTutorialStore } from '../../stores';
import { XPBar } from '../ui/XPBar';
import { CoinDisplay } from '../ui/CoinDisplay';
import { LevelBadge } from '../ui/LevelBadge';
import { PenTool, Settings, LogOut, Home, User, Sparkles, Database, HelpCircle } from 'lucide-react';
import { PixelButton } from '../ui/PixelButton';
import { DataExportModal, DataImportModal } from '../data';
import { TutorialModal } from '../tutorial';

interface HeaderProps {
  onSettingsClick?: () => void;
  onShowcaseClick?: () => void;
  onProfileClick?: () => void;
  onBackToMain?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onShowcaseClick,
  onProfileClick,
  onBackToMain,
  showBackButton = false,
}) => {
  const character = useCharacterStore((state) => state.character);
  const resetCharacter = useCharacterStore((state) => state.resetCharacter);
  const coins = useGameStore((state) => state.coins);
  const { completed: tutorialCompleted } = useTutorialStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (character && !tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [character, tutorialCompleted]);

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？这将删除你的角色和所有进度。')) {
      resetCharacter();
      window.location.reload();
    }
  };

  return (
    <header className="bg-pixel-panel border-b-2 border-pixel-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo + 导航 */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 bg-pixel-primary border-2 border-pixel-border flex items-center justify-center shadow-pixel-sm">
              <PenTool size={20} className="text-pixel-border" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-pixel text-sm text-white">WriteQuest</h1>
              <p className="text-xs text-gray-500 font-mono">写作冒险</p>
            </div>
            {showBackButton && onBackToMain ? (
              <button
                onClick={onBackToMain}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-pixel-accent transition-colors border border-pixel-border hover:border-pixel-accent rounded"
              >
                <Home size={12} />
                <span>返回</span>
              </button>
            ) : (
              <a
                href="/"
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-pixel-accent transition-colors border border-pixel-border hover:border-pixel-accent rounded"
                title="返回首页"
              >
                <Home size={12} />
                <span>首页</span>
              </a>
            )}
            {/* 新导航链接 */}
            {character && (
              <div className="flex items-center gap-2 ml-2">
                {onShowcaseClick && (
                  <button
                    onClick={onShowcaseClick}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-300 hover:text-pixel-accent transition-colors border border-transparent hover:border-pixel-accent rounded"
                  >
                    <Sparkles size={14} />
                    <span className="hidden md:inline">广场</span>
                  </button>
                )}
                {onProfileClick && (
                  <button
                    onClick={onProfileClick}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-300 hover:text-pixel-accent transition-colors border border-transparent hover:border-pixel-accent rounded"
                  >
                    <User size={14} />
                    <span className="hidden md:inline">我的</span>
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* 角色信息 */}
          {character ? (
            <motion.div
              className="flex items-center gap-6 flex-1 max-w-xl justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <LevelBadge level={character.level} />
                <div className="hidden sm:block">
                  <p className="font-pixel text-xs text-white">{character.name}</p>
                </div>
              </div>
              <div className="flex-1 hidden md:block">
                <XPBar level={character.level} exp={character.exp} size="sm" />
              </div>
            </motion.div>
          ) : (
            <div className="flex-1" />
          )}

          {/* 右侧操作 */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CoinDisplay amount={coins} size="sm" />

            <div className="flex items-center gap-1">
              {character && (
                <>
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowTutorial(true)}
                    className="p-1.5"
                    title="新手引导"
                  >
                    <HelpCircle size={14} />
                  </PixelButton>
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowExportModal(true)}
                    className="p-1.5 hidden sm:flex"
                    title="导出数据"
                  >
                    <Database size={14} />
                  </PixelButton>
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowImportModal(true)}
                    className="p-1.5 hidden sm:flex"
                    title="导入数据"
                  >
                    <Database size={14} />
                  </PixelButton>
                </>
              )}
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={onSettingsClick}
                className="p-1.5"
              >
                <Settings size={14} />
              </PixelButton>

              {character && (
                <PixelButton
                  variant="danger"
                  size="sm"
                  onClick={handleReset}
                  className="p-1.5 hidden sm:flex"
                >
                  <LogOut size={14} />
                </PixelButton>
              )}
            </div>
          </motion.div>
        </div>

        {/* 移动端经验条 */}
        {character && (
          <div className="mt-3 md:hidden">
            <XPBar level={character.level} exp={character.exp} size="sm" />
          </div>
        )}
      </div>

      {/* 数据管理模态框 */}
      <DataExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <DataImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </header>
  );
};
