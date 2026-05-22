import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoryChapter, StoryProgress, Dialogue } from '../types';
import { STORY_CHAPTERS } from '../constants/game';

interface StoryState extends StoryProgress {
  chapters: StoryChapter[];
  currentDialogueIndex: number;
  isInDialogue: boolean;
}

interface StoryActions {
  // 章节进度
  completeChapter: (chapterId: number) => void;
  unlockChapter: (chapterId: number) => void;
  
  // 获取当前章节
  getCurrentChapter: () => StoryChapter | null;
  
  // 获取已解锁章节
  getUnlockedChapters: () => StoryChapter[];
  
  // 获取已完成章节
  getCompletedChapters: () => StoryChapter[];
  
  // 检查章节是否可解锁
  canUnlockChapter: (chapterId: number, playerLevel: number) => boolean;
  
  // 检查章节是否可完成
  canCompleteChapter: (chapterId: number, wordCount: number) => boolean;
  
  // 对话系统
  startDialogue: (chapterId: number) => void;
  nextDialogue: () => Dialogue | null;
  skipDialogue: () => void;
  getCurrentDialogue: () => Dialogue | null;
  
  // 更新章节字数进度
  updateChapterWordCount: (wordCount: number) => void;
  
  // 获取下一章
  getNextChapter: () => StoryChapter | null;
  
  // 重置剧情
  resetStory: () => void;
}

export const useStoryStore = create<StoryState & StoryActions>()(
  persist(
    (set, get) => ({
      // State
      chapters: STORY_CHAPTERS,
      currentChapter: 1,
      completedChapters: [],
      totalWordCountInStory: 0,
      currentDialogueIndex: 0,
      isInDialogue: false,

      // Actions
      completeChapter: (chapterId) => {
        const { chapters, completedChapters } = get();
        const chapter = chapters.find(c => c.id === chapterId);
        
        if (!chapter || chapter.completed) return;
        
        set((state) => ({
          chapters: state.chapters.map(c =>
            c.id === chapterId ? { ...c, completed: true } : c
          ),
          completedChapters: [...completedChapters, chapterId],
          currentChapter: chapterId + 1,
          isInDialogue: false,
          currentDialogueIndex: 0,
        }));
        
        // 自动解锁下一章
        const nextChapter = chapters.find(c => c.id === chapterId + 1);
        if (nextChapter) {
          set((state) => ({
            chapters: state.chapters.map(c =>
              c.id === chapterId + 1 ? { ...c, unlocked: true } : c
            ),
          }));
        }
      },

      unlockChapter: (chapterId) => {
        set((state) => ({
          chapters: state.chapters.map(c =>
            c.id === chapterId ? { ...c, unlocked: true } : c
          ),
        }));
      },

      getCurrentChapter: () => {
        const { chapters, currentChapter } = get();
        return chapters.find(c => c.id === currentChapter) || null;
      },

      getUnlockedChapters: () => {
        return get().chapters.filter(c => c.unlocked);
      },

      getCompletedChapters: () => {
        return get().chapters.filter(c => c.completed);
      },

      canUnlockChapter: (chapterId, playerLevel) => {
        const { chapters, completedChapters } = get();
        const chapter = chapters.find(c => c.id === chapterId);
        
        if (!chapter || chapter.unlocked) return false;
        
        // 检查等级要求
        if (playerLevel < chapter.requiredLevel) return false;
        
        // 检查前一章是否完成
        if (chapterId > 1 && !completedChapters.includes(chapterId - 1)) return false;
        
        return true;
      },

      canCompleteChapter: (chapterId, wordCount) => {
        const { chapters } = get();
        const chapter = chapters.find(c => c.id === chapterId);
        
        if (!chapter || chapter.completed || !chapter.unlocked) return false;
        
        return wordCount >= chapter.wordCountTarget;
      },

      startDialogue: (chapterId) => {
        const { chapters } = get();
        const chapter = chapters.find(c => c.id === chapterId);
        
        if (!chapter || chapter.dialogues.length === 0) return;
        
        set({
          isInDialogue: true,
          currentDialogueIndex: 0,
        });
      },

      nextDialogue: () => {
        const { chapters, currentChapter, currentDialogueIndex } = get();
        const chapter = chapters.find(c => c.id === currentChapter);
        
        if (!chapter) return null;
        
        const nextIndex = currentDialogueIndex + 1;
        if (nextIndex >= chapter.dialogues.length) {
          set({ isInDialogue: false, currentDialogueIndex: 0 });
          return null;
        }
        
        set({ currentDialogueIndex: nextIndex });
        return chapter.dialogues[nextIndex];
      },

      skipDialogue: () => {
        set({ isInDialogue: false, currentDialogueIndex: 0 });
      },

      getCurrentDialogue: () => {
        const { chapters, currentChapter, currentDialogueIndex, isInDialogue } = get();
        if (!isInDialogue) return null;
        
        const chapter = chapters.find(c => c.id === currentChapter);
        if (!chapter) return null;
        
        return chapter.dialogues[currentDialogueIndex] || null;
      },

      updateChapterWordCount: (wordCount) => {
        set({ totalWordCountInStory: wordCount });
      },

      getNextChapter: () => {
        const { chapters, currentChapter } = get();
        return chapters.find(c => c.id === currentChapter + 1) || null;
      },

      resetStory: () => {
        set({
          chapters: STORY_CHAPTERS.map(c => ({
            ...c,
            completed: false,
            unlocked: c.id === 1,
          })),
          currentChapter: 1,
          completedChapters: [],
          totalWordCountInStory: 0,
          currentDialogueIndex: 0,
          isInDialogue: false,
        });
      },
    }),
    {
      name: 'writequest-story',
    }
  )
);
