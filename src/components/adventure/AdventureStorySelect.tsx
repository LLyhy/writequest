import React from 'react';
import { motion } from 'framer-motion';
import { PixelPanel, PixelButton } from '../ui';
import { useAdventureStore } from '../../stores';
import { Trophy } from 'lucide-react';

interface AdventureStorySelectProps {
  onStart: () => void;
}

export const AdventureStorySelect: React.FC<AdventureStorySelectProps> = ({ onStart }) => {
  const { stories, selectStory, currentStory, completedStories } = useAdventureStore();

  const handleSelect = (storyId: string) => {
    selectStory(storyId);
    onStart();
  };

  return (
    <PixelPanel className="p-6" title="选择你的冒险" titleIcon="📚">
      <div className="space-y-4">
        {stories.map((story) => {
          const isCompleted = completedStories.includes(story.id);
          const isSelected = currentStory?.id === story.id;
          
          return (
            <motion.button
              key={story.id}
              onClick={() => handleSelect(story.id)}
              className={`w-full p-4 rounded border-2 text-left transition-all ${
                isSelected
                  ? 'bg-pixel-accent/20 border-pixel-accent'
                  : isCompleted
                  ? 'bg-pixel-primary/20 border-pixel-primary'
                  : 'bg-pixel-panel border-pixel-border hover:border-pixel-secondary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-4xl ${
                  isCompleted
                    ? 'bg-pixel-primary'
                    : 'bg-pixel-secondary'
                }`}>
                  {isCompleted ? (
                    <Trophy size={32} className="text-white" />
                  ) : (
                    <span>{story.icon}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-pixel text-lg text-white">
                      {story.title}
                    </h4>
                    {isCompleted && (
                      <span className="text-xs bg-pixel-primary text-white px-2 py-0.5 rounded font-bold">
                        已通关
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 font-mono">
                    {story.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {story.nodes.length} 个章节 · 字数约 {
                      story.nodes.reduce((sum, n) => sum + n.minWords, 0)
                    } 字
                  </p>
                </div>
                
                <PixelButton variant="primary" size="sm" className="flex-shrink-0">
                  {isSelected ? '继续' : '开始'}
                </PixelButton>
              </div>
            </motion.button>
          );
        })}
      </div>
    </PixelPanel>
  );
};
