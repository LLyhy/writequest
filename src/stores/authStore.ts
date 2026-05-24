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
  (set, get) => ({
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
            
            if (profile) {
              set({
                isAuthenticated: true,
                user,
                profile: {
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
                  createdAt: new Date(profile.created_at).getTime(),
                },
                isLoading: false,
              });
            } else {
              set({
                isAuthenticated: true,
                user,
                profile: null,
                isLoading: false,
              });
            }
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
          
          if (error) throw error;
          
          await get().checkAuth();
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || '登录失败' };
        }
      },

      signup: async (email: string, password: string, username: string) => {
        try {
          const { error } = await supabaseService.auth.signUp(email, password, username);
          
          if (error) throw error;
          
          await get().checkAuth();
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || '注册失败' };
        }
      },

    logout: async () => {
      try {
        await supabaseService.auth.signOut();
        set({
          isAuthenticated: false,
          user: null,
          profile: null,
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
  })
);
