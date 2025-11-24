"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { Check, X, Clock, CheckCircle } from "lucide-react"

export default function AdminClassifiedsPage() {
    const [classifieds, setClassifieds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('all')

    useEffect(() => {
        fetchClassifieds()
    }, [filter])

    const fetchClassifieds = async () => {
        setLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase
            .from('classifieds')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error:', error)
            setClassifieds([])
        } else {
            // Filter based on selection
            let filtered = data || []
            if (filter === 'pending') {
                filtered = filtered.filter(c => !c.is_approved)
            } else if (filter === 'approved') {
                filtered = filtered.filter(c => c.is_approved)
            }
            setClassifieds(filtered)
        }
        setLoading(false)
    }

    const handleApprove = async (id: number) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase
            .from('classifieds')
            .update({
                is_approved: true,
                approved_by: user?.id,
                approved_at: new Date().toISOString()
            })
            .eq('id', id)

        if (!error) {
            fetchClassifieds()
        } else {
            alert('Error approving classified. Make sure you ran classifieds_enhancement.sql')
        }
    }

    const handleReject = async (id: number) => {
        const reason = prompt('Reason for rejection (optional):')
        const supabase = createClient()

        const { error } = await supabase
            .from('classifieds')
            .update({
                is_approved: false,
                rejection_reason: reason || 'No reason provided'
            })
            .eq('id', id)

        if (!error) {
            fetchClassifieds()
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Classifieds Management</h1>
                <p className="text-gray-600 mt-1">Review and approve classified ads</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilter('pending')}
                    className={filter === 'pending' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                    <Clock className="h-4 w-4 mr-2" />
                    Pending
                </Button>
                <Button
                    variant={filter === 'approved' ? 'default' : 'outline'}
                    onClick={() => setFilter('approved')}
                    className={filter === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approved
                </Button>
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                    All ({classifieds.length})
                </Button>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-600">Loading...</p>
                        </CardContent>
                    </Card>
                ) : classifieds.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-600 mb-4">No classifieds found</p>
                            <p className="text-sm text-gray-500">
                                {filter === 'pending' && 'No pending classifieds'}
                                {filter === 'approved' && 'No approved classifieds yet'}
                                {filter === 'all' && 'Users can post classifieds from /classifieds/new'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    classifieds.map((classified) => (
                        <Card key={classified.id} className={`border-2 ${!classified.is_approved ? 'border-yellow-200 bg-yellow-50/30' : 'border-gray-200'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{classified.title}</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                {classified.category}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                📍 {classified.location}
                                            </span>
                                            {classified.price && (
                                                <span className="text-sm font-semibold text-emerald-600">
                                                    KWD {classified.price}
                                                    {classified.is_price_negotiable && ' (Negotiable)'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {classified.is_approved ? (
                                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4">{classified.description}</p>

                                {/* Images */}
                                {classified.images && classified.images.length > 0 && (
                                    <div className="grid grid-cols-5 gap-2 mb-4">
                                        {classified.images.map((url: string, index: number) => (
                                            <img
                                                key={index}
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-20 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="bg-gray-50 p-3 rounded text-sm mb-4">
                                    <p><strong>Contact:</strong> {classified.contact_phone}</p>
                                    {classified.contact_email && (
                                        <p><strong>Email:</strong> {classified.contact_email}</p>
                                    )}
                                </div>

                                <div className="text-xs text-gray-400 mb-4">
                                    Posted: {new Date(classified.created_at).toLocaleString()}
                                </div>

                                {/* Approval Buttons */}
                                {!classified.is_approved && (
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handleApprove(classified.id)}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(classified.id)}
                                            variant="outline"
                                            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
