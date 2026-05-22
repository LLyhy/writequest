import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorState } from '../types';

interface EditorStoreState extends EditorState {
  // 额外的编辑器状态
  isDirty: boolean;
  activeDocumentId: string | null;
  documents: Record<string, { title: string; content: string; updatedAt: number }>;
}

interface EditorActions {
  // 内容管理
  setContent: (content: string) => void;
  updateStats: () => void;
  clearContent: () => void;

  // 文档管理
  createDocument: (title?: string) => string;
  loadDocument: (id: string) => void;
  saveDocument: (id: string, title?: string) => void;
  deleteDocument: (id: string) => void;

  // 状态
  markAsSaved: () => void;
  setDirty: (isDirty: boolean) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

// 统计字数和字符数
const calculateStats = (content: string): { wordCount: number; charCount: number } => {
  // 中文字符计数
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文单词计数（按空格分割的非空字符串）
  const englishWords = content
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const wordCount = chineseChars + englishWords;
  const charCount = content.length;

  return { wordCount, charCount };
};

export const useEditorStore = create<EditorStoreState & EditorActions>()(
  persist(
    (set, get) => ({
      // State
      content: '',
      wordCount: 0,
      charCount: 0,
      lastSaved: null,
      isDirty: false,
      activeDocumentId: null,
      documents: {},

      // Actions
      setContent: (content) => {
        const { wordCount, charCount } = calculateStats(content);
        set({
          content,
          wordCount,
          charCount,
          isDirty: true,
        });
      },

      updateStats: () => {
        const { content } = get();
        const { wordCount, charCount } = calculateStats(content);
        set({ wordCount, charCount });
      },

      clearContent: () => {
        set({
          content: '',
          wordCount: 0,
          charCount: 0,
          isDirty: false,
        });
      },

      createDocument: (title) => {
        const id = generateId();
        const newTitle = title || `未命名文档 ${new Date().toLocaleDateString()}`;
        set((state) => ({
          documents: {
            ...state.documents,
            [id]: {
              title: newTitle,
              content: '',
              updatedAt: Date.now(),
            },
          },
          activeDocumentId: id,
          content: '',
          wordCount: 0,
          charCount: 0,
          isDirty: false,
        }));
        return id;
      },

      loadDocument: (id) => {
        const { documents } = get();
        const doc = documents[id];
        if (doc) {
          const { wordCount, charCount } = calculateStats(doc.content);
          set({
            activeDocumentId: id,
            content: doc.content,
            wordCount,
            charCount,
            isDirty: false,
          });
        }
      },

      saveDocument: (id, title) => {
        const { content, documents } = get();
        const existingDoc = documents[id];

        set((state) => ({
          documents: {
            ...state.documents,
            [id]: {
              title: title || existingDoc?.title || '未命名文档',
              content,
              updatedAt: Date.now(),
            },
          },
          lastSaved: Date.now(),
          isDirty: false,
        }));
      },

      deleteDocument: (id) => {
        set((state) => {
          const { [id]: _, ...remainingDocs } = state.documents;
          return {
            documents: remainingDocs,
            activeDocumentId: state.activeDocumentId === id ? null : state.activeDocumentId,
            content: state.activeDocumentId === id ? '' : state.content,
            wordCount: state.activeDocumentId === id ? 0 : state.wordCount,
            charCount: state.activeDocumentId === id ? 0 : state.charCount,
          };
        });
      },

      markAsSaved: () => {
        set({
          lastSaved: Date.now(),
          isDirty: false,
        });
      },

      setDirty: (isDirty) => {
        set({ isDirty });
      },
    }),
    {
      name: 'writequest-editor',
      partialize: (state) => ({
        documents: state.documents,
        lastSaved: state.lastSaved,
      }),
    }
  )
);
