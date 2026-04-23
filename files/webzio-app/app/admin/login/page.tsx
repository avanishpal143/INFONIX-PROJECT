'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../stores/authStore'
import WebrazeoLogo from '../../../components/WebrazeoLogo'
import toast from 'react-hot-toast'

const C = {
    bg: '#0A0F1E',
    card: '#1E293B',
    purple: '#7C3AED',
    cyan: '#22D3EE',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    border: 'rgba(124, 58, 237, 0.2)',
}

export default function AdminLoginPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please enter email and password')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (data.success) {
                // Check if user is admin or superadmin
                if (data.user.role === 'admin' || data.user.role === 'superadmin') {
                    login(data.user, data.token)
                    toast.success('Welcome to Super Admin Panel!', { duration: 3000 })
                    router.push('/admin')
                } else {
                    toast.error('Access denied. Admin privileges required.')
                }
            } else {
                toast.error(data.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${C.bg} 0%, #1a1f35 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${C.purple}40, transparent)`,
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: `radial-gradient(circle, ${C.cyan}30, transparent)`,
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'float 8s ease-in-out infinite reverse'
            }} />

            <div style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: '24px',
                padding: '48px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: `0 20px 60px rgba(124, 58, 237, 0.3), 0 0 100px rgba(34, 211, 238, 0.1)`,
                position: 'relative',
                zIndex: 1,
                backdropFilter: 'blur(10px)'
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    gap: '12px'
                }}>
                    <WebrazeoLogo size={40} showText={true} />
                    <p style={{
                        color: C.textMuted,
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        margin: 0,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                    }}>
                        Master Control Panel
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: C.textMuted,
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: C.bg,
                                border: `2px solid ${C.border}`,
                                borderRadius: '12px',
                                color: C.text,
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = C.purple}
                            onBlur={(e) => e.target.style.borderColor = C.border}
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: C.textMuted,
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: C.bg,
                                border: `2px solid ${C.border}`,
                                borderRadius: '12px',
                                color: C.text,
                                fontSize: '0.95rem',
                                outline: 'none',
                                transition: 'all 0.3s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = C.purple}
                            onBlur={(e) => e.target.style.borderColor = C.border}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 800,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: `0 8px 24px rgba(124, 58, 237, 0.4)`,
                            opacity: loading ? 0.7 : 1,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {loading ? 'Authenticating...' : '⚡ Access Control Panel'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: `${C.purple}10`,
                    border: `1px solid ${C.purple}30`,
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '0.75rem',
                        color: C.textMuted,
                        margin: 0
                    }}>
                        🔒 Restricted Access · Admin Credentials Required
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    )
}
