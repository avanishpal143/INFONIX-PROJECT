import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateOTP, sendOTPEmail } from '../../../../lib/email'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const { email } = await req.json()
    if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 })

    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    if (user.isVerified) return NextResponse.json({ success: false, message: 'Email already verified' }, { status: 400 })

    const otp = generateOTP()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    await sendOTPEmail(email, otp, user.name)

    return NextResponse.json({ success: true, message: 'OTP resent successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
