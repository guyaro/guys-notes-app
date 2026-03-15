-- Migration: Add description to notes + standalone notes support
-- Run this in the Supabase SQL Editor

-- 1. Add description column to notes
ALTER TABLE notes ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Allow notes without a course (standalone)
ALTER TABLE notes ALTER COLUMN course_id DROP NOT NULL;

-- 3. Add 'general' as allowed note type
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_type_check;
ALTER TABLE notes ADD CONSTRAINT notes_type_check CHECK (type IN ('lecture', 'tutorial', 'general'));
