import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'
import { requireAuth } from '../../../../lib/middleware'

// GET user's store (client dashboard stats)
export async function GET(req: NextRequest) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const stores = await Website.find({ userId: user.id })
  const totalViews = stores.reduce((a, s) => a + (s.views || 0), 0)
  const totalLeads = stores.reduce((a, s) => a + (s.leads || 0), 0)
  const totalOrders = stores.reduce((a, s) => a + (s.orders || 0), 0)

  return NextResponse.json({
    success: true,
    stores,
    stats: { totalViews, totalLeads, totalOrders, totalStores: stores.length },
  })
}
