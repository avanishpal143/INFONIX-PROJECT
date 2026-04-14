import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Website from '../../../../../models/Website'
import { requireAuth } from '../../../../../lib/middleware'

const MAX_GALLERY_IMAGES = 5

// GET gallery
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const store = await Website.findOne({ _id: params.id, userId: user.id }).select('gallery')
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, gallery: store.gallery, max: MAX_GALLERY_IMAGES })
}

// POST add image URL to gallery
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const { imageUrl } = await req.json()
  if (!imageUrl) return NextResponse.json({ success: false, message: 'Image URL required' }, { status: 400 })

  const store = await Website.findOne({ _id: params.id, userId: user.id })
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  if (store.gallery.length >= MAX_GALLERY_IMAGES) {
    return NextResponse.json({ success: false, message: `Maximum ${MAX_GALLERY_IMAGES} images allowed` }, { status: 400 })
  }

  store.gallery.push(imageUrl)
  await store.save()

  return NextResponse.json({ success: true, gallery: store.gallery })
}

// DELETE remove image from gallery
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const { imageUrl } = await req.json()
  const store = await Website.findOne({ _id: params.id, userId: user.id })
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  store.gallery = store.gallery.filter((img: string) => img !== imageUrl)
  await store.save()

  return NextResponse.json({ success: true, gallery: store.gallery })
}
