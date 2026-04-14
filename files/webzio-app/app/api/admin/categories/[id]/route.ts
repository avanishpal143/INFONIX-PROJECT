import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Category from '../../../../../models/Category'
import { requireSuperAdmin } from '../../../../../lib/middleware'

// PATCH update category
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const category = await Category.findByIdAndUpdate(params.id, body, { new: true })
  if (!category) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 })

  return NextResponse.json({ success: true, category })
}

// DELETE category
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  await Category.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true, message: 'Category deleted' })
}
