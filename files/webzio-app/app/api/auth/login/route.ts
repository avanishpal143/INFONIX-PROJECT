import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email, password } = await req.json()

    console.log('🔐 Login attempt:', { email, passwordLength: password?.length })

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide email and password' }, { status: 400 })
    }

    // Always check database first
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })
    }

    // Check email verification — skip for admin/superadmin
    if (!user.isVerified && user.role === 'user') {
      return NextResponse.json({
        success: false,
        message: 'Please verify your email first.',
        needsVerification: true,
        email: user.email
      }, { status: 403 })
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role })

    const response = NextResponse.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    }, { status: 200 })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'Server error. Please try again.' }, { status: 500 })
  }
}
