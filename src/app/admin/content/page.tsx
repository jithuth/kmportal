import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Plus, Edit, Trash, Eye, Search } from "lucide-react"
import { stripHtml } from "@/utils/text"

export default async function ContentDashboard() {
    const supabase = await createClient()

    // Fetch news articles
    const { data: news } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Content Management</h1>
                    <p className="text-gray-600 mt-1">Create and manage your news articles</p>
                </div>
                <Link href="/admin/content/new">
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
                        <Plus className="h-4 w-4" /> Create Article
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                            />
                        </div>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent">
                            <option>All Status</option>
                            <option>Published</option>
                            <option>Draft</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Content Table */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Articles ({news?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {news && news.length > 0 ? (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b border-gray-200">
                                    <tr className="transition-colors hover:bg-gray-50">
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-gray-700">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-gray-700">Category</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-gray-700">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-semibold text-gray-700">Date</th>
                                        <th className="h-12 px-4 text-right align-middle font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {news.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Eye className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.title}</p>
                                                        <p className="text-xs text-gray-500 line-clamp-1">{stripHtml(item.content || '').substring(0, 50)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                                                    {item.category || 'General'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {item.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-gray-600 text-sm">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/news/${item.id}`} target="_blank">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">View</span>
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/content/edit?id=${item.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600">
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                                                        <Trash className="h-4 w-4" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <Plus className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
                            <p className="text-gray-600 mb-6">Create your first article to get started!</p>
                            <Link href="/admin/content/new">
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    <Plus className="h-4 w-4 mr-2" /> Create Article
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
