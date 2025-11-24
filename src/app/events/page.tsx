import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react"

export default async function EventsPage() {
    const supabase = await createClient()

    // Fetch events from Supabase
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-800">Upcoming Events</h1>
                    <p className="text-gray-600 text-lg">Discover cultural, social, and entertainment events in Kuwait.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {events && events.length > 0 ? (
                        events.map((item) => (
                            <div key={item.id} className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
                                <div className="aspect-[16/9] w-full bg-gray-200 relative overflow-hidden">
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-center shadow-sm">
                                        <span className="block text-xs font-semibold uppercase text-gray-600">
                                            {new Date(item.event_date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="block text-xl font-bold text-gray-900">
                                            {new Date(item.event_date).getDate()}
                                        </span>
                                    </div>
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-3xl">
                                            EVENT
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="mb-2 text-xl font-bold leading-tight group-hover:text-emerald-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-emerald-600" />
                                            <span>{new Date(item.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-emerald-600" />
                                            <span>{item.location || 'Kuwait'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500">
                                            Organizer
                                        </span>
                                        <Link href={`/events/${item.id}`} className="text-sm font-semibold text-emerald-600 hover:underline">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20">
                            <div className="bg-white rounded-xl border border-gray-200 p-12">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Upcoming Events</h3>
                                <p className="text-gray-600 mb-6">Check back soon for exciting community events!</p>
                                <Link href="/admin/content/new" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                                    Create Event
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
