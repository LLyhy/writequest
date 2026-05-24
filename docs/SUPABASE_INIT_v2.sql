-- =============================================
-- WriteQuest Supabase Database Setup v2
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Profiles Table
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies - allow viewing all profiles (for work showcase)
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- Works Table
-- =============================================
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[],
  word_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Works policies
CREATE POLICY "Anyone can view published works" ON works
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own works" ON works
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own works" ON works
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own works" ON works
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own works" ON works
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Likes Table
-- =============================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, work_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Likes policies - allow viewing all likes for published works
CREATE POLICY "Anyone can view likes for published works" ON likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM works 
      WHERE works.id = likes.work_id AND works.is_published = true
    )
  );

CREATE POLICY "Users can view their own likes" ON likes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Comments Table
-- =============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view comments on published works" ON comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM works 
      WHERE works.id = comments.work_id AND works.is_published = true
    )
  );

CREATE POLICY "Users can view their own comments" ON comments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Views Table
-- =============================================
CREATE TABLE IF NOT EXISTS views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_id UUID REFERENCES works(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view views on published works" ON views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM works 
      WHERE works.id = views.work_id AND works.is_published = true
    )
  );

CREATE POLICY "Users can record their views" ON views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- =============================================
-- Helper Functions
-- =============================================

-- Get like count for a work
CREATE OR REPLACE FUNCTION get_like_count(work_id_param UUID) 
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM likes WHERE work_id = work_id_param);
END;
$$ LANGUAGE plpgsql STABLE;

-- Get comment count for a work
CREATE OR REPLACE FUNCTION get_comment_count(work_id_param UUID) 
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM comments WHERE work_id = work_id_param);
END;
$$ LANGUAGE plpgsql STABLE;

-- Get view count for a work
CREATE OR REPLACE FUNCTION get_view_count(work_id_param UUID) 
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM views WHERE work_id = work_id_param);
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- Triggers
-- =============================================

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, 'user_' || substring(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at when work is updated
CREATE OR REPLACE FUNCTION update_work_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_work_updated_at ON works;
CREATE TRIGGER trigger_update_work_updated_at
BEFORE UPDATE ON works
FOR EACH ROW EXECUTE FUNCTION update_work_updated_at();

-- =============================================
-- Indexes for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_works_user_id ON works(user_id);
CREATE INDEX IF NOT EXISTS idx_works_is_published ON works(is_published);
CREATE INDEX IF NOT EXISTS idx_works_published_at ON works(published_at);
CREATE INDEX IF NOT EXISTS idx_likes_work_id ON likes(work_id);
CREATE INDEX IF NOT EXISTS idx_comments_work_id ON comments(work_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_views_work_id ON views(work_id);

-- =============================================
-- Grant execute permissions on functions
-- =============================================
GRANT EXECUTE ON FUNCTION get_like_count(UUID) TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_comment_count(UUID) TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_view_count(UUID) TO PUBLIC;

-- =============================================
-- Done!
-- =============================================
-- Now you need to:
-- 1. Enable email authentication in Supabase Auth settings
-- 2. Set up your environment variables
-- 3. Start using the API!
