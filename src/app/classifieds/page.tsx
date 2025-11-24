import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { MapPin, Tag } from "lucide-react"

export default async function ClassifiedsPage() {
    const supabase = await createClient()

    // Fetch approved classifieds from Supabase
    const { data: classifieds } = await supabase
        .from('classifieds')
        .select('*')
        .eq('is_approved', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(50)

    const categories = ['All', 'Automotive', 'Real Estate', 'Electronics', 'Furniture', 'Jobs', 'Services']

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-800">Classifieds</h1>
                        <p className="text-gray-600 text-lg">Buy, sell, and find everything you need.</p>
                    </div>
                    <Link href="/classifieds/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            + Post an Ad
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="font-semibold mb-4 text-gray-800">Categories</h3>
                            <ul className="space-y-2 text-sm">
                                {categories.map((cat, idx) => (
                                    <li key={idx}>
                                        <Link
                                            href="#"
                                            className={idx === 0 ? "text-emerald-600 font-medium" : "text-gray-600 hover:text-emerald-600 transition-colors"}
                                        >
                                            {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Listings */}
                    <div className="md:col-span-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {classifieds && classifieds.length > 0 ? (
                            classifieds.map((item) => (
                                <Link key={item.id} href={`/classifieds/${item.id}`} className="group block">
                                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
                                        <div className="aspect-square w-full rounded-lg bg-gray-200 mb-4 relative overflow-hidden">
                                            {item.images && item.images.length > 0 ? (
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-2xl">
                                                    IMAGE
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                                    <Tag className="h-3 w-3" /> {item.category || 'General'}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold truncate group-hover:text-emerald-600 transition-colors mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-lg font-bold text-emerald-600 mb-2">
                                                {item.price ? `KD ${item.price}` : 'Contact for price'}
                                            </p>
                                            <div className="flex items-center text-xs text-gray-500 gap-1">
                                                <MapPin className="h-3 w-3" />
                                                Kuwait
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20">
                                <div className="bg-white rounded-xl border border-gray-200 p-12">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Classifieds Yet</h3>
                                    <p className="text-gray-600 mb-6">Be the first to post an advertisement!</p>
                                    <Link href="/classifieds/new" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                        Post Your Ad
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
