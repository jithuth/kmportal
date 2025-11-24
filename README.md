# Kuwait Malayali Portal

A comprehensive community portal for Malayalis in Kuwait built with Next.js 15, Supabase, and Tailwind CSS.

## Features

- 🏠 **Homepage** - Featured news, quick stats, and community highlights
- 📰 **News** - Latest news articles with categories
- 📢 **Classifieds** - Buy, sell, and find services
- 📅 **Events** - Upcoming community events
- 👥 **User Authentication** - Secure login/signup with Supabase
- 🔐 **Admin Panel** - Content management system
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean emerald green theme

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd malayalis-kuwait-portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `supabase_schema.sql` and run it to create tables
4. Go to **Settings** > **API** and copy your credentials

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Replace `your_project_url` and `your_anon_key` with your actual Supabase credentials.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app uses the following tables:

- **profiles** - User profiles with roles
- **news** - News articles
- **classifieds** - Classified advertisements
- **events** - Community events

All tables are created automatically when you run the SQL schema.

## Admin Access

1. Sign up for an account at `/signup`
2. Access the admin panel at `/admin`
3. Create content at `/admin/content/new`

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── news/              # News pages
│   ├── classifieds/       # Classifieds pages
│   ├── events/            # Events pages
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
└── utils/
    └── supabase/          # Supabase client configs
```

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting platform**

Make sure to set your environment variables in your hosting platform's settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your community!

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for the Malayali community in Kuwait
