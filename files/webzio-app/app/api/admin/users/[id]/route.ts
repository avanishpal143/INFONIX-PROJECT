import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import User from '../../../../../models/User'
import Website from '../../../../../models/Website'
import { requireSuperAdmin } from '../../../../../lib/middleware'

// GET single user detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const user = await User.findById(params.id).select('-password -otp -otpExpiry')
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

  const stores = await Website.find({ userId: params.id }).select('siteName slug isEnabled isPublished views leads orders createdAt')

  return NextResponse.json({ success: true, user, stores })
}

// PATCH activate/deactivate user
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const user = await User.findByIdAndUpdate(params.id, { isActive: body.isActive }, { new: true }).select('-password')
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

  return NextResponse.json({ success: true, user })
}

// DELETE user — removes user + all their stores + all their products
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const Product = (await import('../../../../../models/Product')).default

  // Find all stores of this user first
  const stores = await Website.find({ userId: params.id }).select('_id')
  const storeIds = stores.map((s: any) => s._id)

  // Delete in order: products → stores → user
  await Promise.all([
    Product.deleteMany({ $or: [{ userId: params.id }, { websiteId: { $in: storeIds } }] }),
    Website.deleteMany({ userId: params.id }),
  ])
  await User.findByIdAndDelete(params.id)

  return NextResponse.json({
    success: true,
    message: `User deleted along with ${storeIds.length} store(s) and all associated products.`,
  })
}
