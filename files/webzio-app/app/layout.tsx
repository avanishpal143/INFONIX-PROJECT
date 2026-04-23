import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from 'react-hot-toast'
import SessionWrapper from './SessionWrapper'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Webrazeo — Build Your Business Website in 5 Minutes",
  description: "Create your restaurant, hotel, pharmacy or local business website in 5 minutes. No coding needed. WhatsApp orders, SEO & analytics included.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
        <Toaster position="top-center"/>
      </body>
    </html>
  )
}
