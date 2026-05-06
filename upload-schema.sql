-- 添加 status 字段用于内容审核
ALTER TABLE event_videos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE event_documents ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE event_videos ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE event_documents ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE event_videos ADD COLUMN IF NOT EXISTS content_text TEXT;
ALTER TABLE event_documents ADD COLUMN IF NOT EXISTS content_text TEXT;

-- 已有数据设为已通过
UPDATE event_videos SET status = 'approved' WHERE status IS NULL;
UPDATE event_documents SET status = 'approved' WHERE status IS NULL;

-- 允许所有人读取所有内容（管理员审核时需要）
DROP POLICY IF EXISTS "videos_public_read" ON event_videos;
CREATE POLICY "videos_public_read" ON event_videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "docs_public_read" ON event_documents;
CREATE POLICY "docs_public_read" ON event_documents FOR SELECT USING (true);

-- 只有登录用户可以提交（pending）
DROP POLICY IF EXISTS "videos_all_insert" ON event_videos;
CREATE POLICY "videos_auth_insert" ON event_videos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');
DROP POLICY IF EXISTS "docs_all_insert" ON event_documents;
CREATE POLICY "docs_auth_insert" ON event_documents FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND status = 'pending');
