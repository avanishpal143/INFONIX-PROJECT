import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Portfolio from '../../../../../models/Portfolio'
import { requireSuperAdmin } from '../../../../../lib/middleware'

// GET single portfolio item
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireSuperAdmin(req)
    if (error) return error
    await dbConnect()

    const portfolio = await Portfolio.findById(params.id)
    if (!portfolio) {
        return NextResponse.json({ success: false, message: 'Portfolio item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, portfolio })
}

// PATCH update portfolio item
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireSuperAdmin(req)
    if (error) return error
    await dbConnect()

    const body = await req.json()
    const portfolio = await Portfolio.findByIdAndUpdate(params.id, body, { new: true })

    if (!portfolio) {
        return NextResponse.json({ success: false, message: 'Portfolio item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, portfolio })
}

// DELETE portfolio item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { error } = requireSuperAdmin(req)
    if (error) return error
    await dbConnect()

    const portfolio = await Portfolio.findByIdAndDelete(params.id)

    if (!portfolio) {
        return NextResponse.json({ success: false, message: 'Portfolio item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Portfolio item deleted' })
}
