import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Portfolio from '../../../../models/Portfolio'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all portfolio items
export async function GET(req: NextRequest) {
    const { error } = requireSuperAdmin(req)
    if (error) return error
    await dbConnect()

    const portfolios = await Portfolio.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ success: true, portfolios })
}

// POST create portfolio item
export async function POST(req: NextRequest) {
    const { error } = requireSuperAdmin(req)
    if (error) return error
    await dbConnect()

    const body = await req.json()
    const { title, description, category, image, url, tags, featured, isActive, order } = body

    if (!title || !category) {
        return NextResponse.json({ success: false, message: 'Title and category are required' }, { status: 400 })
    }

    const portfolio = await Portfolio.create({
        title,
        description,
        category,
        image,
        url,
        tags: Array.isArray(tags) ? tags : [],
        featured: featured || false,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
    })

    return NextResponse.json({ success: true, portfolio }, { status: 201 })
}
