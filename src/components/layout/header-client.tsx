"use client"

import Link from 'next/link'
import { Menu, User, Home, Newspaper, Briefcase, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeaderClient() {
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'News', path: '/news', icon: Newspaper },
        { name: 'Classifieds', path: '/classifieds', icon: Briefcase },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Directory', path: '/directory', icon: Users },
    ]

    return (
        <header className="bg-emerald-800 text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-emerald-800 font-bold text-sm">
                                K
                            </div>
                            <span className="text-lg font-bold tracking-tight">Kuwait Malayali</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-emerald-700 transition-colors text-sm"
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                        <Link
                            href="/admin"
                            className="flex items-center space-x-1 px-2 py-1 rounded-md border border-emerald-600 hover:bg-emerald-700 transition-colors text-sm"
                        >
                            <User className="h-4 w-4" />
                            <span>Admin</span>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-emerald-200 hover:text-white hover:bg-emerald-700">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
