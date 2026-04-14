'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import Link from 'next/link'

const C = {
  purple: '#8B5CF6', card: '#0F172A', cardBorder: 'rgba(139,92,246,0.12)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444',
}

export default function AdminUsersPage() {
  const { token } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), search, status })
    const res = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) { setUsers(data.users); setTotal(data.total); setPages(data.pages) }
    setLoading(false)
  }

  useEffect(() => { load() }, [page, status])
  useEffect(() => { const t = setTimeout(() => load(), 400); return () => clearTimeout(t) }, [search])

  const toggleActive = async (id: string, current: boolean) => {
    setToggling(id)
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !current }),
    })
    setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !current } : x))
    setToggling(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text, letterSpacing: '-0.02em' }}>👥 User Management</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>{total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name or email..."
          style={{ flex: 1, minWidth: 240, padding: '12px 16px', background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, color: C.text, fontSize: '0.88rem', outline: 'none' }}
        />
        {(['', 'active', 'inactive'] as const).map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} style={{
            padding: '10px 18px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            background: status === s ? 'rgba(139,92,246,0.2)' : C.card,
            border: `1px solid ${status === s ? 'rgba(139,92,246,0.5)' : C.cardBorder}`,
            color: status === s ? '#A78BFA' : C.textMuted,
          }}>{s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
              {['User', 'Email', 'Stores', 'Verified', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No users found</td></tr>
            ) : users.map((u, i) => (
              <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${C.cardBorder}` : 'none', transition: 'background 0.15s' }}>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: '#fff', fontWeight: 800 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: C.text }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 18px', fontSize: '0.82rem', color: C.textMuted }}>{u.email}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: C.purple, background: 'rgba(139,92,246,0.1)', padding: '3px 10px', borderRadius: 20 }}>{u.storeCount}</span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: u.isVerified ? C.green : '#F59E0B', background: u.isVerified ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {u.isVerified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: u.isActive ? C.green : C.red, background: u.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    {u.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', fontSize: '0.78rem', color: C.textMuted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/users/${u._id}`} style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, color: '#A78BFA', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>View</Link>
                    <button onClick={() => toggleActive(u._id, u.isActive)} disabled={toggling === u._id} style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                      background: u.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                      color: u.isActive ? C.red : C.green,
                    }}>{toggling === u._id ? '...' : u.isActive ? 'Deactivate' : 'Activate'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 36, height: 36, borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              background: page === p ? 'rgba(139,92,246,0.2)' : C.card,
              border: `1px solid ${page === p ? 'rgba(139,92,246,0.5)' : C.cardBorder}`,
              color: page === p ? '#A78BFA' : C.textMuted,
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}
