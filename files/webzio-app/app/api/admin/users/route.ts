import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import Website from '../../../../models/Website'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all users
export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const query: any = { role: { $ne: 'superadmin' } }
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]
  if (status === 'active') query.isActive = true
  if (status === 'inactive') query.isActive = false

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-password -otp -otpExpiry'),
    User.countDocuments(query),
  ])

  // Attach store count to each user
  const userIds = users.map((u: any) => u._id)
  const storeCounts = await Website.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ])
  const storeMap: Record<string, number> = {}
  storeCounts.forEach((s: any) => { storeMap[s._id.toString()] = s.count })

  const enriched = users.map((u: any) => ({
    ...u.toObject(),
    storeCount: storeMap[u._id.toString()] || 0,
  }))

  return NextResponse.json({ success: true, users: enriched, total, page, pages: Math.ceil(total / limit) })
}
