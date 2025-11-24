import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-white text-base font-bold mb-3">Kuwait Malayali</h3>
                    <p className="text-xs leading-relaxed">
                        Your trusted community portal connecting Malayalis in Kuwait. Stay updated with news, events, and services.
                    </p>
                </div>
                <div>
                    <h3 className="text-white text-base font-bold mb-3">Quick Links</h3>
                    <ul className="space-y-1.5 text-xs">
                        <li><Link href="/news" className="hover:text-white transition-colors">News</Link></li>
                        <li><Link href="/classifieds" className="hover:text-white transition-colors">Classifieds</Link></li>
                        <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                        <li><Link href="/directory" className="hover:text-white transition-colors">Business Directory</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white text-base font-bold mb-3">Contact</h3>
                    <p className="text-xs mb-1">Email: info@kuwaitmalayali.com</p>
                    <p className="text-xs">Phone: +965 9999 9999</p>
                </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t border-gray-800 text-[10px] uppercase tracking-wider">
                &copy; {new Date().getFullYear()} Kuwait Malayali Portal. All rights reserved.
            </div>
        </footer>
    )
}
