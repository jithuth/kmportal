# Setting Up Image Upload with Supabase Storage

## Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project dashboard
2. Click on **Storage** in the left sidebar
3. Click **New bucket**
4. Enter bucket name: `images`
5. Set it to **Public** (so images can be accessed publicly)
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, you need to set up policies:

1. Click on the `images` bucket
2. Go to **Policies** tab
3. Click **New Policy**

### Policy 1: Allow Public Read Access

```sql
-- Allow anyone to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

### Policy 2: Allow Authenticated Users to Upload

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Allow Users to Update Their Own Images

```sql
-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' AND auth.uid() = owner );
```

### Policy 4: Allow Users to Delete Their Own Images

```sql
-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' AND auth.uid() = owner );
```

## Step 3: Test Image Upload

1. Go to your app at `/admin/content/new`
2. Click on the image upload area
3. Select an image file (PNG, JPG, max 5MB)
4. The image will upload automatically to Supabase Storage
5. You'll see a preview once uploaded

## How It Works

### Upload Process:
1. User selects an image file
2. File is validated (type and size)
3. Unique filename is generated
4. File is uploaded to `images/news-images/` folder
5. Public URL is retrieved and stored in the database

### File Naming:
- Format: `{random-id}-{timestamp}.{extension}`
- Example: `abc123-1234567890.jpg`
- Stored in: `images/news-images/`

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure you've created all the storage policies above
- Verify the bucket is set to **Public**

### Error: "Failed to upload image"
- Check that the `images` bucket exists
- Verify you're logged in
- Check file size (must be < 5MB)

### Images not showing
- Verify the bucket is set to **Public**
- Check the public URL in the database
- Make sure the "Public Access" policy is enabled

## Alternative: Use Image URLs

If you don't want to set up Supabase Storage right now, you can:
1. Upload images to any image hosting service (Imgur, Cloudinary, etc.)
2. Paste the image URL in the "Or paste image URL" field
3. The image will be displayed from that URL

## Storage Limits

Supabase Free Tier includes:
- **1 GB** of storage
- **2 GB** of bandwidth per month

For production, consider upgrading or using a CDN.
