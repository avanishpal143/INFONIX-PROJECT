import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Website from '../../../../../models/Website'
import { requireSuperAdmin } from '../../../../../lib/middleware'

// GET single store details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const store = await Website.findById(params.id).populate('userId', 'name email isActive createdAt')
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, store })
}

// PATCH enable/disable store
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const store = await Website.findByIdAndUpdate(params.id, { isEnabled: body.isEnabled }, { new: true }).populate('userId', 'name email')
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, store })
}

// DELETE store — removes store + all its products
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const Product = (await import('../../../../../models/Product')).default

  // Delete products first, then store
  await Product.deleteMany({ websiteId: params.id })
  await Website.findByIdAndDelete(params.id)

  return NextResponse.json({ success: true, message: 'Store and all products deleted successfully' })
}
