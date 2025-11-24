"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Upload, X, Image as ImageIcon, Save, FileText, Video, Youtube, Loader2 } from "lucide-react"
import RichTextEditor from "@/components/ui/rich-text-editor"

export default function CreateContentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [contentType, setContentType] = useState<'text' | 'video' | 'youtube'>('text')
    const [videoUrl, setVideoUrl] = useState("")
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [category, setCategory] = useState("General")
    const [imageUrl, setImageUrl] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [tags, setTags] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Extract YouTube ID from URL
    const extractYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    // Handle image file selection
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB')
            return
        }

        setImageFile(file)
        setUploadingImage(true)
        setError(null)

        try {
            const supabase = createClient()

            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `news-images/${fileName}`

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath)

            setImageUrl(publicUrl)
            setUploadingImage(false)
        } catch (err: any) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload image')
            setUploadingImage(false)
            setImageFile(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setError("You must be logged in to create content")
                setLoading(false)
                return
            }

            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()

            if (!existingProfile) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        full_name: user.email?.split('@')[0] || 'User',
                        role: 'user'
                    })

                if (profileError) {
                    console.error('Profile creation error:', profileError)
                }
            }

            // Prepare data based on content type
            let youtubeId = null
            let finalVideoUrl = null

            if (contentType === 'youtube') {
                youtubeId = extractYouTubeId(youtubeUrl)
                if (!youtubeId) {
                    setError("Invalid YouTube URL")
                    setLoading(false)
                    return
                }
            } else if (contentType === 'video') {
                finalVideoUrl = videoUrl
            }

            const { error: insertError } = await supabase
                .from('news')
                .insert({
                    title,
                    content,
                    content_type: contentType,
                    video_url: finalVideoUrl,
                    youtube_id: youtubeId,
                    summary: metaDescription,
                    category,
                    image_url: imageUrl || null,
                    author_id: user.id,
                    is_published: true
                })

            if (insertError) {
                setError(insertError.message)
                setLoading(false)
                return
            }

            router.push("/admin/content")
            router.refresh()
        } catch (err) {
            setError("An unexpected error occurred")
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add Article</h1>
                    <p className="text-gray-600 mt-1">Create a new article, video, or YouTube content</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Type Selector */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Content Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setContentType('text')}
                                    className={`p-4 rounded-lg border-2 transition-all ${contentType === 'text'
                                        ? 'border-emerald-600 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <FileText className={`h-8 w-8 mx-auto mb-2 ${contentType === 'text' ? 'text-emerald-600' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-medium ${contentType === 'text' ? 'text-emerald-600' : 'text-gray-600'
                                        }`}>Text Article</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setContentType('video')}
                                    className={`p-4 rounded-lg border-2 transition-all ${contentType === 'video'
                                        ? 'border-emerald-600 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Video className={`h-8 w-8 mx-auto mb-2 ${contentType === 'video' ? 'text-emerald-600' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-medium ${contentType === 'video' ? 'text-emerald-600' : 'text-gray-600'
                                        }`}>Video Upload</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setContentType('youtube')}
                                    className={`p-4 rounded-lg border-2 transition-all ${contentType === 'youtube'
                                        ? 'border-emerald-600 bg-emerald-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Youtube className={`h-8 w-8 mx-auto mb-2 ${contentType === 'youtube' ? 'text-emerald-600' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-medium ${contentType === 'youtube' ? 'text-emerald-600' : 'text-gray-600'
                                        }`}>YouTube</p>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Post Details Card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                    <X className="h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                                    Slug
                                    <span className="text-xs text-gray-500 ml-2">Auto-generated from title</span>
                                </label>
                                <input
                                    id="slug"
                                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-500"
                                    value={title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}
                                    disabled
                                />
                            </div>

                            {/* Summary */}
                            <div className="space-y-2">
                                <label htmlFor="summary" className="text-sm font-medium text-gray-700">
                                    Summary & Description (Meta Tag)
                                </label>
                                <textarea
                                    id="summary"
                                    className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
                                    placeholder="Add summary or description (Meta Tag)"
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                />
                            </div>

                            {/* Keywords */}
                            <div className="space-y-2">
                                <label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                                    Keywords (Meta Tag)
                                </label>
                                <input
                                    id="keywords"
                                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                                    placeholder="Keywords (Meta Tag)"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Card - Changes based on content type */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                {contentType === 'text' && 'Content'}
                                {contentType === 'video' && 'Video URL'}
                                {contentType === 'youtube' && 'YouTube Video'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {contentType === 'text' && (
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Write your article content here..."
                                />
                            )}

                            {contentType === 'video' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Video URL
                                        </label>
                                        <input
                                            type="url"
                                            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                            placeholder="https://example.com/video.mp4"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">Paste the direct URL to your video file (MP4, WebM, etc.)</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            className="flex min-h-[150px] w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                                            placeholder="Add a description for your video..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {contentType === 'youtube' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            YouTube URL
                                        </label>
                                        <input
                                            type="url"
                                            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">Paste the YouTube video URL</p>
                                    </div>
                                    {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                                        <div className="rounded-lg overflow-hidden border border-gray-300">
                                            <iframe
                                                width="100%"
                                                height="315"
                                                src={`https://www.youtube.com/embed/${extractYouTubeId(youtubeUrl)}`}
                                                title="YouTube video preview"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            className="flex min-h-[150px] w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                                            placeholder="Add a description for your video..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Image Upload Card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Thumbnail Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer"
                            >
                                {uploadingImage ? (
                                    <div className="space-y-3">
                                        <Loader2 className="h-12 w-12 mx-auto text-emerald-600 animate-spin" />
                                        <p className="text-sm text-gray-600">Uploading...</p>
                                    </div>
                                ) : imageUrl ? (
                                    <div className="relative">
                                        <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-3" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setImageUrl("")
                                                setImageFile(null)
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">Click to Upload Image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            <input
                                type="url"
                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                placeholder="Paste image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                disabled={uploadingImage}
                            />
                        </CardContent>
                    </Card>

                    {/* Category Card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <select
                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="General">General</option>
                                <option value="Breaking News">Breaking News</option>
                                <option value="Community">Community</option>
                                <option value="Business">Business</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Culture">Culture</option>
                                <option value="Sports">Sports</option>
                                <option value="Entertainment">Entertainment</option>
                            </select>
                        </CardContent>
                    </Card>

                    {/* Publish Card */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Publish</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium text-gray-900">Published</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200 space-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.back()}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                                    disabled={loading || uploadingImage}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Publish
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
