import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore, useCharacterStore, useGameStore, useMapStore } from '../../stores';
import { PixelPanel } from '../ui/PixelPanel';
import { PixelButton } from '../ui/PixelButton';
import { StoryChapter } from '../../types';
import { Book, Lock, Check, ChevronRight, X, MessageCircle, Trophy } from 'lucide-react';

interface StoryPanelProps {
  onClose: () => void;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ onClose }) => {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  
  const { 
    chapters, 
    currentChapter,
    completeChapter, 
    canCompleteChapter,
    startDialogue,
    nextDialogue,
    skipDialogue,
    getCurrentDialogue
  } = useStoryStore();
  
  const { character, addExp } = useCharacterStore();
  const { addCoins } = useGameStore();
  const { unlockRegion } = useMapStore();
  
  const currentChapterData = chapters.find(c => c.id === currentChapter);
  const dialogue = getCurrentDialogue();
  
  const handleChapterClick = (chapter: StoryChapter) => {
    setSelectedChapter(chapter);
  };
  
  const handleStartChapter = (chapter: StoryChapter) => {
    if (chapter.unlocked && !chapter.completed) {
      startDialogue(chapter.id);
      setShowDialogue(true);
    }
  };
  
  const handleNextDialogue = () => {
    const next = nextDialogue();
    if (!next) {
      // 对话结束，可以完成章节
      setShowDialogue(false);
    }
  };
  
  const handleCompleteChapter = (chapter: StoryChapter) => {
    if (canCompleteChapter(chapter.id, character?.totalWords || 0)) {
      completeChapter(chapter.id);
      
      // 发放奖励
      addExp(chapter.rewards.exp);
      addCoins(chapter.rewards.coins);
      
      // 解锁区域
      if (chapter.rewards.unlockRegion) {
        unlockRegion(chapter.rewards.unlockRegion);
      }
      
      setSelectedChapter(null);
    }
  };
  
  const getChapterStatus = (chapter: StoryChapter) => {
    if (chapter.completed) return 'completed';
    if (chapter.id === currentChapter && chapter.unlocked) return 'current';
    if (chapter.unlocked) return 'unlocked';
    return 'locked';
  };

  return (
    <PixelPanel className="relative" title="主线剧情" titleIcon="📖">
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>
      
      {/* 当前章节进度 */}
      {currentChapterData && (
        <div className="mb-4 p-3 bg-pixel-bg/50 rounded border-2 border-pixel-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-pixel text-pixel-accent">当前章节</span>
            <span className="text-xs font-mono text-gray-500">
              进度: {Math.min(100, Math.round(((character?.totalWords || 0) / currentChapterData.wordCountTarget) * 100))}%
            </span>
          </div>
          <h3 className="font-pixel text-white mb-1">{currentChapterData.title}</h3>
          <p className="text-xs text-gray-400 font-mono">{currentChapterData.subtitle}</p>
          <div className="mt-2 h-2 bg-pixel-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-pixel-accent"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((character?.totalWords || 0) / currentChapterData.wordCountTarget) * 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {/* 章节列表 */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {chapters.map((chapter) => {
          const status = getChapterStatus(chapter);
          
          return (
            <motion.button
              key={chapter.id}
              onClick={() => handleChapterClick(chapter)}
              className={`w-full p-3 rounded border-2 text-left transition-all ${
                status === 'completed' 
                  ? 'bg-pixel-primary/20 border-pixel-primary' 
                  : status === 'current'
                  ? 'bg-pixel-accent/20 border-pixel-accent'
                  : status === 'unlocked'
                  ? 'bg-pixel-panel border-pixel-border hover:border-pixel-secondary'
                  : 'bg-gray-800/50 border-gray-700 opacity-60'
              }`}
              whileHover={status !== 'locked' ? { scale: 1.02 } : {}}
              whileTap={status !== 'locked' ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  status === 'completed' 
                    ? 'bg-pixel-primary' 
                    : status === 'current'
                    ? 'bg-pixel-accent'
                    : status === 'unlocked'
                    ? 'bg-pixel-secondary'
                    : 'bg-gray-700'
                }`}>
                  {status === 'completed' ? (
                    <Check size={20} className="text-white" />
                  ) : status === 'locked' ? (
                    <Lock size={16} className="text-gray-500" />
                  ) : (
                    <Book size={18} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-pixel text-sm ${
                      status === 'locked' ? 'text-gray-500' : 'text-white'
                    }`}>
                      {chapter.title}
                    </h4>
                    {status === 'current' && (
                      <span className="text-xs bg-pixel-accent text-pixel-border px-2 py-0.5 rounded font-bold">
                        进行中
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{chapter.subtitle}</p>
                </div>
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* 章节详情 */}
      <AnimatePresence>
        {selectedChapter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4"
          >
            <PixelPanel variant="inset" className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-pixel text-lg text-white">{selectedChapter.title}</h3>
                  <p className="text-sm text-gray-400 font-mono">{selectedChapter.subtitle}</p>
                </div>
                {selectedChapter.completed && (
                  <div className="flex items-center gap-1 text-pixel-primary">
                    <Trophy size={16} />
                    <span className="text-xs font-pixel">已完成</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-300 font-mono mb-4">
                {selectedChapter.description}
              </p>
              
              {/* 故事预览 */}
              <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border mb-4">
                <h4 className="text-xs font-pixel text-gray-400 mb-2">故事预览</h4>
                <p className="text-sm text-gray-300 font-mono italic">
                  "{selectedChapter.storyText[0]}"
                </p>
              </div>
              
              {/* 目标与奖励 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-pixel-bg/50 p-2 rounded border border-pixel-border">
                  <span className="text-xs text-gray-500 font-mono">目标字数</span>
                  <p className="text-lg font-pixel text-white">{selectedChapter.wordCountTarget.toLocaleString()}</p>
                </div>
                <div className="bg-pixel-bg/50 p-2 rounded border border-pixel-border">
                  <span className="text-xs text-gray-500 font-mono">奖励</span>
                  <div className="flex items-center gap-2">
                    <span className="text-pixel-accent font-pixel">{selectedChapter.rewards.coins} 🪙</span>
                    <span className="text-pixel-primary font-pixel">{selectedChapter.rewards.exp} XP</span>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              {selectedChapter.unlocked && !selectedChapter.completed && (
                <div className="flex gap-2">
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStartChapter(selectedChapter)}
                    className="flex-1"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      开始剧情
                    </span>
                  </PixelButton>
                  
                  {canCompleteChapter(selectedChapter.id, character?.totalWords || 0) && (
                    <PixelButton
                      variant="accent"
                      size="sm"
                      onClick={() => handleCompleteChapter(selectedChapter)}
                      className="flex-1"
                    >
                      <span className="flex items-center gap-2">
                        <Check size={16} />
                        完成章节
                      </span>
                    </PixelButton>
                  )}
                </div>
              )}
              
              {!selectedChapter.unlocked && (
                <div className="text-center p-3 bg-gray-800/50 rounded">
                  <Lock size={20} className="mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500 font-mono">
                    完成第{selectedChapter.id - 1}章并达到等级{selectedChapter.requiredLevel}以解锁
                  </p>
                </div>
              )}
            </PixelPanel>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 对话界面 */}
      <AnimatePresence>
        {showDialogue && dialogue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDialogue(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <PixelPanel className="p-6">
                {/* 对话者 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-pixel-panel border-2 border-pixel-border flex items-center justify-center text-3xl">
                    {dialogue.speakerIcon}
                  </div>
                  <div>
                    <h4 className="font-pixel text-white">{dialogue.speaker}</h4>
                    <span className="text-xs text-gray-500 font-mono">
                      {dialogue.emotion === 'happy' && '😊 开心'}
                      {dialogue.emotion === 'sad' && '😢 悲伤'}
                      {dialogue.emotion === 'angry' && '😠 愤怒'}
                      {dialogue.emotion === 'surprised' && '😲 惊讶'}
                      {dialogue.emotion === 'neutral' && '😐 平静'}
                    </span>
                  </div>
                </div>
                
                {/* 对话内容 */}
                <div className="bg-pixel-bg/50 p-4 rounded border-2 border-pixel-border mb-4">
                  <p className="text-white font-mono leading-relaxed">
                    {dialogue.text}
                  </p>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <PixelButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      skipDialogue();
                      setShowDialogue(false);
                    }}
                    className="flex-1"
                  >
                    跳过
                  </PixelButton>
                  <PixelButton
                    variant="primary"
                    size="sm"
                    onClick={handleNextDialogue}
                    className="flex-1"
                  >
                    继续
                  </PixelButton>
                </div>
              </PixelPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PixelPanel>
  );
};
