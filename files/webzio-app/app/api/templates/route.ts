import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Template from '../../../models/Template'

// GET all active templates (public endpoint for users)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type') || ''
        const category = searchParams.get('category') || ''

        const query: any = { isActive: true } // Only show active templates
        if (type) query.templateType = type
        if (category) query.category = category

        const templates = await Template.find(query).sort({ popular: -1, createdAt: -1 })

        return NextResponse.json({ success: true, templates })
    } catch (error: any) {
        console.error('Error fetching templates:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
