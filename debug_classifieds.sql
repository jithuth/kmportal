-- Debug Script - Check Classifieds Setup
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if classifieds table has the new columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'classifieds' 
ORDER BY ordinal_position;

-- 2. Check if there are any classifieds in the database
SELECT COUNT(*) as total_classifieds FROM classifieds;

-- 3. Show all classifieds (if any)
SELECT id, title, category, is_approved, is_published, created_at 
FROM classifieds 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check RLS policies on classifieds table
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'classifieds'
ORDER BY policyname;

-- 5. Check if storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- 6. Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects';
