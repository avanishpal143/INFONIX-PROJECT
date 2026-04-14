import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateOTP, sendOTPEmail } from '../../../../lib/email'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      existingUser.name = name
      existingUser.password = password
      existingUser.otp = otp
      existingUser.otpExpiry = otpExpiry
      await existingUser.save()
    } else {
      // Create new user (unverified)
      await User.create({
        name,
        email,
        password,
        isVerified: false,
        otp,
        otpExpiry
      })
    }

    // Send OTP email
    await sendOTPEmail(email, otp, name)

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      email
    }, { status: 200 })

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
