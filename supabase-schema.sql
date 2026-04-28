-- ============================================================
-- 吃瓜平台数据库 schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. 用户档案（关联 auth.users）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 热点事件
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  cover_image TEXT,
  heat BIGINT DEFAULT 0,
  tag TEXT DEFAULT '娱乐',
  publish_date DATE DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '约需 5 分钟',
  summary TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 视频内容
CREATE TABLE IF NOT EXISTS event_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  thumbnail TEXT,
  video_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 文档内容
CREATE TABLE IF NOT EXISTS event_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  doc_type TEXT DEFAULT 'PDF' CHECK (doc_type IN ('PDF', 'Word', 'Excel', '截图', '其他')),
  size TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 时间线
CREATE TABLE IF NOT EXISTS event_timelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  event_time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 评论（第一期暂不启用，先建好结构）
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS 策略（行级安全）
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- profiles: 所有人可读，用户只能修改自己的
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- events: 所有人可读，只有管理员可写（暂时放开）
CREATE POLICY "events_public_read" ON events FOR SELECT USING (true);
CREATE POLICY "events_all_insert" ON events FOR INSERT WITH CHECK (true);

-- videos/docs/timelines: 所有人可读
CREATE POLICY "videos_public_read" ON event_videos FOR SELECT USING (true);
CREATE POLICY "videos_all_insert" ON event_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "docs_public_read" ON event_documents FOR SELECT USING (true);
CREATE POLICY "docs_all_insert" ON event_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "timelines_public_read" ON event_timelines FOR SELECT USING (true);
CREATE POLICY "timelines_all_insert" ON event_timelines FOR INSERT WITH CHECK (true);

-- comments: 所有人可读，登录用户可写
CREATE POLICY "comments_public_read" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_auth_insert" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 触发器：profiles 自动创建
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', '用户_' || substr(NEW.id::text, 1, 6)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
