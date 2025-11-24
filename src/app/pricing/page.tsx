import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Check, Zap, Star, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingPage() {
    const plans = [
        {
            name: "Free",
            price: "0",
            period: "forever",
            icon: Zap,
            color: "gray",
            features: [
                "1 classified ad per month",
                "View all content",
                "Basic support",
                "Community access"
            ],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Basic",
            price: "2",
            period: "month",
            icon: Star,
            color: "blue",
            features: [
                "Unlimited classified ads",
                "1 business directory listing",
                "Ad-free experience",
                "Priority support",
                "Email notifications"
            ],
            cta: "Upgrade to Basic",
            popular: false
        },
        {
            name: "Premium",
            price: "5",
            period: "month",
            icon: Crown,
            color: "emerald",
            features: [
                "All Basic features",
                "Featured classified ads",
                "3 business directory listings",
                "Analytics dashboard",
                "Social media promotion",
                "Priority placement"
            ],
            cta: "Upgrade to Premium",
            popular: true
        },
        {
            name: "Business",
            price: "10",
            period: "month",
            icon: Crown,
            color: "purple",
            features: [
                "All Premium features",
                "Unlimited directory listings",
                "Banner ad placement",
                "Dedicated account manager",
                "Custom branding",
                "API access",
                "Advanced analytics"
            ],
            cta: "Upgrade to Business",
            popular: false
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Choose Your Plan
                        </h1>
                        <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                            Unlock premium features and grow your business in the Kuwait Malayali community
                        </p>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {plans.map((plan) => {
                            const Icon = plan.icon
                            return (
                                <div
                                    key={plan.name}
                                    className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${plan.popular ? 'border-emerald-500 scale-105' : 'border-gray-200'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-lg bg-${plan.color}-100 flex items-center justify-center mb-4`}>
                                            <Icon className={`h-6 w-6 text-${plan.color}-600`} />
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-gray-900">KWD {plan.price}</span>
                                            <span className="text-gray-600">/{plan.period}</span>
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <Button
                                            className={`w-full ${plan.popular
                                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                                    : 'bg-gray-900 hover:bg-gray-800'
                                                }`}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Additional Services */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Additional Services
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Classified Ads */}
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Classified Ads</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-gray-700">Free Listing</span>
                                        <span className="font-bold">KWD 0</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-gray-700">Featured (30 days)</span>
                                        <span className="font-bold">KWD 2</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Premium (30 days)</span>
                                        <span className="font-bold">KWD 5</span>
                                    </div>
                                </div>
                                <Link href="/classifieds/new">
                                    <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                                        Post Classified
                                    </Button>
                                </Link>
                            </div>

                            {/* Business Directory */}
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Directory</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-gray-700">Basic Listing</span>
                                        <span className="font-bold">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-gray-700">Enhanced</span>
                                        <span className="font-bold">KWD 10/mo</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Featured</span>
                                        <span className="font-bold">KWD 20/mo</span>
                                    </div>
                                </div>
                                <Link href="/directory/new">
                                    <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
                                        List Business
                                    </Button>
                                </Link>
                            </div>

                            {/* Banner Advertising */}
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Banner Advertising</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-gray-700">Header Banner</span>
                                        <span className="font-bold">KWD 100/mo</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b">
                                        <span className="text-gray-700">Sidebar</span>
                                        <span className="font-bold">KWD 50/mo</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Article Footer</span>
                                        <span className="font-bold">KWD 30/mo</span>
                                    </div>
                                </div>
                                <Link href="/advertise">
                                    <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                                        Advertise Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="mt-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-2">Can I cancel anytime?</h3>
                                <p className="text-gray-600">Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                                <p className="text-gray-600">We accept all major credit cards via Stripe, as well as PayPal.</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
                                <p className="text-gray-600">Absolutely! You can change your plan at any time. Upgrades take effect immediately, and downgrades at the end of your billing cycle.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
