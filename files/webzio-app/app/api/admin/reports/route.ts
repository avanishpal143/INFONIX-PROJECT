import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import Website from '../../../../models/Website'
import Template from '../../../../models/Template'
import { requireSuperAdmin } from '../../../../lib/middleware'

export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '30'
  const days = parseInt(range)

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // User growth per day
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: startDate }, role: { $ne: 'superadmin' } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])

  // Store creation trends
  const storeGrowth = await Website.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])

  // Template usage stats
  const templateUsage = await Website.aggregate([
    { $group: { _id: '$templateId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ])

  // Totals
  const totalUsers = await User.countDocuments({ role: { $ne: 'superadmin' } })
  const totalStores = await Website.countDocuments()
  const totalTemplates = await Template.countDocuments()
  const newUsersInRange = userGrowth.reduce((a: number, b: any) => a + b.count, 0)
  const newStoresInRange = storeGrowth.reduce((a: number, b: any) => a + b.count, 0)

  return NextResponse.json({
    success: true,
    userGrowth,
    storeGrowth,
    templateUsage,
    summary: { totalUsers, totalStores, totalTemplates, newUsersInRange, newStoresInRange },
  })
}
