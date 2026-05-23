import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types/showcase';

interface UserProfileState {
  currentUser: UserProfile | null;
  allProfiles: UserProfile[];
  isLoading: boolean;
}

interface UserProfileActions {
  createProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  followUser: (targetUserId: string) => void;
  unfollowUser: (targetUserId: string) => void;
  isFollowing: (targetUserId: string) => boolean;
  getProfile: (userId: string) => UserProfile | undefined;
  getAllProfiles: () => UserProfile[];
  getFollowers: (userId: string) => UserProfile[];
  getFollowing: (userId: string) => UserProfile[];
  setLoading: (loading: boolean) => void;
  addToTotalLikes: (amount: number) => void;
  addToTotalWorks: (amount: number) => void;
  addToTotalWords: (amount: number) => void;
  resetProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState & UserProfileActions>()(
  persist(
    (set, get) => ({
      currentUser: null,
      allProfiles: [],
      isLoading: false,

      createProfile: (profile) => {
        set((state) => ({
          currentUser: profile,
          allProfiles: [...state.allProfiles, profile],
        }));
      },

      updateProfile: (updates) => {
        set((state) => {
          if (!state.currentUser) return state;

          const updatedUser = { ...state.currentUser, ...updates };
          const updatedProfiles = state.allProfiles.map((profile) =>
            profile.id === updatedUser.id ? updatedUser : profile
          );

          return {
            currentUser: updatedUser,
            allProfiles: updatedProfiles,
          };
        });
      },

      followUser: (targetUserId) => {
        set((state) => {
          if (!state.currentUser) return state;
          if (state.currentUser.following.includes(targetUserId)) return state;

          const updatedUser = {
            ...state.currentUser,
            following: [...state.currentUser.following, targetUserId],
          };

          const updatedProfiles = state.allProfiles.map((profile) => {
            if (profile.id === updatedUser.id) return updatedUser;
            if (profile.id === targetUserId) {
              return {
                ...profile,
                followers: [...profile.followers, state.currentUser!.id],
              };
            }
            return profile;
          });

          return {
            currentUser: updatedUser,
            allProfiles: updatedProfiles,
          };
        });
      },

      unfollowUser: (targetUserId) => {
        set((state) => {
          if (!state.currentUser) return state;
          if (!state.currentUser.following.includes(targetUserId)) return state;

          const updatedUser = {
            ...state.currentUser,
            following: state.currentUser.following.filter((id) => id !== targetUserId),
          };

          const updatedProfiles = state.allProfiles.map((profile) => {
            if (profile.id === updatedUser.id) return updatedUser;
            if (profile.id === targetUserId) {
              return {
                ...profile,
                followers: profile.followers.filter((id) => id !== state.currentUser!.id),
              };
            }
            return profile;
          });

          return {
            currentUser: updatedUser,
            allProfiles: updatedProfiles,
          };
        });
      },

      isFollowing: (targetUserId) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        return currentUser.following.includes(targetUserId);
      },

      getProfile: (userId) => {
        return get().allProfiles.find((profile) => profile.id === userId);
      },

      getAllProfiles: () => {
        return get().allProfiles;
      },

      getFollowers: (userId) => {
        const { allProfiles } = get();
        const profile = allProfiles.find((p) => p.id === userId);
        if (!profile) return [];
        return allProfiles.filter((p) => profile.followers.includes(p.id));
      },

      getFollowing: (userId) => {
        const { allProfiles } = get();
        const profile = allProfiles.find((p) => p.id === userId);
        if (!profile) return [];
        return allProfiles.filter((p) => profile.following.includes(p.id));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      addToTotalLikes: (amount) => {
        set((state) => {
          if (!state.currentUser) return state;

          const updatedUser = {
            ...state.currentUser,
            totalLikes: state.currentUser.totalLikes + amount,
          };

          const updatedProfiles = state.allProfiles.map((profile) =>
            profile.id === updatedUser.id ? updatedUser : profile
          );

          return {
            currentUser: updatedUser,
            allProfiles: updatedProfiles,
          };
        });
      },

      addToTotalWorks: (amount) => {
        set((state) => {
          if (!state.currentUser) return state;

          const updatedUser = {
            ...state.currentUser,
            totalWorks: state.currentUser.totalWorks + amount,
          };

          const updatedProfiles = state.allProfiles.map((profile) =>
            profile.id === updatedUser.id ? updatedUser : profile
          );

          return {
            currentUser: updatedUser,
            allProfiles: updatedProfiles,
          };
        });
      },

      addToTotalWords: (amount) => {
        set((state) => {
          if (!state.currentUser) return state;

          const updatedUser = {
            ...state.currentUser,
            totalWords: state.currentUser.totalWords + amount,
          };

          const updatedProfiles = state.allProfiles.map((profile) =>
            profile.id === updatedUser.id ? updatedUser : profile
          );

          return {
            currentUser: updatedUser,
            allProfiles: updatedProfiles,
          };
        });
      },

      resetProfile: () => {
        set({
          currentUser: null,
          allProfiles: [],
          isLoading: false,
        });
      },
    }),
    {
      name: 'writequest-userprofile',
    }
  )
);
