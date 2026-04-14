'use client'
import { useState } from 'react'

export default function ResetUserPage() {
    const [email, setEmail] = useState('rahulkumar9508548671@gm')
    const [message, setMessage] = useState('')

    async function handleReset() {
        try {
            const res = await fetch('/api/auth/reset', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            setMessage(data.message || 'User reset complete!')
        } catch (error) {
            setMessage('Error resetting user')
        }
    }

    return (
        <div style={{ padding: 40, maxWidth: 500, margin: '0 auto' }}>
            <h1>Reset User (Development Only)</h1>
            <p>This will delete the user from the database so you can sign up again.</p>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: 10, marginBottom: 10, border: '1px solid #ccc', borderRadius: 5 }}
                placeholder="Enter email to reset"
            />
            <button
                onClick={handleReset}
                style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
            >
                Delete User
            </button>
            {message && <p style={{ marginTop: 20, padding: 10, background: '#f0f0f0', borderRadius: 5 }}>{message}</p>}
        </div>
    )
}
