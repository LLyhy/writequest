import React from 'react';
import { motion } from 'framer-motion';
import { PixelPanel } from '../ui';
import { useAdventureStore } from '../../stores';
import { CheckCircle2, Circle } from 'lucide-react';

export const AdventureProgress: React.FC = () => {
  const { currentStory, getStoryProgress } = useAdventureStore();
  const progress = getStoryProgress();
  
  if (!currentStory) {
    return null;
  }

  return (
    <PixelPanel className="p-4 mb-4" title="冒险进度" titleIcon="📊">
      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
          <span>0%</span>
          <span>{progress}%</span>
          <span>100%</span>
        </div>
        <div className="h-3 bg-pixel-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pixel-primary to-pixel-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* 章节进度 */}
      <div className="space-y-2">
        {currentStory.nodes.map((node, idx) => (
          <div
            key={node.id}
            className={`flex items-center gap-3 p-2 rounded ${
              node.completed ? 'bg-pixel-primary/20' : 'bg-pixel-bg/50'
            }`}
          >
            <div className={node.completed ? 'text-pixel-primary' : 'text-gray-500'}>
              {node.completed ? (
                <CheckCircle2 size={20} />
              ) : (
                <Circle size={20} />
              )}
            </div>
            <div className="flex-1">
              <span className={`text-sm font-mono ${
                node.completed ? 'text-white' : 'text-gray-400'
              }`}>
                {idx + 1}. {node.title}
              </span>
            </div>
            {node.completed && (
              <span className="text-xs text-pixel-primary font-mono">
                ✓ 已完成
              </span>
            )}
          </div>
        ))}
      </div>
    </PixelPanel>
  );
};
