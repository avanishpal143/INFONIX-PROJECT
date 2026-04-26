import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Template from '../../../models/Template'

// GET all active templates (public endpoint - no auth required)
export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || ''
    const type = searchParams.get('type') || ''
    const homepage = searchParams.get('homepage') === 'true'

    const query: any = { isActive: true } // Only show active templates
    if (category) query.category = category
    if (type) query.templateType = type
    if (homepage) query.showOnHomepage = true // Filter for homepage

    const templates = await Template.find(query)
      .select('name category icon desc color accentColor tags popular previewImage templateType config showOnHomepage')
      .sort({ popular: -1, createdAt: -1 })
      .limit(homepage ? 9 : 50) // Limit to 9 for homepage, 50 for templates page

    return NextResponse.json({ success: true, templates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch templates' }, { status: 500 })
  }
}
