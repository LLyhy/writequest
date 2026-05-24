import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PublishedWork, DraftWork, WorkSortType, Comment } from '../types/showcase';
import { supabaseService } from '../services/supabaseService';
import type { Work, Profile, Comment as SupabaseComment } from '../lib/supabase';

interface ShowcaseState {
  publishedWorks: PublishedWork[];
  draftWorks: DraftWork[];
  currentSort: WorkSortType;
  currentFilter: string | null;
  isLoading: boolean;
  selectedWork: PublishedWork | null;
  error: string | null;
}

interface ShowcaseActions {
  fetchPublishedWorks: () => Promise<void>;
  publishWork: (work: Omit<PublishedWork, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePublishedWork: (workId: string, updates: Partial<PublishedWork>) => Promise<void>;
  deletePublishedWork: (workId: string) => Promise<void>;
  likeWork: (workId: string) => Promise<void>;
  unlikeWork: (workId: string) => Promise<void>;
  favoriteWork: (workId: string, userId: string) => void;
  unfavoriteWork: (workId: string, userId: string) => void;
  addComment: (workId: string, content: string, parentId?: string) => Promise<void>;
  deleteComment: (workId: string, commentId: string) => Promise<void>;
  createDraft: (draft: DraftWork) => void;
  updateDraft: (draftId: string, updates: Partial<DraftWork>) => void;
  deleteDraft: (draftId: string) => void;
  setSort: (sort: WorkSortType) => void;
  setFilter: (filter: string | null) => void;
  setLoading: (loading: boolean) => void;
  selectWork: (work: PublishedWork | null) => void;
  incrementViews: (workId: string) => Promise<void>;
  getSortedWorks: () => PublishedWork[];
  getWorksByAuthor: (authorId: string) => PublishedWork[];
  getDrafts: () => DraftWork[];
  resetShowcase: () => void;
}

// Helper function to convert Supabase Work to PublishedWork
const convertToPublishedWork = (work: Work & { profiles?: Profile | null }, comments: SupabaseComment[] = []): PublishedWork => {
  const profile = work.profiles;
  return {
    id: work.id,
    title: work.title,
    description: work.excerpt || '',
    content: work.content,
    tags: work.tags || [],
    authorId: work.user_id,
    authorName: profile?.display_name || profile?.username || '匿名作者',
    authorAvatar: profile?.avatar_url || '',
    coverImage: '', // Supabase doesn't have cover image yet
    wordCount: work.word_count,
    likes: 0, // We'll fetch this separately or use the RPC
    likedBy: [],
    favorites: 0,
    favoritedBy: [],
    comments: comments.map(comment => ({
      id: comment.id,
      userId: comment.user_id,
      userName: (comment as any).profiles?.display_name || (comment as any).profiles?.username || '匿名',
      userAvatar: (comment as any).profiles?.avatar_url || '',
      content: comment.content,
      createdAt: new Date(comment.created_at).getTime(),
      parentId: comment.parent_id,
    })),
    views: 0, // We'll fetch this separately or use the RPC
    createdAt: new Date(work.created_at).getTime(),
    updatedAt: new Date(work.updated_at).getTime(),
    isPublished: work.is_published,
  };
};

export const useShowcaseStore = create<ShowcaseState & ShowcaseActions>()(
  persist(
    (set, get) => ({
      publishedWorks: [],
      draftWorks: [],
      currentSort: 'latest',
      currentFilter: null,
      isLoading: false,
      selectedWork: null,
      error: null,

      fetchPublishedWorks: async () => {
        set({ isLoading: true, error: null });
        try {
          const { works, error } = await supabaseService.work.getPublishedWorks(1, 50);
          
          if (error) throw error;
          
          if (works) {
            const convertedWorks = works.map(work => convertToPublishedWork(work as any));
            
            // Fetch like counts and comment counts for each work
            for (const work of convertedWorks) {
              const [likeResult, commentResult] = await Promise.all([
                supabaseService.like.getLikeCount(work.id),
                supabaseService.comment.getCommentCount(work.id),
              ]);
              work.likes = likeResult.count || 0;
              work.comments = []; // We'll fetch comments when user clicks on work
            }
            
            set({ publishedWorks: convertedWorks });
          }
        } catch (error) {
          console.error('Failed to fetch works:', error);
          set({ error: '获取作品列表失败' });
        } finally {
          set({ isLoading: false });
        }
      },

      publishWork: async (workData) => {
        set({ isLoading: true, error: null });
        try {
          const { data: user } = await supabaseService.auth.getCurrentUser();
          if (!user) throw new Error('请先登录');

          const { data, error } = await supabaseService.work.createWork({
            user_id: user.id,
            title: workData.title,
            content: workData.content,
            excerpt: workData.description,
            tags: workData.tags,
            word_count: workData.wordCount,
            is_published: true,
            published_at: new Date().toISOString(),
          });

          if (error) throw error;

          // Refresh the list
          await get().fetchPublishedWorks();
        } catch (error) {
          console.error('Failed to publish work:', error);
          set({ error: '发布作品失败' });
        } finally {
          set({ isLoading: false });
        }
      },

      updatePublishedWork: async (workId, updates) => {
        try {
          await supabaseService.work.updateWork(workId, {
            title: updates.title,
            content: updates.content,
            excerpt: updates.description,
            tags: updates.tags,
          });
          
          // Update local state
          set((state) => ({
            publishedWorks: state.publishedWorks.map((work) =>
              work.id === workId ? { ...work, ...updates, updatedAt: Date.now() } : work
            ),
          }));
        } catch (error) {
          console.error('Failed to update work:', error);
          set({ error: '更新作品失败' });
        }
      },

      deletePublishedWork: async (workId) => {
        try {
          await supabaseService.work.deleteWork(workId);
          
          // Update local state
          set((state) => ({
            publishedWorks: state.publishedWorks.filter((work) => work.id !== workId),
          }));
        } catch (error) {
          console.error('Failed to delete work:', error);
          set({ error: '删除作品失败' });
        }
      },

      likeWork: async (workId) => {
        try {
          const { data, error } = await supabaseService.like.toggleLike(workId);
          
          if (error) throw error;
          
          if (data?.liked) {
            set((state) => ({
              publishedWorks: state.publishedWorks.map((work) =>
                work.id === workId
                  ? { ...work, likes: work.likes + 1 }
                  : work
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to like work:', error);
          set({ error: '点赞失败' });
        }
      },

      unlikeWork: async (workId) => {
        try {
          const { data, error } = await supabaseService.like.toggleLike(workId);
          
          if (error) throw error;
          
          if (!data?.liked) {
            set((state) => ({
              publishedWorks: state.publishedWorks.map((work) =>
                work.id === workId
                  ? { ...work, likes: Math.max(0, work.likes - 1) }
                  : work
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to unlike work:', error);
          set({ error: '取消点赞失败' });
        }
      },

      favoriteWork: (workId, userId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) => {
            if (work.id !== workId) return work;
            if (work.favoritedBy.includes(userId)) return work;
            return {
              ...work,
              favorites: work.favorites + 1,
              favoritedBy: [...work.favoritedBy, userId],
            };
          }),
        }));
      },

      unfavoriteWork: (workId, userId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) => {
            if (work.id !== workId) return work;
            if (!work.favoritedBy.includes(userId)) return work;
            return {
              ...work,
              favorites: work.favorites - 1,
              favoritedBy: work.favoritedBy.filter((id) => id !== userId),
            };
          }),
        }));
      },

      addComment: async (workId, content, parentId) => {
        try {
          const { data, error } = await supabaseService.comment.createComment(workId, content, parentId);
          
          if (error) throw error;
          
          if (data) {
            const newComment: Comment = {
              id: data.id,
              userId: data.user_id,
              userName: (data as any).profiles?.display_name || (data as any).profiles?.username || '匿名',
              userAvatar: (data as any).profiles?.avatar_url || '',
              content,
              createdAt: new Date(data.created_at).getTime(),
              parentId: data.parent_id,
            };
            
            set((state) => ({
              publishedWorks: state.publishedWorks.map((work) =>
                work.id === workId
                  ? { ...work, comments: [...work.comments, newComment] }
                  : work
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to add comment:', error);
          set({ error: '添加评论失败' });
        }
      },

      deleteComment: async (workId, commentId) => {
        try {
          await supabaseService.comment.deleteComment(commentId);
          
          set((state) => ({
            publishedWorks: state.publishedWorks.map((work) =>
              work.id === workId
                ? { ...work, comments: work.comments.filter((c) => c.id !== commentId) }
                : work
            ),
          }));
        } catch (error) {
          console.error('Failed to delete comment:', error);
          set({ error: '删除评论失败' });
        }
      },

      createDraft: (draft) => {
        set((state) => ({
          draftWorks: [draft, ...state.draftWorks],
        }));
      },

      updateDraft: (draftId, updates) => {
        set((state) => ({
          draftWorks: state.draftWorks.map((draft) =>
            draft.id === draftId ? { ...draft, ...updates, updatedAt: Date.now() } : draft
          ),
        }));
      },

      deleteDraft: (draftId) => {
        set((state) => ({
          draftWorks: state.draftWorks.filter((draft) => draft.id !== draftId),
        }));
      },

      setSort: (sort) => {
        set({ currentSort: sort });
      },

      setFilter: (filter) => {
        set({ currentFilter: filter });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      selectWork: (work) => {
        set({ selectedWork: work });
      },

      incrementViews: async (workId) => {
        try {
          await supabaseService.view.recordView(workId);
          
          set((state) => ({
            publishedWorks: state.publishedWorks.map((work) =>
              work.id === workId ? { ...work, views: work.views + 1 } : work
            ),
          }));
        } catch (error) {
          console.error('Failed to record view:', error);
          // Don't set error for this, it's not critical
        }
      },

      getSortedWorks: () => {
        const { publishedWorks, currentSort, currentFilter } = get();
        let works = [...publishedWorks];

        if (currentFilter) {
          works = works.filter(
            (work) =>
              work.title.toLowerCase().includes(currentFilter.toLowerCase()) ||
              work.tags.some((tag) => tag.toLowerCase().includes(currentFilter.toLowerCase()))
          );
        }

        switch (currentSort) {
          case 'latest':
            works.sort((a, b) => b.createdAt - a.createdAt);
            break;
          case 'popular':
            works.sort((a, b) => b.likes - a.likes);
            break;
          case 'wordCount':
            works.sort((a, b) => b.wordCount - a.wordCount);
            break;
          case 'random':
            works.sort(() => Math.random() - 0.5);
            break;
        }

        return works;
      },

      getWorksByAuthor: (authorId) => {
        return get().publishedWorks.filter((work) => work.authorId === authorId);
      },

      getDrafts: () => {
        return get().draftWorks;
      },

      resetShowcase: () => {
        set({
          publishedWorks: [],
          draftWorks: [],
          currentSort: 'latest',
          currentFilter: null,
          isLoading: false,
          selectedWork: null,
          error: null,
        });
      },
    }),
    {
      name: 'writequest-showcase',
      partialize: (state) => ({
        // Only persist drafts and local preferences, not the published works
        draftWorks: state.draftWorks,
        currentSort: state.currentSort,
        currentFilter: state.currentFilter,
      }),
    }
  )
);
