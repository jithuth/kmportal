import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRight, TrendingUp, Calendar, Phone, Clock } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured news (most recent published)
  const { data: featuredNewsData } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch recent news
  const { data: recentNewsData } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Fetch real-time exchange rate from API
  let exchangeRate = '270.00'
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/KWD', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    const data = await response.json()
    if (data.rates && data.rates.INR) {
      exchangeRate = data.rates.INR.toFixed(2)
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error)
  }

  const featuredNews = featuredNewsData || {
    id: 1,
    title: "Welcome to Kuwait Malayali Portal",
    content: "Your trusted community portal connecting Malayalis in Kuwait. Stay updated with news, events, and services.",
    category: "Community",
  };

  const recentNews = recentNewsData?.slice(0, 3) || []; // Take top 3 for display

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="space-y-8">
          {/* Hero Section - Featured News */}
          <section className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 text-white h-[340px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
              <span className="bg-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                {featuredNews.category || 'News'}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                {featuredNews.title}
              </h1>
              <p className="text-gray-200 text-sm line-clamp-2 mb-4">
                {featuredNews.content?.substring(0, 150)}...
              </p>
              <Link href={`/news/${featuredNews.id}`} className="inline-flex items-center bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                Read More <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </section>

          {/* Quick Stats / Tickers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mb-2">
                <TrendingUp size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800">1 KWD = {exchangeRate} INR</span>
              <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Exchange Rate</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600 mb-2">
                <Calendar size={20} />
              </div>
              <span className="text-xl font-bold text-gray-800">Events</span>
              <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">5 Upcoming</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="bg-red-100 p-2 rounded-full text-red-600 mb-2">
                <Phone size={20} />
              </div>
              <span className="text-lg font-bold text-gray-800">Embassy</span>
              <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">+965 22530600</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 p-2 rounded-full text-green-600 mb-2">
                <Clock size={20} />
              </div>
              <span className="text-lg font-bold text-gray-800">Prayer Times</span>
              <span className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">Maghrib 5:10 PM</span>
            </div>
          </div>

          {/* Recent News Grid */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Latest News</h2>
              <Link href="/news" className="text-emerald-600 text-sm font-medium hover:text-emerald-700">View All</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentNews.length > 0 ? (
                recentNews.map(news => (
                  <Link key={news.id} href={`/news/${news.id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                    <div className="h-40 overflow-hidden bg-gray-200 flex items-center justify-center">
                      {news.image_url ? (
                        <img src={news.image_url} alt={news.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">{news.category || 'News'}</span>
                        <span className="text-[10px] text-gray-400">{new Date(news.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-bold text-base mb-1.5 text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">{news.title}</h3>
                      <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed">{news.content?.substring(0, 100)}...</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p>No news articles available yet. Check back soon!</p>
                </div>
              )}
            </div>
          </section>

          {/* Business Promotions Banner */}
          <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-8">
              <h3 className="text-xl font-bold mb-1">Promote Your Business</h3>
              <p className="text-indigo-100 text-sm">Reach thousands of Malayalis in Kuwait</p>
            </div>
            <Link href="/classifieds" className="bg-white text-indigo-600 px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-50 transition-colors whitespace-nowrap">
              Post Your Ad
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
