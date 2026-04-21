'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function VerifyOTPPage() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get('email') || ''
  const { login } = useAuthStore()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(id)
  }, [countdown])

  function handleChange(val: string, idx: number) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter all 6 digits'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Email verified! Welcome 🎉')
        login(data.user, data.token)
        router.push('/dashboard')
      } else {
        toast.error(data.message || 'Invalid OTP')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      toast.error('Something went wrong.')
    }
    setLoading(false)
  }

  async function handleResend() {
    if (countdown > 0) return
    setResending(true)
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('New OTP sent to your email!')
        setCountdown(60)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        toast.error(data.message || 'Failed to resend OTP')
      }
    } catch {
      toast.error('Failed to resend OTP')
    }
    setResending(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 40, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📧</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 8, color: '#111' }}>Verify Your Email</h2>
          <p style={{ color: '#6b7280', fontSize: '.88rem', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br/>
            <strong style={{ color: '#4f46e5' }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify}>
          {/* OTP Input boxes */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }} onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                style={{
                  width: 52, height: 56, textAlign: 'center', fontSize: '1.4rem', fontWeight: 800,
                  border: `2px solid ${digit ? '#4f46e5' : '#e5e7eb'}`,
                  borderRadius: 12, outline: 'none', transition: 'all .2s',
                  background: digit ? '#f5f3ff' : '#fff', color: '#4f46e5',
                }}
                onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                onBlur={e => (e.target.style.borderColor = otp[i] ? '#4f46e5' : '#e5e7eb')}
              />
            ))}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,.4)', opacity: loading ? 0.75 : 1, transition: 'all .2s' }}>
            {loading ? 'Verifying...' : 'Verify Email →'}
          </button>
        </form>

        {/* Resend */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {countdown > 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '.85rem' }}>
              Resend OTP in <strong style={{ color: '#4f46e5' }}>{countdown}s</strong>
            </p>
          ) : (
            <button onClick={handleResend} disabled={resending}
              style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', textDecoration: 'underline' }}>
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '.8rem', marginTop: 16 }}>
          Wrong email?{' '}
          <a href="/signup" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Go back</a>
        </p>
      </div>
    </div>
  )
}
