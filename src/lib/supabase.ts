import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      works: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          excerpt: string | null;
          tags: string[] | null;
          word_count: number;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          excerpt?: string | null;
          tags?: string[] | null;
          word_count?: number;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          excerpt?: string | null;
          tags?: string[] | null;
          word_count?: number;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          work_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          work_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          work_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          work_id: string;
          content: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          work_id: string;
          content: string;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          work_id?: string;
          content?: string;
          parent_id?: string | null;
          created_at?: string;
        };
      };
      views: {
        Row: {
          id: string;
          work_id: string;
          viewer_id: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          viewer_id: string;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string;
          viewer_id?: string;
          viewed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_like_count: {
        Args: {
          work_id_param: string;
        };
        Returns: number;
      };
      get_comment_count: {
        Args: {
          work_id_param: string;
        };
        Returns: number;
      };
      get_view_count: {
        Args: {
          work_id_param: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Work = Database['public']['Tables']['works']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type View = Database['public']['Tables']['views']['Row'];