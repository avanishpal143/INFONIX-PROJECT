import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Template from '../../../../../models/Template'
import { requireSuperAdmin } from '../../../../../lib/middleware'

// GET single template
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const template = await Template.findById(params.id)
  if (!template) return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 })

  return NextResponse.json({ success: true, template })
}

// PATCH update template
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const template = await Template.findByIdAndUpdate(params.id, body, { new: true })
  if (!template) return NextResponse.json({ success: false, message: 'Template not found' }, { status: 404 })

  return NextResponse.json({ success: true, template })
}

// DELETE template
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  await Template.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true, message: 'Template deleted' })
}
