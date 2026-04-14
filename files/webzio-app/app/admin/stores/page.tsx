'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import Link from 'next/link'

const C = {
  purple: '#8B5CF6', blue: '#3B82F6', card: '#0F172A', cardBorder: 'rgba(139,92,246,0.12)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444',
}

export default function AdminStoresPage() {
  const { token } = useAuthStore()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), search, status })
    const res = await fetch(`/api/admin/stores?${params}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) { setStores(data.stores); setTotal(data.total); setPages(data.pages) }
    setLoading(false)
  }

  useEffect(() => { load() }, [page, status])
  useEffect(() => { const t = setTimeout(() => load(), 400); return () => clearTimeout(t) }, [search])

  const toggleEnabled = async (id: string, current: boolean) => {
    setToggling(id)
    await fetch(`/api/admin/stores/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isEnabled: !current }),
    })
    setStores(s => s.map(x => x._id === id ? { ...x, isEnabled: !current } : x))
    if (selected?._id === id) setSelected((p: any) => p ? { ...p, isEnabled: !current } : p)
    setToggling(null)
  }

  const deleteStore = async (id: string) => {
    if (!confirm('Delete this store permanently?')) return
    setDeleting(id)
    await fetch(`/api/admin/stores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setStores(s => s.filter(x => x._id !== id))
    if (selected?._id === id) setSelected(null)
    setDeleting(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text, letterSpacing: '-0.02em' }}>🏪 Store Management</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>{total} total stores</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name or slug..."
          style={{ flex: 1, padding: '12px 16px', background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 10, color: C.text, fontSize: '0.88rem', outline: 'none' }} />
        {(['', 'active', 'inactive'] as const).map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} style={{
            padding: '10px 18px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            background: status === s ? 'rgba(59,130,246,0.2)' : C.card,
            border: `1px solid ${status === s ? 'rgba(59,130,246,0.5)' : C.cardBorder}`,
            color: status === s ? '#60A5FA' : C.textMuted,
          }}>{s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        {/* Table */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                {['Store', 'Owner', 'Views', 'Leads', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>Loading...</td></tr>
              ) : stores.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textMuted }}>No stores found</td></tr>
              ) : stores.map((s, i) => (
                <tr key={s._id} onClick={() => setSelected(selected?._id === s._id ? null : s)}
                  style={{ borderBottom: i < stores.length - 1 ? `1px solid ${C.cardBorder}` : 'none', cursor: 'pointer', background: selected?._id === s._id ? 'rgba(59,130,246,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: C.text }}>{s.siteName}</div>
                    <div style={{ fontSize: '0.72rem', color: C.textMuted }}>/{s.slug}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: C.text }}>{s.userId?.name || '—'}</div>
                    <div style={{ fontSize: '0.7rem', color: C.textMuted }}>{s.userId?.email}</div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 700, color: C.blue }}>👁 {s.views || 0}</td>
                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 700, color: C.green }}>📋 {s.leads || 0}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, color: s.isEnabled ? C.green : C.red, background: s.isEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                      {s.isEnabled ? '● On' : '○ Off'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: '0.78rem', color: C.textMuted }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => toggleEnabled(s._id, s.isEnabled)} disabled={toggling === s._id} style={{
                        padding: '6px 10px', borderRadius: 7, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: s.isEnabled ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                        color: s.isEnabled ? C.red : C.green,
                      }}>{toggling === s._id ? '...' : s.isEnabled ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => deleteStore(s._id)} disabled={deleting === s._id} style={{ padding: '6px 10px', borderRadius: 7, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'rgba(239,68,68,0.08)', color: C.red }}>
                        {deleting === s._id ? '...' : '🗑'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Side Detail Panel */}
        {selected && (
          <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24, height: 'fit-content', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text }}>Store Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { l: 'Name', v: selected.siteName },
                { l: 'URL Slug', v: `/${selected.slug}` },
                { l: 'Owner', v: selected.userId?.name },
                { l: 'Email', v: selected.userId?.email },
                { l: 'Template ID', v: `#${selected.templateId}` },
                { l: 'Category', v: selected.templateCategory || '—' },
                { l: 'Status', v: selected.isEnabled ? 'Enabled' : 'Disabled' },
                { l: 'Published', v: selected.isPublished ? 'Yes' : 'Draft' },
                { l: 'Views', v: selected.views || 0 },
                { l: 'Leads', v: selected.leads || 0 },
                { l: 'Orders', v: selected.orders || 0 },
                { l: 'Created', v: new Date(selected.createdAt).toLocaleDateString() },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(139,92,246,0.04)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.06)' }}>
                  <span style={{ fontSize: '0.75rem', color: C.textMuted, fontWeight: 600 }}>{l}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text }}>{String(v)}</span>
                </div>
              ))}
            </div>
            {/* Analytics mini */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { label: 'Views', value: selected.views || 0, color: C.blue },
                { label: 'Leads', value: selected.leads || 0, color: C.green },
                { label: 'Orders', value: selected.orders || 0, color: C.purple },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: `${color}10`, borderRadius: 10, padding: '12px', textAlign: 'center', border: `1px solid ${color}20` }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color }}>{value}</div>
                  <div style={{ fontSize: '0.65rem', color: C.textMuted, fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              width: 36, height: 36, borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              background: page === p ? 'rgba(59,130,246,0.2)' : C.card,
              border: `1px solid ${page === p ? 'rgba(59,130,246,0.5)' : C.cardBorder}`,
              color: page === p ? '#60A5FA' : C.textMuted,
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}
