import { NextRequest, NextResponse } from 'next/server'
import { stripe, SUBSCRIPTION_PRICES, PRICING, kwdToFils } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const { type, tier, itemId } = await request.json()
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, email, full_name')
            .eq('id', user.id)
            .single()

        let customerId = profile?.stripe_customer_id

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id,
                },
            })
            customerId = customer.id

            // Save customer ID
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id)
        }

        let session

        // Handle different payment types
        if (type === 'subscription') {
            // Subscription checkout
            const priceId = SUBSCRIPTION_PRICES[`${tier}_monthly` as keyof typeof SUBSCRIPTION_PRICES]

            if (!priceId) {
                return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 })
            }

            session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing?canceled=true`,
                metadata: {
                    user_id: user.id,
                    type: 'subscription',
                    tier,
                },
            })
        } else if (type === 'classified') {
            // One-time payment for classified ad
            const amount = tier === 'featured' ? PRICING.classified_featured : PRICING.classified_premium

            session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'kwd',
                            product_data: {
                                name: `${tier === 'featured' ? 'Featured' : 'Premium'} Classified Ad`,
                                description: '30 days listing',
                            },
                            unit_amount: kwdToFils(amount),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/classifieds?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/classifieds/new?canceled=true`,
                metadata: {
                    user_id: user.id,
                    type: 'classified',
                    tier,
                    item_id: itemId,
                },
            })
        } else if (type === 'directory') {
            // Business directory listing
            const amount = tier === 'enhanced' ? PRICING.directory_enhanced : PRICING.directory_featured

            session = await stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'kwd',
                            product_data: {
                                name: `${tier === 'enhanced' ? 'Enhanced' : 'Featured'} Directory Listing`,
                                description: '30 days',
                            },
                            unit_amount: kwdToFils(amount),
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/directory?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/directory/new?canceled=true`,
                metadata: {
                    user_id: user.id,
                    type: 'directory',
                    tier,
                    item_id: itemId,
                },
            })
        } else {
            return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 })
        }

        return NextResponse.json({ sessionId: session.id, url: session.url })
    } catch (error: any) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
