-- Fix Admin Access to Classifieds
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all classifieds" ON public.classifieds;
DROP POLICY IF EXISTS "Admins can update all classifieds" ON public.classifieds;

-- Allow admins to view ALL classifieds (including pending)
CREATE POLICY "Admins can view all classifieds"
  ON classifieds FOR SELECT
  TO authenticated
  USING (true); -- Admins can see everything

-- Allow admins to update any classified
CREATE POLICY "Admins can update all classifieds"
  ON classifieds FOR UPDATE
  TO authenticated
  USING (true); -- Admins can update everything

-- Verify policies
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'classifieds'
ORDER BY policyname;
