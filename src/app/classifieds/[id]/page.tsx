"use client"

import { HeaderClient } from "@/components/layout/header-client"
import { Footer } from "@/components/layout/footer"
import { MapPin, Phone, Mail, Calendar, Eye, Tag, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useParams, useRouter } from "next/navigation"

export default function ClassifiedDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [classified, setClassified] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        fetchClassified()
    }, [params.id])

    const fetchClassified = async () => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('classifieds')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error || !data) {
            router.push('/classifieds')
            return
        }

        setClassified(data)
        setLoading(false)

        // Increment view count
        await supabase
            .from('classifieds')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', params.id)
    }

    const nextImage = () => {
        if (classified?.images && classified.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === classified.images.length - 1 ? 0 : prev + 1
            )
        }
    }

    const prevImage = () => {
        if (classified?.images && classified.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? classified.images.length - 1 : prev - 1
            )
        }
    }

    const handleCall = () => {
        if (classified?.contact_phone) {
            window.location.href = `tel:${classified.contact_phone}`
        }
    }

    const handleEmail = () => {
        if (classified?.contact_email) {
            window.location.href = `mailto:${classified.contact_email}`
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: classified?.title,
                    text: classified?.description,
                    url: window.location.href,
                })
            } catch (err) {
                console.log('Share failed:', err)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <HeaderClient />
                <main className="flex-grow flex items-center justify-center">
                    <p className="text-gray-600">Loading...</p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!classified) {
        return null
    }

    const images = classified.images || []
    const hasImages = images.length > 0

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <HeaderClient />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back to Classifieds
                    </button>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Images & Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Image Slider */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {hasImages ? (
                                    <div className="relative">
                                        <div className="aspect-video bg-gray-200">
                                            <img
                                                src={images[currentImageIndex]}
                                                alt={classified.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {images.length > 1 && (
                                            <>
                                                {/* Navigation Buttons */}
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                                >
                                                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                                >
                                                    <ChevronRight className="h-6 w-6 text-gray-800" />
                                                </button>

                                                {/* Image Counter */}
                                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                    {currentImageIndex + 1} / {images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400 text-4xl font-bold">No Image</span>
                                    </div>
                                )}

                                {/* Thumbnail Strip */}
                                {images.length > 1 && (
                                    <div className="p-4 bg-gray-50 border-t">
                                        <div className="flex gap-2 overflow-x-auto">
                                            {images.map((url: string, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                        ? 'border-emerald-600 ring-2 ring-emerald-200'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Title & Info */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {classified.category}
                                            </span>
                                            {classified.subcategory && (
                                                <span className="text-sm text-gray-600">• {classified.subcategory}</span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{classified.title}</h1>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleShare}
                                        className="flex-shrink-0"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b">
                                    {classified.price ? (
                                        <>
                                            <span className="text-4xl font-bold text-emerald-600">
                                                KWD {classified.price}
                                            </span>
                                            {classified.is_price_negotiable && (
                                                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                    Negotiable
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-2xl text-gray-600">Contact for price</span>
                                    )}
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        <span>{classified.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        <span>{new Date(classified.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Eye className="h-4 w-4 text-emerald-600" />
                                        <span>{classified.views || 0} views</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {classified.description}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Contact */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Seller</h3>

                                <div className="space-y-3 mb-6">
                                    {classified.contact_phone && (
                                        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Phone className="h-5 w-5 text-emerald-600" />
                                                <p className="text-xs text-gray-600">Phone Number</p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-lg">{classified.contact_phone}</p>
                                        </div>
                                    )}

                                    {classified.contact_email && (
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Mail className="h-5 w-5 text-blue-600" />
                                                <p className="text-xs text-gray-600">Email Address</p>
                                            </div>
                                            <p className="font-semibold text-gray-900 text-sm break-all">{classified.contact_email}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCall}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-base"
                                    >
                                        <Phone className="h-5 w-5 mr-2" />
                                        Call Now
                                    </Button>

                                    <Button
                                        onClick={handleEmail}
                                        variant="outline"
                                        className="w-full h-12 text-base border-2"
                                    >
                                        <Mail className="h-5 w-5 mr-2" />
                                        Send Email
                                    </Button>
                                </div>

                                {/* Safety Tips */}
                                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                                    <h4 className="font-bold text-sm text-yellow-800 mb-3 flex items-center gap-2">
                                        <span className="text-lg">⚠️</span>
                                        Safety Tips
                                    </h4>
                                    <ul className="text-xs text-yellow-700 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Meet in a safe, public location</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Check the item before you buy</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Pay only after collecting the item</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-600 mt-0.5">•</span>
                                            <span>Beware of unrealistic offers</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
