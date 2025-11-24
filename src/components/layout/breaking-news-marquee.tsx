"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"

interface NewsItem {
    id: number
    title: string
}

interface BreakingNewsMarqueeProps {
    news: NewsItem[]
}

export function BreakingNewsMarquee({ news }: BreakingNewsMarqueeProps) {
    if (!news || news.length === 0) {
        return null
    }

    return (
        <div className="bg-emerald-700 text-white py-2 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <TrendingUp className="w-5 h-5 animate-pulse" />
                    <span className="font-bold text-sm uppercase tracking-wide">Breaking News</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex gap-8 animate-marquee hover:[animation-play-state:paused]">
                        {/* Duplicate the news items to create seamless loop */}
                        {[...news, ...news].map((item, index) => (
                            <Link
                                key={`${item.id}-${index}`}
                                href={`/news/${item.id}`}
                                className="flex-shrink-0 hover:underline text-sm whitespace-nowrap font-semibold"
                            >
                                • {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
