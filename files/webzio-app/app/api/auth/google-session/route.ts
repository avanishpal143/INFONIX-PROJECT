import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Update last login
        user.lastLogin = new Date()
        user.loginCount = (user.loginCount || 0) + 1
        await user.save()

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            }
        }, { status: 200 })

    } catch (error: any) {
        console.error('Google session error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
