import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdventureStory, AdventureNode, AdventureProgress } from '../types';
import { ADVENTURE_STORIES, getRandomAdventureFeedback, checkKeyWords } from '../constants/game';

interface AdventureState extends AdventureProgress {
  stories: AdventureStory[];
  currentStory: AdventureStory | null;
}

interface AdventureActions {
  // 选择故事
  selectStory: (storyId: string) => void;
  
  // 完成当前节点
  completeNode: (nodeId: string, content: string) => { success: boolean; message: string };
  
  // 获取当前节点
  getCurrentNode: () => AdventureNode | null;
  
  // 获取当前故事进度
  getStoryProgress: () => number;
  
  // 重置当前故事
  resetCurrentStory: () => void;
  
  // 重置所有
  resetAll: () => void;
}

export const useAdventureStore = create<AdventureState & AdventureActions>()(
  persist(
    (set, get) => ({
      // State
      stories: ADVENTURE_STORIES,
      currentStoryId: null,
      completedStories: [],
      totalAdventureWords: 0,
      currentStory: null,

      // Actions
      selectStory: (storyId) => {
        const story = get().stories.find(s => s.id === storyId);
        if (story) {
          set({ 
            currentStoryId: storyId, currentStory: story });
        }
      },
      
      completeNode: (nodeId, content) => {
        const { stories, currentStoryId, totalAdventureWords } = get();
        const storyIndex = stories.findIndex(s => s.id === currentStoryId);
        
        if (storyIndex === -1) {
          return { success: false, message: '未找到故事' };
        }
        
        const story = stories[storyIndex];
        const nodeIndex = story.nodes.findIndex(n => n.id === nodeId);
        
        if (nodeIndex === -1) {
          return { success: false, message: '未找到节点' };
        }
        
        const node = story.nodes[nodeIndex];
        
        // 检查字数
        const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
        
        if (wordCount < node.minWords) {
          return { 
            success: false, 
            message: `字数不够哦，还需要写 ${node.minWords - wordCount} 个字！` 
          };
        }
        
        // 检查关键词
        if (node.requiredKeyWords && node.requiredKeyWords.length > 0) {
          if (!checkKeyWords(content, node.requiredKeyWords)) {
            return { 
              success: false, 
              message: `缺少必要关键词哦！需要包含：${node.requiredKeyWords.join('、')}` 
            };
          }
        }
        
        // 生成反馈
        const feedback = getRandomAdventureFeedback();
        
        // 更新节点
        const updatedNodes = story.nodes.map((n, idx) => {
          if (idx === nodeIndex) {
            return {
              ...n, 
              completed: true, 
              playerContent: content,
              feedback: feedback
            };
          }
          return n;
        });
        
        // 更新当前节点
        const nextNodeId = node.nextNodes[0] || null;
        const updatedStory = {
          ...story,
          nodes: updatedNodes,
          currentNodeId: nextNodeId || story.currentNodeId,
          completed: nextNodeId === null,
        };
        
        // 更新 state
        const updatedStories = [...stories];
        updatedStories[storyIndex] = updatedStory;
        
        // 更新完成的故事
        let newCompletedStories = get().completedStories;
        if (nextNodeId === null && !newCompletedStories.includes(story.id)) {
          newCompletedStories = [...newCompletedStories, story.id];
        }
        
        set({
          stories: updatedStories,
          currentStory: updatedStory,
          completedStories: newCompletedStories,
          totalAdventureWords: totalAdventureWords + wordCount,
        });
        
        return { 
          success: true, 
          message: '太棒了！节点完成！' 
        };
      },
      
      getCurrentNode: () => {
        const { stories, currentStoryId } = get();
        if (!currentStoryId) return null;
        
        const story = stories.find(s => s.id === currentStoryId);
        if (!story) return null;
        
        return story.nodes.find(n => n.id === story.currentNodeId) || null;
      },
      
      getStoryProgress: () => {
        const { stories, currentStoryId } = get();
        if (!currentStoryId) return 0;
        
        const story = stories.find(s => s.id === currentStoryId);
        if (!story) return 0;
        
        const completedNodes = story.nodes.filter(n => n.completed).length;
        return Math.round((completedNodes / story.nodes.length) * 100);
      },
      
      resetCurrentStory: () => {
        const { stories, currentStoryId } = get();
        if (!currentStoryId) return;
        
        const storyIndex = stories.findIndex(s => s.id === currentStoryId);
        if (storyIndex === -1) return;
        
        const originalStory = ADVENTURE_STORIES.find(s => s.id === currentStoryId);
        if (!originalStory) return;
        
        const updatedStories = [...stories];
        updatedStories[storyIndex] = { ...originalStory };
        
        set({
          stories: updatedStories,
          currentStory: { ...originalStory },
        });
      },
      
      resetAll: () => {
        set({
          stories: ADVENTURE_STORIES,
          currentStoryId: null,
          currentStory: null,
          completedStories: [],
          totalAdventureWords: 0,
        });
      },
    }),
    {
      name: 'writequest-adventure',
    }
  )
);
