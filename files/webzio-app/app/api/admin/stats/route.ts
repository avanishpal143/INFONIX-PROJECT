import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import Website from '../../../../models/Website'
import Template from '../../../../models/Template'
import { requireSuperAdmin } from '../../../../lib/middleware'

export async function GET(req: NextRequest) {
  const { error, user } = requireSuperAdmin(req)
  if (error) return error

  await dbConnect()

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalStores,
    activeStores,
    inactiveStores,
    totalTemplates,
    activeTemplates,
    recentUsers,
    recentStores,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'superadmin' } }),
    User.countDocuments({ role: { $ne: 'superadmin' }, isActive: true }),
    User.countDocuments({ role: { $ne: 'superadmin' }, isActive: false }),
    Website.countDocuments(),
    Website.countDocuments({ isEnabled: true }),
    Website.countDocuments({ isEnabled: false }),
    Template.countDocuments(),
    Template.countDocuments({ isActive: true }),
    User.find({ role: { $ne: 'superadmin' } }).sort({ createdAt: -1 }).limit(5).select('name email createdAt isActive role'),
    Website.find().sort({ createdAt: -1 }).limit(5).select('siteName slug createdAt isEnabled userId').populate('userId', 'name email'),
  ])

  // User growth - last 14 days
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: fourteenDaysAgo }, role: { $ne: 'superadmin' } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])

  const storeGrowth = await Website.aggregate([
    { $match: { createdAt: { $gte: fourteenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])

  const recentActivities = [
    ...recentUsers.map((u: any) => ({ type: 'user', message: `New user: ${u.name}`, time: u.createdAt, icon: '👤' })),
    ...recentStores.map((s: any) => ({ type: 'store', message: `Store created: ${s.siteName}`, time: s.createdAt, icon: '🏪' })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)

  return NextResponse.json({
    success: true,
    stats: { totalUsers, activeUsers, inactiveUsers, totalStores, activeStores, inactiveStores, totalTemplates, activeTemplates },
    recentActivities,
    userGrowth,
    storeGrowth,
  })
}
