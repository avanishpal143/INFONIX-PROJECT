import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all stores
export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const query: any = {}
  if (search) query.$or = [{ siteName: { $regex: search, $options: 'i' } }, { slug: { $regex: search, $options: 'i' } }]
  if (status === 'active') query.isEnabled = true
  if (status === 'inactive') query.isEnabled = false

  const [stores, total] = await Promise.all([
    Website.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email isActive'),
    Website.countDocuments(query),
  ])

  return NextResponse.json({ success: true, stores, total, page, pages: Math.ceil(total / limit) })
}
