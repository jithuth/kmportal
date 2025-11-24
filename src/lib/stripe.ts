import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
})

// Subscription price IDs (you'll get these from Stripe Dashboard)
export const SUBSCRIPTION_PRICES = {
    basic_monthly: process.env.STRIPE_BASIC_PRICE_ID || '',
    premium_monthly: process.env.STRIPE_PREMIUM_PRICE_ID || '',
    business_monthly: process.env.STRIPE_BUSINESS_PRICE_ID || '',
}

// One-time payment amounts (in KWD, converted to fils - smallest currency unit)
export const PRICING = {
    classified_featured: 2.00,
    classified_premium: 5.00,
    directory_enhanced: 10.00,
    directory_featured: 20.00,
    banner_header: 100.00,
    banner_sidebar: 50.00,
    banner_footer: 30.00,
}

// Convert KWD to fils (1 KWD = 1000 fils)
export function kwdToFils(amount: number): number {
    return Math.round(amount * 1000)
}
