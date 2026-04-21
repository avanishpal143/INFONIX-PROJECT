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
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Manual email/password login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Welcome back!')
        login(data.user, data.token)
        router.push('/dashboard')
      } else if (data.needsVerification) {
        // Redirect to OTP verification
        toast.error('Please verify your email first.')
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`)
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  // Google OAuth login
  async function handleGoogleLogin() {
    setGoogleLoading(true)
    try {
      const result = await signIn('google', { redirect: false })
      if (result?.error) {
        toast.error('Google login failed. Please try again.')
        setGoogleLoading(false)
        return
      }
      // After Google login, fetch session and store in zustand
      const sessionRes = await fetch('/api/auth/session')
      const session = await sessionRes.json()
      if (session?.user) {
        const customToken = (session.user as any).customToken
        login({ id: (session.user as any).id, name: session.user.name, email: session.user.email }, customToken)
        toast.success(`Welcome, ${session.user.name}!`)
        router.push('/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch {
      toast.error('Google login failed.')
      setGoogleLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
    borderRadius: 10, outline: 'none', fontSize: '.95rem', transition: 'border-color .2s',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 40, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.6rem' }}>
            🔐
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 6, color: '#111' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280', fontSize: '.9rem' }}>Login to manage your store</p>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          style={{ width: '100%', padding: '12px 16px', background: '#fff', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: '.92rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, transition: 'all .2s', opacity: googleLoading ? 0.7 : 1 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#4f46e5'; (e.currentTarget as HTMLButtonElement).style.background = '#f5f3ff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
        >
          {googleLoading ? (
            <span style={{ fontSize: '.85rem' }}>Connecting to Google...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}/>
          <span style={{ padding: '0 12px', color: '#9ca3af', fontSize: '.8rem', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }}/>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 18 }}>
          <div>
            <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#4f46e5')}
              onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          <div>
            <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#9ca3af' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading || googleLoading}
            style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,.4)', opacity: loading ? 0.75 : 1, transition: 'all .2s' }}>
            {loading ? 'Logging in...' : 'Login Now'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '.85rem', marginTop: 24 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>Create Free Store</Link>
        </p>
      </div>
    </div>
  )
}
