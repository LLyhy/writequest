# WriteQuest - Supabase 集成方案

## 🎯 目标

将WriteQuest从本地存储升级到云端同步！

## 📋 技术栈

| 组件 | 技术 |
|------|------|
| 数据库 | Supabase PostgreSQL |
| 认证 | Supabase Auth |
| 实时同步 | Supabase Realtime |
| 文件存储 | Supabase Storage |
| 后端逻辑 | Supabase Edge Functions (可选) |

## 🗄️ 数据库表设计

### 1. users (用户表)

```sql
create table users (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  bio text,
  total_words integer default 0,
  streak_days integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table users enable row level security;

create policy "Users can view their own profile" on users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on users
  for update using (auth.uid() = id);
```

### 2. published_works (作品表)

```sql
create table published_works (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references auth.users on delete cascade,
  title text not null,
  content text not null,
  word_count integer default 0,
  tags text[] default '{}',
  views integer default 0,
  likes integer default 0,
  comments_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table published_works enable row level security;

create policy "Everyone can view published works" on published_works
  for select using (true);

create policy "Users can create their own works" on published_works
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own works" on published_works
  for update using (auth.uid() = author_id);

create policy "Users can delete their own works" on published_works
  for delete using (auth.uid() = author_id);
```

### 3. likes (点赞表)

```sql
create table likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  work_id uuid references published_works on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, work_id)
);

alter table likes enable row level security;

create policy "Users can view all likes" on likes
  for select using (true);

create policy "Users can create their own likes" on likes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes" on likes
  for delete using (auth.uid() = user_id);
```

### 4. comments (评论表)

```sql
create table comments (
  id uuid default uuid_generate_v4() primary key,
  work_id uuid references published_works on delete cascade,
  author_id uuid references auth.users on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table comments enable row level security;

create policy "Everyone can view comments" on comments
  for select using (true);

create policy "Users can create comments" on comments
  for insert with check (auth.uid() = author_id);

create policy "Users can update/delete their own comments" on comments
  for all using (auth.uid() = author_id);
```

## 🔧 设置步骤

### 1. 创建Supabase项目

1. 访问 https://supabase.com
2. 注册并创建新项目
3. 获取项目 URL 和 anon key

### 2. 设置环境变量

创建 `.env.local`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 4. 运行SQL脚本

在Supabase SQL Editor中运行上面的SQL

## 📚 Supabase资源

- 文档: https://supabase.com/docs
- Auth: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database
- Realtime: https://supabase.com/docs/guides/realtime
