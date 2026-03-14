-- Run this in the Supabase SQL Editor to set up the database

-- Helper function to check if the current user is the owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS boolean AS $$
  SELECT auth.jwt() ->> 'email' = 'guy.aro.2001@gmail.com'
$$ LANGUAGE sql SECURITY DEFINER;

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  semester TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('lecture', 'tutorial')) NOT NULL,
  date DATE NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can read notes" ON notes FOR SELECT USING (true);

-- Owner-only write access
CREATE POLICY "Owner can insert courses" ON courses FOR INSERT WITH CHECK (is_owner());
CREATE POLICY "Owner can update courses" ON courses FOR UPDATE USING (is_owner());
CREATE POLICY "Owner can delete courses" ON courses FOR DELETE USING (is_owner());

CREATE POLICY "Owner can insert notes" ON notes FOR INSERT WITH CHECK (is_owner());
CREATE POLICY "Owner can update notes" ON notes FOR UPDATE USING (is_owner());
CREATE POLICY "Owner can delete notes" ON notes FOR DELETE USING (is_owner());

-- Storage: Create a 'notes' bucket (do this in the Supabase dashboard or via API)
-- Then set these policies:
-- - Public read: allow SELECT for everyone
-- - Authenticated owner write: allow INSERT/UPDATE/DELETE when is_owner() = true
