import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Website from '../../../../../models/Website'
import { requireAuth } from '../../../../../lib/middleware'

// GET pages for a store
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const store = await Website.findOne({ _id: params.id, userId: user.id }).select('pages')
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, pages: store.pages })
}

// POST add a page
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const { title, slug, content, isPublished } = body

  if (!title || !slug) return NextResponse.json({ success: false, message: 'Title and slug are required' }, { status: 400 })

  const store = await Website.findOne({ _id: params.id, userId: user.id })
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  const existing = store.pages.find((p: any) => p.slug === slug)
  if (existing) return NextResponse.json({ success: false, message: 'A page with this slug already exists' }, { status: 400 })

  store.pages.push({ title, slug, content: content || '', isPublished: isPublished !== false })
  await store.save()

  return NextResponse.json({ success: true, pages: store.pages })
}

// PUT update a specific page by slug
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const { slug, title, content, isPublished } = body

  const store = await Website.findOne({ _id: params.id, userId: user.id })
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  const page = store.pages.find((p: any) => p.slug === slug)
  if (!page) return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 })

  if (title !== undefined) page.title = title
  if (content !== undefined) page.content = content
  if (isPublished !== undefined) page.isPublished = isPublished
  await store.save()

  return NextResponse.json({ success: true, pages: store.pages })
}

// DELETE a page by slug
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const { slug } = await req.json()
  const store = await Website.findOne({ _id: params.id, userId: user.id })
  if (!store) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  store.pages = store.pages.filter((p: any) => p.slug !== slug)
  await store.save()

  return NextResponse.json({ success: true, pages: store.pages })
}
