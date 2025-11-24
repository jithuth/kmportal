import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Activity, Calendar, TrendingUp, Eye } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch statistics
    const { count: newsCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })

    const { count: classifiedsCount } = await supabase
        .from('classifieds')
        .select('*', { count: 'exact', head: true })

    const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })

    const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Fetch recent news
    const { data: recentNews } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    const stats = [
        {
            title: "Total Users",
            value: usersCount || 0,
            change: "+12%",
            icon: Users,
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "News Articles",
            value: newsCount || 0,
            change: "+8%",
            icon: FileText,
            color: "bg-emerald-500",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Active Listings",
            value: classifiedsCount || 0,
            change: "+23%",
            icon: Activity,
            color: "bg-purple-500",
            lightColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            title: "Upcoming Events",
            value: eventsCount || 0,
            change: "+5%",
            icon: Calendar,
            color: "bg-orange-500",
            lightColor: "bg-orange-50",
            textColor: "text-orange-600"
        },
    ]

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
                <p className="text-gray-600 mt-1">Overview of your portal's performance and activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                            <div className={`${stat.lightColor} p-2 rounded-lg`}>
                                <stat.icon className={`h-4 w-4 ${stat.textColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent News */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900">Recent Articles</CardTitle>
                            <Link href="/admin/content" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentNews && recentNews.length > 0 ? (
                            <div className="space-y-4">
                                {recentNews.map((news) => (
                                    <div key={news.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                                            {news.image_url ? (
                                                <img src={news.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{news.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${news.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {news.is_published ? 'Published' : 'Draft'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(news.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">No articles yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            <Link
                                href="/admin/content/new"
                                className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <FileText className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Create Article</p>
                                    <p className="text-xs text-gray-500">Write a new news article</p>
                                </div>
                            </Link>

                            <Link
                                href="/admin/content"
                                className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <Eye className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Manage Content</p>
                                    <p className="text-xs text-gray-500">View and edit all content</p>
                                </div>
                            </Link>

                            <Link
                                href="/"
                                className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">View Site</p>
                                    <p className="text-xs text-gray-500">See your live portal</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
