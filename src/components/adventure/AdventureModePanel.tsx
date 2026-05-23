import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelPanel } from '../ui';
import { useAdventureStore } from '../../stores';
import { AdventureStorySelect } from './AdventureStorySelect';
import { AdventureProgress } from './AdventureProgress';
import { AdventureNodeEditor } from './AdventureNodeEditor';
import { BookOpen, Trophy, Map } from 'lucide-react';

type ViewMode = 'select' | 'adventure';

interface AdventureModePanelProps {
  onClose?: () => void;
}

export const AdventureModePanel: React.FC<AdventureModePanelProps> = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('select');
  const { currentStory, totalAdventureWords } = useAdventureStore();

  const handleStartAdventure = () => {
    setViewMode('adventure');
  };

  const handleNodeComplete = () => {
    // 节点完成后继续在冒险视图
  };

  const handleBackToSelect = () => {
    setViewMode('select');
  };

  return (
    <div className="min-h-[80vh] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧 - 进度和信息 */}
        <div className="lg:col-span-4 space-y-4">
          <PixelPanel className="p-4">
            <h2 className="font-pixel text-xl text-white mb-2 flex items-center gap-2">
              <BookOpen size={24} className="text-pixel-accent" />
              冒险创作模式
            </h2>
            <p className="text-sm text-gray-400 font-mono">
              选择一个主题故事，在冒险中发挥你的创意！
            </p>
          </PixelPanel>
          
          {/* 统计信息 */}
          <PixelPanel className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border text-center">
                <Trophy size={24} className="mx-auto mb-1 text-pixel-accent" />
                <p className="text-xs text-gray-400 font-mono">总字数</p>
                <p className="font-pixel text-lg text-white">
                  {totalAdventureWords.toLocaleString()}
                </p>
              </div>
              <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border text-center">
                <Map size={24} className="mx-auto mb-1 text-pixel-primary" />
                <p className="text-xs text-gray-400 font-mono">故事数</p>
                <p className="font-pixel text-lg text-white">
                  {currentStory ? 1 : 0}
                </p>
              </div>
            </div>
          </PixelPanel>
          
          {viewMode === 'adventure' && <AdventureProgress />}
        </div>
        
        {/* 右侧 - 主内容区 */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {viewMode === 'select' ? (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <AdventureStorySelect onStart={handleStartAdventure} />
              </motion.div>
            ) : (
              <motion.div
                key="adventure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <AdventureNodeEditor
                  onComplete={handleNodeComplete}
                  onBack={handleBackToSelect}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
