import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Template from '../../../../models/Template'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all templates
export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || ''
  const category = searchParams.get('category') || ''

  const query: any = {}
  if (type) query.templateType = type
  if (category) query.category = category

  const templates = await Template.find(query).sort({ createdAt: -1 })
  return NextResponse.json({ success: true, templates })
}

// POST create template
export async function POST(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const { name, category, icon, desc, color, accentColor, tags, popular, isActive, previewImage, templateType } = body

  if (!name || !category) {
    return NextResponse.json({ success: false, message: 'Name and category are required' }, { status: 400 })
  }

  const template = await Template.create({
    name, category, icon, desc, color, accentColor,
    tags: Array.isArray(tags) ? tags : [],
    popular: popular || false,
    isActive: isActive !== undefined ? isActive : true,
    previewImage: previewImage || '',
    templateType: templateType || 'general',
  })

  return NextResponse.json({ success: true, template }, { status: 201 })
}
