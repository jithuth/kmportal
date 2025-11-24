"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { stripHtml, truncateText } from "@/utils/text"

interface NewsItem {
    id: number
    title: string
    content: string
    summary?: string
    category?: string
    image_url?: string
}

interface HeroSliderProps {
    news: NewsItem[]
}

export function HeroSlider({ news }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const slides = news.length > 0 ? news : [{
        id: 1,
        title: "Welcome to Kuwait Malayali Portal",
        content: "Your trusted community portal connecting Malayalis in Kuwait. Stay updated with news, events, and services.",
        category: "Community",
        summary: "Your trusted community portal connecting Malayalis in Kuwait. Stay updated with news, events, and services."
    }]

    useEffect(() => {
        if (slides.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [slides.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
    }

    const currentSlide = slides[currentIndex]

    return (
        <section className="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 text-white h-[340px] group">
            {/* Background Image with Blend Mode */}
            {currentSlide.image_url && (
                <div className="absolute inset-0 transition-opacity duration-1000">
                    <img
                        src={currentSlide.image_url}
                        alt={currentSlide.title}
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4">
                <span className="bg-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                    {currentSlide.category || 'News'}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                    {currentSlide.title}
                </h1>
                <p className="text-gray-200 text-sm line-clamp-2 mb-4">
                    {truncateText(currentSlide.summary || stripHtml(currentSlide.content || ''), 150)}
                </p>
                <Link
                    href={`/news/${currentSlide.id}`}
                    className="inline-flex items-center bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                    Read More <ArrowRight className="ml-2" size={16} />
                </Link>
            </div>

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
