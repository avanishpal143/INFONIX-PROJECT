'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'signup' | 'verify'>('signup')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendCount, setResendCount] = useState(0)

  // Check if coming from login with email parameter
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setForm(prev => ({ ...prev, email: emailParam }))
      setRegisteredEmail(emailParam)
      setStep('verify')
      toast('Please verify your email to continue', { icon: '📧' })
    }
  }, [searchParams])

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (data.success) {
        toast.success('OTP sent to your email!', { duration: 4000 })
        setRegisteredEmail(data.email)
        setStep('verify')
        setResendCooldown(180) // 3 minutes cooldown
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Registration failed. Please try again.')
    }
    setLoading(false)
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail, otp })
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Email verified! Redirecting to login...', { duration: 3000 })
        setTimeout(() => router.push('/login'), 1500)
      } else {
        toast.error(data.message || 'Verification failed')
        if (data.message?.includes('expired')) {
          toast('Click "Resend OTP" to get a new code', { icon: '💡', duration: 4000 })
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Verification failed. Please try again.')
    }
    setLoading(false)
  }

  async function handleResendOTP() {
    if (resendCooldown > 0) {
      const minutes = Math.floor(resendCooldown / 60)
      const seconds = resendCooldown % 60
      toast.error(`Please wait ${minutes}:${seconds.toString().padStart(2, '0')} before requesting another OTP`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail })
      })
      const data = await res.json()

      if (data.success) {
        toast.success('New OTP sent to your email!', { duration: 4000 })
        setResendCooldown(180) // 3 minutes cooldown
        setResendCount(data.resendCount || 0)
        setOtp('') // Clear OTP input
      } else {
        if (data.cooldown && data.remainingSeconds) {
          setResendCooldown(data.remainingSeconds)
        }
        toast.error(data.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    }
    setLoading(false)
  }

  function handleBackToSignup() {
    setStep('signup')
    setOtp('')
    setResendCooldown(0)
    setResendCount(0)
    // Don't clear form data so user can edit if needed
  }

  const formatCooldown = () => {
    const minutes = Math.floor(resendCooldown / 60)
    const seconds = resendCooldown % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 40, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        {step === 'signup' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.8rem'
              }}>🚀</div>
              <h2 className="signup-title" style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                marginBottom: 8,
                color: '#1a202c'
              }}>Join Infonix Cloud</h2>
              <p style={{ color: '#718096', fontSize: '.9rem' }}>Build your store in minutes</p>
            </div>

            <form onSubmit={handleSignup} style={{ display: 'grid', gap: 18 }}>
              <div>
                <label style={{
                  fontSize: '.8rem',
                  fontWeight: 600,
                  color: '#2d3748',
                  display: 'block',
                  marginBottom: 6
                }}>Full Name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: 10,
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontSize: '.95rem'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '.8rem',
                  fontWeight: 600,
                  color: '#2d3748',
                  display: 'block',
                  marginBottom: 6
                }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value.toLowerCase() })}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: 10,
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontSize: '.95rem'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '.8rem',
                  fontWeight: 600,
                  color: '#2d3748',
                  display: 'block',
                  marginBottom: 6
                }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      paddingRight: '45px',
                      border: '2px solid #e2e8f0',
                      borderRadius: 10,
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontSize: '.95rem'
                    }}
                    onFocus={e => e.target.style.borderColor = '#667eea'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p style={{ fontSize: '.75rem', color: '#a0aec0', marginTop: 4 }}>Minimum 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 14,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 10,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Sending OTP...' : 'Sign Up Free'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: '#718096', fontSize: '.85rem', marginTop: 24 }}>
              Already have an account? <Link href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '1.8rem'
              }}>📧</div>
              <h2 className="signup-title" style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                marginBottom: 8,
                color: '#1a202c'
              }}>Verify Your Email</h2>
              <p style={{ color: '#718096', fontSize: '.9rem' }}>We sent a 6-digit code to</p>
              <p style={{ color: '#667eea', fontSize: '.9rem', fontWeight: 600, marginTop: 4 }}>{registeredEmail}</p>
            </div>

            <form onSubmit={handleVerifyOTP} style={{ display: 'grid', gap: 18 }}>
              <div>
                <label style={{
                  fontSize: '.8rem',
                  fontWeight: 600,
                  color: '#2d3748',
                  display: 'block',
                  marginBottom: 6
                }}>Enter OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: 10,
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    letterSpacing: '8px'
                  }}
                  onFocus={e => e.target.style.borderColor = '#667eea'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <p style={{ fontSize: '.75rem', color: '#a0aec0', marginTop: 8, textAlign: 'center' }}>
                  OTP expires in 10 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  width: '100%',
                  padding: 14,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: '.95rem',
                  fontWeight: 700,
                  cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  opacity: (loading || otp.length !== 6) ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || resendCooldown > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#a0aec0' : '#667eea',
                    fontSize: '.85rem',
                    fontWeight: 600,
                    cursor: (loading || resendCooldown > 0) ? 'not-allowed' : 'pointer',
                    textDecoration: resendCooldown > 0 ? 'none' : 'underline'
                  }}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${formatCooldown()}` : 'Resend OTP'}
                </button>
                {resendCount > 0 && (
                  <p style={{ fontSize: '.7rem', color: '#a0aec0', marginTop: 4 }}>
                    Resent {resendCount} time(s)
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleBackToSignup}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 12,
                  background: 'transparent',
                  color: '#718096',
                  border: '2px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: '.85rem',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ← Back to Signup
              </button>
            </form>

            <div style={{
              marginTop: 20,
              padding: 12,
              background: '#edf2f7',
              borderRadius: 8,
              fontSize: '.75rem',
              color: '#4a5568',
              textAlign: 'center'
            }}>
              💡 Didn't receive the code? Check your spam folder
            </div>
          </>
        )}
      </div>
    </div>
  )
}
