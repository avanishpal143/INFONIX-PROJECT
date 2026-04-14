'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)
  const [lockTime, setLockTime] = useState<number | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setAttemptsLeft(null)
    setLockTime(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Welcome back!', { id: 'login-success', duration: 3000 })
        login(data.user, data.token)
        router.push('/dashboard')
      } else {
        // Handle different error scenarios
        if (data.locked) {
          setLockTime(data.remainingTime)
          toast.error(data.message, { id: 'login-locked', duration: 6000 })
        } else if (data.needsVerification) {
          toast.error(data.message, { duration: 5000, id: 'verification-needed' })
          setTimeout(() => {
            router.push(`/signup?email=${encodeURIComponent(data.email)}`)
          }, 2000)
        } else if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft)
          toast.error(data.message, { id: 'login-error', duration: 5000 })
        } else {
          toast.error(data.message || 'Login failed', { id: 'login-error' })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.', { id: 'login-failed' })
    }
    setLoading(false)
  }

  function handleGoogleLogin() {
    setLoading(true)
    signIn('google', {
      callbackUrl: '/auth-callback',
      redirect: true
    }).catch((error) => {
      console.error('Google login error:', error)
      toast.error('Google login failed. Please try again.', { id: 'google-error' })
      setLoading(false)
    })
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
      <style jsx>{`
        @media (max-width: 768px) {
          .login-container {
            padding: 30px 20px !important;
            max-width: 100% !important;
          }
          .login-title {
            font-size: 1.3rem !important;
          }
          .login-icon {
            width: 50px !important;
            height: 50px !important;
            font-size: 1.5rem !important;
          }
        }
      `}</style>

      <div className="login-container" style={{
        width: '100%',
        maxWidth: 420,
        padding: 40,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="login-icon" style={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '1.8rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="login-title" style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            marginBottom: 8,
            color: '#1a202c'
          }}>Welcome Back</h2>
          <p style={{ color: '#718096', fontSize: '.9rem' }}>Login to manage your store</p>
        </div>

        {/* Warning Messages */}
        {lockTime && (
          <div style={{
            padding: 12,
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: 10,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '.85rem', color: '#DC2626', fontWeight: 600 }}>
              🔒 Account locked for {lockTime} minute(s)
            </p>
          </div>
        )}

        {attemptsLeft !== null && attemptsLeft > 0 && (
          <div style={{
            padding: 12,
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: 10,
            marginBottom: 20,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '.85rem', color: '#D97706', fontWeight: 600 }}>
              ⚠️ {attemptsLeft} attempt(s) remaining
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 18 }}>
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
              disabled={lockTime !== null}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: 10,
                outline: 'none',
                transition: 'all 0.2s',
                fontSize: '.95rem',
                opacity: lockTime !== null ? 0.6 : 1
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
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                disabled={lockTime !== null}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '45px',
                  border: '2px solid #e2e8f0',
                  borderRadius: 10,
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontSize: '.95rem',
                  opacity: lockTime !== null ? 0.6 : 1
                }}
                onFocus={e => e.target.style.borderColor = '#667eea'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={lockTime !== null}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: lockTime !== null ? 'not-allowed' : 'pointer',
                  fontSize: '1.2rem',
                  opacity: lockTime !== null ? 0.6 : 1
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || lockTime !== null}
            style={{
              width: '100%',
              padding: 14,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: '.95rem',
              fontWeight: 700,
              cursor: (loading || lockTime !== null) ? 'not-allowed' : 'pointer',
              marginTop: 10,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              opacity: (loading || lockTime !== null) ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Logging in...' : lockTime ? `Locked (${lockTime}m)` : 'Login Now'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ padding: '0 12px', color: '#a0aec0', fontSize: '.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || lockTime !== null}
          style={{
            width: '100%',
            padding: 12,
            background: '#fff',
            color: '#2d3748',
            border: '2px solid #e2e8f0',
            borderRadius: 10,
            fontSize: '.9rem',
            fontWeight: 600,
            cursor: (loading || lockTime !== null) ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: (loading || lockTime !== null) ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"></path>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"></path>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"></path>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"></path>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', color: '#718096', fontSize: '.85rem', marginTop: 24 }}>
          Don't have an account? <Link href="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>Create Free Store</Link>
        </p>

        <div style={{
          marginTop: 20,
          padding: 12,
          background: '#edf2f7',
          borderRadius: 8,
          fontSize: '.75rem',
          color: '#4a5568',
          textAlign: 'center'
        }}>
          🔒 Secure login with email verification
        </div>
      </div>
    </div>
  )
}
