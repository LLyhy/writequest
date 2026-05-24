import { create } from 'zustand';
import { supabaseService } from '../services/supabaseService';
import type { UserProfile } from '../types/showcase';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  profile: UserProfile | null;
}

interface AuthActions {
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  syncProfileToUserStore: () => void;
}

// 循环引用解决：懒加载 userProfileStore
let userProfileStore: any = null;

export const useAuthStore = create<AuthState & AuthActions>()(
  (set, get) => ({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    profile: null,

    syncProfileToUserStore: () => {
      if (!userProfileStore) {
        try {
          const { useUserProfileStore: store } = require('./userProfileStore');
          userProfileStore = store;
        } catch (e) {
          console.error('Failed to load userProfileStore:', e);
          return;
        }
      }
      
      const { profile } = get();
      if (profile) {
        userProfileStore.getState().syncFromAuthProfile(profile);
      }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        try {
          const user = await supabaseService.auth.getCurrentUser();
          
          if (user) {
            const { profile } = await supabaseService.auth.getCurrentProfile();
            
            let userProfile = null;
            if (profile) {
              userProfile = {
                id: profile.id,
                username: profile.username,
                displayName: profile.display_name || profile.username,
                avatarUrl: profile.avatar_url || '',
                bio: '',
                followers: [],
                following: [],
                totalLikes: 0,
                totalWorks: 0,
                totalWords: 0,
                createdAt: new Date(profile.created_at || Date.now()).getTime(),
              };
            }
            
            set({
              isAuthenticated: true,
              user,
              profile: userProfile,
              isLoading: false,
            });
            
            if (userProfile) {
              get().syncProfileToUserStore();
            }
          } else {
            set({
              isAuthenticated: false,
              user: null,
              profile: null,
              isLoading: false,
            });
            
            // 重置 user profile store
            if (!userProfileStore) {
              try {
                const { useUserProfileStore: store } = require('./userProfileStore');
                userProfileStore = store;
              } catch (e) {
                console.error('Failed to load userProfileStore:', e);
              }
            }
            if (userProfileStore) {
              userProfileStore.getState().resetProfile();
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({
            isAuthenticated: false,
            user: null,
            profile: null,
            isLoading: false,
          });
          
          // 重置 user profile store
          if (!userProfileStore) {
            try {
              const { useUserProfileStore: store } = require('./userProfileStore');
              userProfileStore = store;
            } catch (e) {
              console.error('Failed to load userProfileStore:', e);
            }
          }
          if (userProfileStore) {
            userProfileStore.getState().resetProfile();
          }
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { error } = await supabaseService.auth.signIn(email, password);
          
          if (error) {
            return { success: false, error: error.message || '登录失败' };
          }
          
          await get().checkAuth();
          return { success: true };
        } catch (error: any) {
          console.error('Login error:', error);
          return { success: false, error: error.message || '登录失败' };
        }
      },

      signup: async (email: string, password: string, username: string) => {
        try {
          const { error } = await supabaseService.auth.signUp(email, password, username);
          
          if (error) {
            return { success: false, error: error.message || '注册失败' };
          }
          
          await get().checkAuth();
          return { success: true };
        } catch (error: any) {
          console.error('Signup error:', error);
          return { success: false, error: error.message || '注册失败' };
        }
      },

    logout: async () => {
      try {
        await supabaseService.auth.signOut();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        set({
          isAuthenticated: false,
          user: null,
          profile: null,
          isLoading: false,
        });
        
        // 重置 user profile store
        if (!userProfileStore) {
          try {
            const { useUserProfileStore: store } = require('./userProfileStore');
            userProfileStore = store;
          } catch (e) {
            console.error('Failed to load userProfileStore:', e);
          }
        }
        if (userProfileStore) {
          userProfileStore.getState().resetProfile();
        }
      }
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
  })
);
