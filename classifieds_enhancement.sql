-- IMPORTANT: Run this FIRST before anything else
-- This adds the missing columns to the classifieds table

-- Check if columns already exist before adding
DO $$ 
BEGIN
    -- Add is_published column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'is_published'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN is_published boolean default true;
    END IF;

    -- Add is_approved column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN is_approved boolean default false;
    END IF;

    -- Add approved_by column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN approved_by uuid references public.profiles(id);
    END IF;

    -- Add approved_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN approved_at timestamp with time zone;
    END IF;

    -- Add rejection_reason column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN rejection_reason text;
    END IF;

    -- Add is_price_negotiable column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'is_price_negotiable'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN is_price_negotiable boolean default false;
    END IF;

    -- Add images column (jsonb array)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'classifieds' AND column_name = 'images'
    ) THEN
        ALTER TABLE public.classifieds ADD COLUMN images jsonb default '[]'::jsonb;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS classifieds_approved_idx ON public.classifieds(is_approved);
CREATE INDEX IF NOT EXISTS classifieds_published_idx ON public.classifieds(is_published);

-- Update RLS policies
DROP POLICY IF EXISTS "Classifieds are viewable by everyone" ON public.classifieds;
DROP POLICY IF EXISTS "Users can create classifieds" ON public.classifieds;
DROP POLICY IF EXISTS "Users can update own classifieds" ON public.classifieds;
DROP POLICY IF EXISTS "Users can view own classifieds" ON public.classifieds;
DROP POLICY IF EXISTS "Approved classifieds are viewable by everyone" ON public.classifieds;
DROP POLICY IF EXISTS "Users can update own pending classifieds" ON public.classifieds;
DROP POLICY IF EXISTS "Admins can view all classifieds" ON public.classifieds;
DROP POLICY IF EXISTS "Admins can update all classifieds" ON public.classifieds;

-- Create new policies
CREATE POLICY "Public can view approved classifieds"
  ON classifieds FOR SELECT
  TO public
  USING (is_approved = true AND is_published = true);

CREATE POLICY "Users can view own classifieds"
  ON classifieds FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create classifieds"
  ON classifieds FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending classifieds"
  ON classifieds FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_approved = false);

CREATE POLICY "Authenticated users can update any classified"
  ON classifieds FOR UPDATE
  TO authenticated
  USING (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Classifieds table updated successfully!';
  RAISE NOTICE 'New columns added: is_approved, is_published, is_price_negotiable, images, etc.';
END $$;
