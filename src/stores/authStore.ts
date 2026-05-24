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
}

export const useAuthStore = create<AuthState & AuthActions>()(
  (set) => ({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    profile: null,

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
          } else {
            set({
              isAuthenticated: false,
              user: null,
              profile: null,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({
            isAuthenticated: false,
            user: null,
            profile: null,
            isLoading: false,
          });
        }
      },

      login: async (email: string, password: string) => {
        try {
          const { error } = await supabaseService.auth.signIn(email, password);
          
          if (error) {
            return { success: false, error: error.message || '登录失败' };
          }
          
          await useAuthStore.getState().checkAuth();
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
          
          await useAuthStore.getState().checkAuth();
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
      }
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
  })
);
