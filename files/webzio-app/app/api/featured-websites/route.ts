import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Website from '../../../models/Website'
import User from '../../../models/User'

// GET featured websites (public endpoint - no auth required)
export async function GET() {
  try {
    await dbConnect()

    // Fetch published and active websites with user details
    const websites = await Website.find({
      isPublished: true,
      isActive: true,
      isEnabled: true,
    })
      .populate('userId', 'name email')
      .select('siteName slug content.logo content.heroTitle content.primaryColor content.socialLinks userId createdAt views')
      .sort({ createdAt: -1 })
      .limit(12) // Fetch 12 featured websites

    const formattedWebsites = websites.map((site: any) => ({
      _id: site._id,
      siteName: site.siteName,
      slug: site.slug,
      logo: site.content?.logo || '',
      heroTitle: site.content?.heroTitle || site.siteName,
      primaryColor: site.content?.primaryColor || '#6366f1',
      socialLinks: site.content?.socialLinks || {},
      views: site.views || 0,
      createdAt: site.createdAt,
      owner: {
        name: site.userId?.name || 'Anonymous',
        email: site.userId?.email || '',
      },
      websiteUrl: `https://${site.slug}.webrazeo.com`,
    }))

    return NextResponse.json({ success: true, websites: formattedWebsites })
  } catch (error) {
    console.error('Error fetching featured websites:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch featured websites' }, { status: 500 })
  }
}
