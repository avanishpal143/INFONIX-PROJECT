'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../stores/authStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = {
  purple: '#8B5CF6', card: '#0F172A', cardBorder: 'rgba(139,92,246,0.12)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444', blue: '#3B82F6',
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { token } = useAuthStore()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setData(d) })
      .finally(() => setLoading(false))
  }, [params.id, token])

  const toggleActive = async () => {
    setToggling(true)
    const res = await fetch(`/api/admin/users/${params.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !data.user.isActive }),
    })
    const d = await res.json()
    if (d.success) setData((prev: any) => ({ ...prev, user: d.user }))
    setToggling(false)
  }

  const deleteUser = async () => {
    if (!confirm('Delete this user and ALL their stores? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/admin/users/${params.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    router.push('/admin/users')
  }

  if (loading) return <div style={{ color: C.textMuted, padding: 40 }}>Loading...</div>
  if (!data) return <div style={{ color: C.red, padding: 40 }}>User not found.</div>

  const { user, stores } = data

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/admin/users" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>← Back to Users</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* User Card */}
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 800, margin: '0 auto 14px', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: C.text, marginBottom: 4 }}>{user.name}</div>
              <div style={{ fontSize: '0.82rem', color: C.textMuted }}>{user.email}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Status', value: user.isActive ? '● Active' : '○ Inactive', color: user.isActive ? C.green : C.red },
                { label: 'Verified', value: user.isVerified ? '✓ Yes' : '✗ No', color: user.isVerified ? C.green : '#F59E0B' },
                { label: 'Role', value: user.role?.toUpperCase(), color: C.purple },
                { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString(), color: C.textMuted },
                { label: 'Login Count', value: user.loginCount || 0, color: C.blue },
                { label: 'Last Login', value: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never', color: C.textMuted },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(139,92,246,0.04)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.08)' }}>
                  <span style={{ fontSize: '0.78rem', color: C.textMuted, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color }}>{String(value)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={toggleActive} disabled={toggling} style={{
                flex: 1, padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', border: 'none',
                background: user.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                color: user.isActive ? C.red : C.green,
              }}>{toggling ? '...' : user.isActive ? 'Deactivate' : 'Activate'}</button>
              <button onClick={deleteUser} disabled={deleting} style={{ flex: 1, padding: '11px', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', border: 'none', background: 'rgba(239,68,68,0.08)', color: C.red }}>
                {deleting ? '...' : '🗑 Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Stores */}
        <div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>🏪 Stores ({stores?.length || 0})</h3>
            {!stores?.length ? (
              <p style={{ color: C.textMuted, fontSize: '0.85rem' }}>No stores created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stores.map((s: any) => (
                  <div key={s._id} style={{ padding: '16px 18px', background: 'rgba(139,92,246,0.04)', borderRadius: 12, border: '1px solid rgba(139,92,246,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text, marginBottom: 4 }}>{s.siteName}</div>
                      <div style={{ fontSize: '0.75rem', color: C.textMuted }}>/{s.slug} · {new Date(s.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: s.isEnabled ? C.green : C.red, background: s.isEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                        {s.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: C.textMuted }}>👁 {s.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Stats */}
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28, marginTop: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 16 }}>📊 Activity Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Total Stores', value: stores?.length || 0, color: C.purple },
                { label: 'Total Views', value: stores?.reduce((a: number, s: any) => a + (s.views || 0), 0) || 0, color: C.blue },
                { label: 'Total Leads', value: stores?.reduce((a: number, s: any) => a + (s.leads || 0), 0) || 0, color: C.green },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}20`, borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: C.textMuted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
