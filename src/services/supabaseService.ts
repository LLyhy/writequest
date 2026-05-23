import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

// 类型定义
type PublishedWork = Database['public']['Tables']['published_works']['Row']
type User = Database['public']['Tables']['users']['Row']

/**
 * Supabase服务 - 处理所有与Supabase的交互
 */
export class SupabaseService {
  /**
   * 获取当前用户
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return null
    }
    return user
  }

  /**
   * 获取用户个人资料
   */
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('获取用户资料失败:', error)
      return null
    }
    return data
  }

  /**
   * 获取所有发布的作品
   */
  static async getPublishedWorks(limit: number = 20, offset: number = 0) {
    const { data, error, count } = await supabase
      .from('published_works')
      .select('*, users!author_id(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('获取作品失败:', error)
      return { works: [], total: 0 }
    }
    
    return { works: data || [], total: count || 0 }
  }

  /**
   * 获取单个作品
   */
  static async getWorkById(workId: string): Promise<PublishedWork | null> {
    const { data, error } = await supabase
      .from('published_works')
      .select('*, users!author_id(*)')
      .eq('id', workId)
      .single()
    
    if (error) {
      console.error('获取作品失败:', error)
      return null
    }
    
    // 增加浏览量
    await this.incrementView(workId)
    
    return data
  }

  /**
   * 发布作品
   */
  static async publishWork(title: string, content: string, tags: string[] = []) {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('需要登录')
    }

    const wordCount = content.trim().split(/\s+/).length

    const { data, error } = await supabase
      .from('published_works')
      .insert({
        author_id: user.id,
        title,
        content,
        word_count: wordCount,
        tags,
      })
      .select()
      .single()

    if (error) {
      console.error('发布作品失败:', error)
      throw error
    }

    return data
  }

  /**
   * 增加浏览量
   */
  static async incrementView(workId: string) {
    await supabase.rpc('increment_view', { work_id: workId })
  }

  /**
   * 点赞/取消点赞
   */
  static async toggleLike(workId: string) {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('需要登录')
    }

    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('work_id', workId)
      .single()

    if (existingLike) {
      // 取消点赞
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
      
      // 减少作品点赞数
      await supabase.rpc('decrement_likes', { work_id: workId })
      return false
    } else {
      // 点赞
      await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          work_id: workId
        })
      
      // 增加作品点赞数
      await supabase.rpc('increment_likes', { work_id: workId })
      return true
    }
  }

  /**
   * 获取作品评论
   */
  static async getComments(workId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*, users!author_id(*)')
      .eq('work_id', workId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('获取评论失败:', error)
      return []
    }
    
    return data || []
  }

  /**
   * 添加评论
   */
  static async addComment(workId: string, content: string) {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('需要登录')
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        work_id: workId,
        author_id: user.id,
        content
      })
      .select('*, users!author_id(*)')
      .single()

    if (error) {
      console.error('添加评论失败:', error)
      throw error
    }

    // 更新评论数
    await supabase.rpc('increment_comments', { work_id: workId })

    return data
  }

  /**
   * 邮箱登录
   */
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw error
    }
    
    return data
  }

  /**
   * 邮箱注册
   */
  static async signUpWithEmail(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    })
    
    if (error) {
      throw error
    }
    
    // 创建用户资料
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        username
      })
    }
    
    return data
  }

  /**
   * 退出登录
   */
  static async signOut() {
    await supabase.auth.signOut()
  }
}
