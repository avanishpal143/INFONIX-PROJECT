import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'

// This is a development-only route to reset users
export async function DELETE(req: Request) {
    try {
        await dbConnect()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ success: false, message: 'Please provide email' }, { status: 400 })
        }

        const result = await User.deleteOne({ email })

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully. You can now sign up again.'
        }, { status: 200 })
    } catch (error: any) {
        console.error('Reset error:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
