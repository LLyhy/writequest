import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PublishedWork, DraftWork, WorkSortType, Comment } from '../types/showcase';

interface ShowcaseState {
  publishedWorks: PublishedWork[];
  draftWorks: DraftWork[];
  currentSort: WorkSortType;
  currentFilter: string | null;
  isLoading: boolean;
  selectedWork: PublishedWork | null;
}

interface ShowcaseActions {
  publishWork: (work: PublishedWork) => void;
  updatePublishedWork: (workId: string, updates: Partial<PublishedWork>) => void;
  deletePublishedWork: (workId: string) => void;
  likeWork: (workId: string, userId: string) => void;
  unlikeWork: (workId: string, userId: string) => void;
  favoriteWork: (workId: string, userId: string) => void;
  unfavoriteWork: (workId: string, userId: string) => void;
  addComment: (workId: string, comment: Comment) => void;
  deleteComment: (workId: string, commentId: string) => void;
  createDraft: (draft: DraftWork) => void;
  updateDraft: (draftId: string, updates: Partial<DraftWork>) => void;
  deleteDraft: (draftId: string) => void;
  setSort: (sort: WorkSortType) => void;
  setFilter: (filter: string | null) => void;
  setLoading: (loading: boolean) => void;
  selectWork: (work: PublishedWork | null) => void;
  incrementViews: (workId: string) => void;
  getSortedWorks: () => PublishedWork[];
  getWorksByAuthor: (authorId: string) => PublishedWork[];
  getDrafts: () => DraftWork[];
  resetShowcase: () => void;
}

export const useShowcaseStore = create<ShowcaseState & ShowcaseActions>()(
  persist(
    (set, get) => ({
      publishedWorks: [],
      draftWorks: [],
      currentSort: 'latest',
      currentFilter: null,
      isLoading: false,
      selectedWork: null,

      publishWork: (work) => {
        set((state) => ({
          publishedWorks: [work, ...state.publishedWorks],
        }));
      },

      updatePublishedWork: (workId, updates) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) =>
            work.id === workId ? { ...work, ...updates, updatedAt: Date.now() } : work
          ),
        }));
      },

      deletePublishedWork: (workId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.filter((work) => work.id !== workId),
        }));
      },

      likeWork: (workId, userId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) => {
            if (work.id !== workId) return work;
            if (work.likedBy.includes(userId)) return work;
            return {
              ...work,
              likes: work.likes + 1,
              likedBy: [...work.likedBy, userId],
            };
          }),
        }));
      },

      unlikeWork: (workId, userId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) => {
            if (work.id !== workId) return work;
            if (!work.likedBy.includes(userId)) return work;
            return {
              ...work,
              likes: work.likes - 1,
              likedBy: work.likedBy.filter((id) => id !== userId),
            };
          }),
        }));
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

      addComment: (workId, comment) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) =>
            work.id === workId ? { ...work, comments: [...work.comments, comment] } : work
          ),
        }));
      },

      deleteComment: (workId, commentId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) =>
            work.id === workId
              ? { ...work, comments: work.comments.filter((c) => c.id !== commentId) }
              : work
          ),
        }));
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

      incrementViews: (workId) => {
        set((state) => ({
          publishedWorks: state.publishedWorks.map((work) =>
            work.id === workId ? { ...work, views: work.views + 1 } : work
          ),
        }));
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
        });
      },
    }),
    {
      name: 'writequest-showcase',
    }
  )
);
