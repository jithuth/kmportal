import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Calendar as CalendarIcon, User } from "lucide-react"
import { stripHtml, truncateText } from "@/utils/text"

export default async function NewsPage() {
    const supabase = await createClient()

    // Fetch news from Supabase
    const { data: news } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-800">Latest News</h1>
                    <p className="text-gray-600 text-lg">Stay updated with the latest happenings in Kuwait and the community.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {news && news.length > 0 ? (
                        news.map((item) => (
                            <article key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                <div className="aspect-video w-full bg-gray-200 relative">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-4xl">
                                            NEWS
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {item.author_id && (
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>Author</span>
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="mb-3 text-xl font-bold leading-tight hover:text-emerald-600 transition-colors">
                                        <Link href={`/news/${item.id}`}>
                                            {item.title}
                                        </Link>
                                    </h2>
                                    <p className="mb-4 flex-1 text-gray-600 line-clamp-3 text-sm">
                                        {truncateText(item.summary || stripHtml(item.content || ''), 150)}
                                    </p>
                                    <Link href={`/news/${item.id}`} className="text-sm font-medium text-emerald-600 hover:underline">
                                        Read full story &rarr;
                                    </Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20">
                            <div className="bg-white rounded-xl border border-gray-200 p-12">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No News Articles Yet</h3>
                                <p className="text-gray-600 mb-6">Check back soon for the latest updates from the community.</p>
                                <Link href="/admin/content/new" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                    Create First Article
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
