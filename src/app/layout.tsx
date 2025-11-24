import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Using Hind Siliguri which has excellent Malayalam support and beautiful rendering
const malayalam = Hind_Siliguri({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-malayalam",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kuwait Malayali Portal",
  description: "Connecting Malayalis in Kuwait",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${malayalam.variable} font-sans bg-gray-50 text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
