# Quick Setup Guide

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `supabase_schema.sql` from this project
6. Paste it into the SQL editor
7. Click **Run** to create all tables

## Step 2: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** (gear icon)
2. Click **API** in the settings menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## Step 4: Run the Application

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Create Your First User

1. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create an account with your email and password
3. You'll be automatically logged in

## Step 6: Access Admin Panel

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click **Content** in the sidebar
3. Click **Create New** to add your first news article

## Troubleshooting

### "Failed to fetch" errors
- Make sure your `.env.local` file has the correct Supabase credentials
- Restart the dev server after changing environment variables

### "User not found" in admin panel
- Make sure you're logged in
- Check that the `profiles` table was created in Supabase

### Database errors
- Verify all tables were created by running the SQL schema
- Check the Supabase dashboard > Table Editor to see your tables

## What's Next?

- Add news articles via the admin panel
- Customize the design in `src/app/globals.css`
- Add more features like comments, ratings, etc.
- Deploy to Vercel for production

## Need Help?

Check the main README.md for more detailed information.
