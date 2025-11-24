import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Calendar, User, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch the article
    const { data: article, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !article) {
        notFound()
    }

    // Increment view count
    await supabase
        .from('news')
        .update({ views: (article.views || 0) + 1 })
        .eq('id', id)

    // Fetch author info
    const { data: author } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', article.author_id)
        .single()

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Category Badge */}
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {article.category || 'General'}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {article.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{author?.full_name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{article.views || 0} views</span>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>

                    {/* Featured Image */}
                    {article.image_url && (
                        <div className="mb-8 rounded-xl overflow-hidden">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* YouTube Video */}
                    {article.content_type === 'youtube' && article.youtube_id && (
                        <div className="mb-8 rounded-xl overflow-hidden aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${article.youtube_id}`}
                                title={article.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    )}

                    {/* Video */}
                    {article.content_type === 'video' && article.video_url && (
                        <div className="mb-8 rounded-xl overflow-hidden">
                            <video
                                controls
                                className="w-full h-auto"
                                src={article.video_url}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* Summary */}
                    {article.summary && (
                        <div className="bg-gray-100 border-l-4 border-emerald-600 p-6 mb-8 rounded-r-lg">
                            <p className="text-lg text-gray-700 italic">{article.summary}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                        <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                                Facebook
                            </Button>
                            <Button variant="outline" size="sm">
                                Twitter
                            </Button>
                            <Button variant="outline" size="sm">
                                WhatsApp
                            </Button>
                            <Button variant="outline" size="sm">
                                Copy Link
                            </Button>
                        </div>
                    </div>
                </article>

                {/* Related Articles */}
                <div className="bg-white py-12 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Placeholder for related articles */}
                            <div className="text-center py-8 text-gray-500 col-span-3">
                                <p>No related articles yet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
