import { supabase, type Profile, type Work, type Comment } from '../lib/supabase';

export const authService = {
  async signUp(email: string, password: string, username: string) {
    // 自动检测当前环境的 URL
    const getRedirectUrl = () => {
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      // 默认回退
      return 'http://localhost:5173';
    };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        emailRedirectTo: getRedirectUrl(),
      },
    });
    
    if (data?.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: username,
      });
    }
    
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getCurrentProfile(): Promise<{ profile: Profile | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { profile: null, error: null };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { profile, error };
  },

  async updateProfile(profile: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('请先登录') };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .single();

    return { data, error };
  },
};

export const workService = {
  async createWork(work: Omit<Work, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('works')
      .insert([work])
      .select()
      .single();

    return { data, error };
  },

  async updateWork(id: string, updates: Partial<Work>) {
    const { data, error } = await supabase
      .from('works')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async deleteWork(id: string) {
    const { error } = await supabase
      .from('works')
      .delete()
      .eq('id', id);

    return { error };
  },

  async getWorkById(id: string): Promise<{ work: Work | null; error: any }> {
    const { data: work, error } = await supabase
      .from('works')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('id', id)
      .single();

    return { work, error };
  },

  async getPublishedWorks(page = 1, limit = 10) {
    const { data: works, error } = await supabase
      .from('works')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    return { works, error };
  },

  async getUserWorks(userId: string, page = 1, limit = 10) {
    const { data: works, error } = await supabase
      .from('works')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    return { works, error };
  },

  async searchWorks(query: string, page = 1, limit = 10) {
    const { data: works, error } = await supabase
      .from('works')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    return { works, error };
  },

  async getWorksByTag(tag: string, page = 1, limit = 10) {
    const { data: works, error } = await supabase
      .from('works')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('is_published', true)
      .contains('tags', [tag])
      .order('published_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    return { works, error };
  },
};

export const likeService = {
  async toggleLike(workId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('请先登录') };
    }

    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('work_id', workId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return { data: null, error: checkError };
    }

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      return { data: { liked: false }, error };
    } else {
      const { data, error } = await supabase
        .from('likes')
        .insert([{ user_id: user.id, work_id: workId }])
        .select()
        .single();
      return { data: { ...data, liked: true }, error };
    }
  },

  async checkLike(workId: string): Promise<{ liked: boolean; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { liked: false, error: null };
    }

    const { data: like, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('work_id', workId)
      .single();

    if (error && error.code === 'PGRST116') {
      return { liked: false, error: null };
    }

    return { liked: !!like, error };
  },

  async getLikeCount(workId: string): Promise<{ count: number; error: any }> {
    const { data, error } = await supabase
      .rpc('get_like_count', { work_id_param: workId });

    return { count: data as number || 0, error };
  },
};

export const commentService = {
  async createComment(workId: string, content: string, parentId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: new Error('请先登录') };
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        user_id: user.id,
        work_id: workId,
        content,
        parent_id: parentId || null,
      }])
      .select('*, profiles(username, display_name, avatar_url)')
      .single();

    return { data, error };
  },

  async updateComment(id: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async deleteComment(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    return { error };
  },

  async getComments(workId: string): Promise<{ comments: Comment[]; error: any }> {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('work_id', workId)
      .order('created_at', { ascending: true });

    return { comments: comments || [], error };
  },

  async getCommentCount(workId: string): Promise<{ count: number; error: any }> {
    const { data, error } = await supabase
      .rpc('get_comment_count', { work_id_param: workId });

    return { count: data as number || 0, error };
  },
};

export const viewService = {
  async recordView(workId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: new Error('请先登录') };
    }

    const { error } = await supabase
      .from('views')
      .insert([{ work_id: workId, viewer_id: user.id }]);

    return { error };
  },

  async getViewCount(workId: string): Promise<{ count: number; error: any }> {
    const { data, error } = await supabase
      .rpc('get_view_count', { work_id_param: workId });

    return { count: data as number || 0, error };
  },
};

export const supabaseService = {
  auth: authService,
  work: workService,
  like: likeService,
  comment: commentService,
  view: viewService,
};