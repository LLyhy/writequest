import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelPanel, PixelButton } from '../ui';
import { useAdventureStore, useCharacterStore, useGameStore } from '../../stores';
import { Check, AlertCircle, Sparkles, Trophy, X } from 'lucide-react';

interface AdventureNodeEditorProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AdventureNodeEditor: React.FC<AdventureNodeEditorProps> = ({ onComplete, onBack }) => {
  const { 
    currentStory, 
    getCurrentNode, 
    completeNode,
    resetCurrentStory 
  } = useAdventureStore();
  const { addExp } = useCharacterStore();
  const { addCoins } = useGameStore();
  
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  
  const currentNode = getCurrentNode();
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  useEffect(() => {
    if (currentNode && currentNode.playerContent) {
      setContent(currentNode.playerContent);
      setShowCompleted(true);
    } else {
      setContent('');
      setShowCompleted(false);
    }
  }, [currentNode]);
  
  if (!currentStory || !currentNode) {
    return null;
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const result = completeNode(currentNode.id, content);
    
    if (result.success) {
      setIsError(false);
      setFeedback(result.message);
      
      addExp(currentNode.reward.exp);
      addCoins(currentNode.reward.coins);
      
      setTimeout(() => {
        setFeedback(null);
        onComplete();
      }, 2000);
    } else {
      setIsError(true);
      setFeedback(result.message);
      
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    }
    
    setIsSubmitting(false);
  };
  
  const handleReset = () => {
    if (confirm('确定要重置当前故事吗？所有进度将丢失！')) {
      resetCurrentStory();
      setContent('');
      setShowCompleted(false);
      onBack();
    }
  };
  
  const isNextNodeAvailable = currentNode.nextNodes.length > 0;
  
  return (
    <PixelPanel className="p-6 relative" title={currentStory.title} titleIcon={currentStory.icon}>
      <button
        onClick={handleReset}
        className="absolute top-4 right-16 text-gray-500 hover:text-red-400 transition-colors"
        title="重置故事"
      >
        <X size={20} />
      </button>
      
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-3 rounded border-2 flex items-center gap-2 ${
              isError
                ? 'bg-red-900/30 border-red-700 text-red-300'
                : 'bg-green-900/30 border-green-700 text-green-300'
            }`}
          >
            {isError ? (
              <AlertCircle size={20} />
            ) : (
              <Check size={20} />
            )}
            <span className="font-mono">{feedback}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 节点标题和描述 */}
      <div className="mb-4 p-4 bg-pixel-bg/50 rounded border border-pixel-border">
        <h3 className="font-pixel text-xl text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">
            {currentNode.type === 'intro' && '🏁'}
            {currentNode.type === 'choice' && '🧭'}
            {currentNode.type === 'battle' && '⚔️'}
            {currentNode.type === 'ending' && '🏆'}
          </span>
          {currentNode.title}
        </h3>
        <p className="text-sm text-gray-400 font-mono mb-2">
          {currentNode.description}
        </p>
        <p className="text-sm text-pixel-accent font-mono">
          📝 {currentNode.prompt}
        </p>
      </div>
      
      {/* 任务要求 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border">
          <span className="text-xs text-gray-400 font-mono block mb-1">最低字数</span>
          <span className={`font-pixel text-lg ${
            wordCount >= currentNode.minWords ? 'text-pixel-primary' : 'text-yellow-400'
          }`}>
            {wordCount} / {currentNode.minWords}
          </span>
        </div>
        <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border">
          <span className="text-xs text-gray-400 font-mono block mb-1">奖励</span>
          <div className="flex gap-2 font-pixel">
            <span className="text-pixel-accent">{currentNode.reward.coins} 🪙</span>
            <span className="text-pixel-primary">{currentNode.reward.exp} XP</span>
          </div>
        </div>
      </div>
      
      {/* 关键词提示 */}
      {currentNode.requiredKeyWords && currentNode.requiredKeyWords.length > 0 && (
        <div className="bg-pixel-bg/50 p-3 rounded border border-pixel-border mb-4">
          <span className="text-xs text-gray-400 font-mono block mb-2">必须包含的关键词</span>
          <div className="flex flex-wrap gap-2">
            {currentNode.requiredKeyWords.map((kw) => {
              const hasKeyword = content.toLowerCase().includes(kw.toLowerCase());
              return (
                <span
                  key={kw}
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    hasKeyword
                      ? 'bg-pixel-primary text-pixel-bg'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {hasKeyword ? '✓' : '○'} {kw}
                </span>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 编辑器 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="在这里开始你的创作..."
        className="w-full min-h-64 p-4 rounded border-2 bg-pixel-bg border-pixel-border text-white font-mono text-sm resize-vertical focus:outline-none focus:border-pixel-primary"
        disabled={showCompleted}
      />
      
      {/* 操作按钮 */}
      <div className="flex gap-3 mt-4">
        <PixelButton
          variant="secondary"
          size="md"
          onClick={onBack}
          className="flex-1"
        >
          返回
        </PixelButton>
        
        {showCompleted ? (
          isNextNodeAvailable ? (
            <PixelButton
              variant="accent"
              size="md"
              onClick={onComplete}
              className="flex-1"
            >
              <Sparkles size={18} className="mr-1" /> 继续冒险
            </PixelButton>
          ) : (
            <PixelButton
              variant="primary"
              size="md"
              onClick={onBack}
              className="flex-1"
            >
              <Trophy size={18} className="mr-1" /> 完成冒险
            </PixelButton>
          )
        ) : (
          <PixelButton
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? '提交中...' : '完成这一章'}
          </PixelButton>
        )}
      </div>
    </PixelPanel>
  );
};
