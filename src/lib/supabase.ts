import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 导出类型定义
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          total_words: number
          streak_days: number
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          total_words?: number
          streak_days?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          total_words?: number
          streak_days?: number
          created_at?: string
        }
      }
      published_works: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          word_count: number
          tags: string[]
          views: number
          likes: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          word_count?: number
          tags?: string[]
          views?: number
          likes?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          word_count?: number
          tags?: string[]
          views?: number
          likes?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          work_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          work_id: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          work_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          work_id: string
          author_id: string
          content: string
          created_at?: string
        }
      }
    }
  }
}
