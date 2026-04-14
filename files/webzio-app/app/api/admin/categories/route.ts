import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Category from '../../../../models/Category'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all categories
export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const categories = await Category.find().sort({ createdAt: -1 })
  return NextResponse.json({ success: true, categories })
}

// POST create category
export async function POST(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const { name, description, icon, color } = body

  if (!name) return NextResponse.json({ success: false, message: 'Name is required' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const existing = await Category.findOne({ slug })
  if (existing) return NextResponse.json({ success: false, message: 'Category already exists' }, { status: 400 })

  const category = await Category.create({ name, slug, description, icon, color })
  return NextResponse.json({ success: true, category }, { status: 201 })
}
