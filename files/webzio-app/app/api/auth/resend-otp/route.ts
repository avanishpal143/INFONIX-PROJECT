import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import { generateOTP, sendOTPEmail } from '../../../../lib/email'

const RESEND_COOLDOWN = 3 * 60 * 1000 // 3 minutes in milliseconds
const MAX_RESEND_ATTEMPTS = 5 // Maximum resends per session

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ success: false, message: 'Please provide email' }, { status: 400 })
        }

        const user = await User.findOne({ email }).select('+lastOtpResendAt +otpResendCount')

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        if (user.isVerified) {
            return NextResponse.json({ success: false, message: 'Email already verified. Please login.' }, { status: 400 })
        }

        // Check cooldown period
        if (user.lastOtpResendAt) {
            const timeSinceLastResend = Date.now() - user.lastOtpResendAt.getTime()
            if (timeSinceLastResend < RESEND_COOLDOWN) {
                const remainingTime = Math.ceil((RESEND_COOLDOWN - timeSinceLastResend) / 1000)
                const minutes = Math.floor(remainingTime / 60)
                const seconds = remainingTime % 60

                return NextResponse.json({
                    success: false,
                    message: `Please wait ${minutes}:${seconds.toString().padStart(2, '0')} before requesting another OTP`,
                    cooldown: true,
                    remainingSeconds: remainingTime
                }, { status: 429 })
            }
        }

        // Check max resend attempts
        const resendCount = user.otpResendCount || 0
        if (resendCount >= MAX_RESEND_ATTEMPTS) {
            return NextResponse.json({
                success: false,
                message: 'Maximum OTP resend attempts reached. Please contact support or try again later.'
            }, { status: 429 })
        }

        // Generate new OTP
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.otp = otp
        user.otpExpiry = otpExpiry
        user.lastOtpResendAt = new Date()
        user.otpResendCount = resendCount + 1
        await user.save()

        // Send OTP email
        await sendOTPEmail(email, otp, user.name)

        return NextResponse.json({
            success: true,
            message: 'New OTP sent to your email. Please wait 3 minutes before requesting another.',
            resendCount: user.otpResendCount,
            maxResends: MAX_RESEND_ATTEMPTS
        }, { status: 200 })

    } catch (error: any) {
        console.error('Resend OTP error:', error)
        return NextResponse.json({ success: false, message: 'Failed to resend OTP. Please try again.' }, { status: 500 })
    }
}
