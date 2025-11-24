import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/utils/supabase/server"
import { MapPin, Phone, Mail, Globe, Star, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DirectoryPage() {
    const supabase = await createClient()

    // Fetch business listings
    const { data: businesses } = await supabase
        .from('business_directory')
        .select('*')
        .order('listing_type', { ascending: false }) // Featured first
        .order('created_at', { ascending: false })
        .limit(50)

    const categories = [
        'All Categories',
        'Restaurants',
        'Grocery Stores',
        'Travel Agencies',
        'Money Transfer',
        'Real Estate',
        'Healthcare',
        'Education',
        'Services',
        'Automotive',
        'Beauty & Spa'
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">
                {/* Hero */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold mb-4">Business Directory</h1>
                        <p className="text-emerald-100 text-lg mb-6">
                            Discover trusted Malayali businesses in Kuwait
                        </p>
                        <Link href="/directory/new">
                            <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                                + List Your Business
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar - Categories */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-sm"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Business Listings */}
                        <div className="lg:col-span-3">
                            {businesses && businesses.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {businesses.map((business) => (
                                        <div
                                            key={business.id}
                                            className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-lg transition-all ${business.listing_type === 'featured'
                                                    ? 'border-yellow-400'
                                                    : business.listing_type === 'enhanced'
                                                        ? 'border-emerald-200'
                                                        : 'border-gray-200'
                                                }`}
                                        >
                                            {/* Badge for featured/enhanced */}
                                            {business.listing_type !== 'basic' && (
                                                <div className={`px-4 py-2 text-sm font-semibold ${business.listing_type === 'featured'
                                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                                                        : 'bg-emerald-50 text-emerald-700'
                                                    }`}>
                                                    <div className="flex items-center gap-2">
                                                        {business.listing_type === 'featured' && <Crown className="h-4 w-4" />}
                                                        {business.listing_type === 'featured' ? 'Featured Business' : 'Enhanced Listing'}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cover Image */}
                                            {business.cover_image_url && (
                                                <div className="h-40 overflow-hidden">
                                                    <img
                                                        src={business.cover_image_url}
                                                        alt={business.business_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                {/* Logo & Name */}
                                                <div className="flex items-start gap-4 mb-4">
                                                    {business.logo_url && (
                                                        <img
                                                            src={business.logo_url}
                                                            alt={business.business_name}
                                                            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                            {business.business_name}
                                                        </h3>
                                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                            {business.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {business.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {business.description}
                                                    </p>
                                                )}

                                                {/* Contact Info */}
                                                <div className="space-y-2 mb-4">
                                                    {business.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone className="h-4 w-4" />
                                                            <span>{business.phone}</span>
                                                        </div>
                                                    )}
                                                    {business.location && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{business.location}</span>
                                                        </div>
                                                    )}
                                                    {business.website && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Globe className="h-4 w-4" />
                                                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                                                                Visit Website
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Rating */}
                                                {business.rating > 0 && (
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < Math.floor(business.rating)
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-600">
                                                            ({business.review_count} reviews)
                                                        </span>
                                                    </div>
                                                )}

                                                {/* View Details Button */}
                                                <Link href={`/directory/${business.id}`}>
                                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses yet</h3>
                                    <p className="text-gray-600 mb-6">Be the first to list your business!</p>
                                    <Link href="/directory/new">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                                            List Your Business
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
