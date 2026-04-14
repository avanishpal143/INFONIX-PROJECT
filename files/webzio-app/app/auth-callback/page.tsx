'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { login } = useAuthStore()
    const [error, setError] = useState(false)

    useEffect(() => {
        async function handleAuth() {
            if (status === 'loading') return

            if (status === 'authenticated' && session?.user) {
                try {
                    // Fetch user data from database to get the MongoDB _id
                    const response = await fetch('/api/auth/google-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: session.user.email })
                    })

                    const data = await response.json()

                    if (data.success && data.user) {
                        // Generate a session token for Google OAuth users
                        const sessionToken = `google-oauth-${data.user.id}-${Date.now()}`

                        // Update auth store with complete user data
                        login({
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            role: data.user.role,
                        }, sessionToken)

                        toast.success('Welcome back!', { duration: 3000 })

                        // Small delay to ensure state is updated
                        setTimeout(() => {
                            router.push('/dashboard')
                        }, 500)
                    } else {
                        throw new Error('Failed to fetch user data')
                    }
                } catch (error) {
                    console.error('Auth callback error:', error)
                    setError(true)
                    toast.error('Authentication failed. Please try again.')
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                }
            } else if (status === 'unauthenticated') {
                router.push('/login')
            }
        }

        handleAuth()
    }, [status, session, router, login])

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#fff',
                    padding: '40px'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '20px'
                    }}>❌</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                        Authentication Failed
                    </h2>
                    <p style={{ fontSize: '.9rem', opacity: 0.9 }}>
                        Redirecting to login...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{
                textAlign: 'center',
                color: '#fff'
            }}>
                <div style={{
                    width: 60,
                    height: 60,
                    border: '4px solid rgba(255,255,255,0.3)',
                    borderTop: '4px solid #fff',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
                    Signing you in...
                </h2>
                <p style={{ fontSize: '.9rem', opacity: 0.9 }}>
                    Please wait while we complete your login
                </p>
            </div>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
