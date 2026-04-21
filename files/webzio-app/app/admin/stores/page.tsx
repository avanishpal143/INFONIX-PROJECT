'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'

export default function AdminStoresPage() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

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
    setToggling(null)
  }

  const deleteStore = async (id: string) => {
    if (!confirm('Delete this store permanently?')) return
    setDeleting(id)
    await fetch(`/api/admin/stores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setStores(s => s.filter(x => x._id !== id))
    setDeleting(null)
  }

  return (
    <div>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
        .store-row{transition:background .15s ease,transform .15s ease}
        .store-row:hover{background:${C.card2}!important}
        .action-btn{transition:all .15s ease;cursor:pointer}
        .action-btn:hover{transform:translateY(-1px);filter:brightness(1.15)}
        .hover-panel{animation:slideRight .2s ease}
      `}</style>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, animation:'fadeIn .4s ease' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, color:C.text, letterSpacing:'-.02em' }}>🏪 Store Management</h1>
          <p style={{ color:C.textMuted, fontSize:'.84rem', marginTop:4 }}>{total} total stores</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div style={{ padding:'8px 14px', background:`${C.green}12`, border:`1px solid ${C.green}25`, borderRadius:10, fontSize:'.78rem', fontWeight:700, color:C.green }}>
            ● {stores.filter(s => s.isEnabled).length} Active
          </div>
          <div style={{ padding:'8px 14px', background:`${C.red}12`, border:`1px solid ${C.red}25`, borderRadius:10, fontSize:'.78rem', fontWeight:700, color:C.red }}>
            ○ {stores.filter(s => !s.isEnabled).length} Disabled
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, animation:'fadeIn .4s ease .1s both' }}>
        <div style={{ flex:1, position:'relative' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.textMuted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or slug..."
            style={{ width:'100%', padding:'11px 16px 11px 40px', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:'.86rem', outline:'none' }}
            onFocus={e => (e.target.style.borderColor = C.blue)}
            onBlur={e => (e.target.style.borderColor = C.border)} />
        </div>
        {(['','active','inactive'] as const).map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} className="action-btn" style={{
            padding:'10px 18px', borderRadius:10, fontSize:'.82rem', fontWeight:700,
            background: status===s ? `${C.blue}20` : C.card,
            border: `1px solid ${status===s ? C.blue+'50' : C.border}`,
            color: status===s ? '#60A5FA' : C.textMuted,
          }}>{s===''?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>

      {/* Store Cards Grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:C.textMuted }}>Loading stores...</div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, color:C.textMuted }}>No stores found</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 }}>
          {stores.map((s, i) => (
            <div key={s._id} className="admin-card"
              onMouseEnter={() => setHovered(s._id)}
              onMouseLeave={() => setHovered(null)}
              style={{ background:C.card, border:`1px solid ${hovered===s._id ? C.blue+'50' : C.cardBorder}`, borderRadius:16, overflow:'hidden', position:'relative', transition:'all .25s ease', animation:`fadeIn .4s ease ${i*60}ms both`, boxShadow: hovered===s._id ? `0 8px 32px ${C.blue}20` : 'none' }}>

              {/* Top color bar */}
              <div style={{ height:4, background: s.isEnabled ? `linear-gradient(90deg,${C.green},${C.cyan})` : `linear-gradient(90deg,${C.red},${C.amber})` }} />

              <div style={{ padding:'18px 20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                  <div>
                    <div style={{ fontSize:'.95rem', fontWeight:800, color:C.text, marginBottom:3 }}>{s.siteName}</div>
                    <div style={{ fontSize:'.72rem', color:C.textMuted }}>/{s.slug}</div>
                  </div>
                  <span style={{ fontSize:'.68rem', fontWeight:800, padding:'3px 10px', borderRadius:20, color: s.isEnabled ? C.green : C.red, background: s.isEnabled ? `${C.green}12` : `${C.red}12`, border:`1px solid ${s.isEnabled ? C.green : C.red}20` }}>
                    {s.isEnabled ? '● Live' : '○ Off'}
                  </span>
                </div>

                {/* Owner */}
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:C.card2, borderRadius:10, marginBottom:12 }}>
                  <div style={{ width:28, height:28, background:`linear-gradient(135deg,${C.purple},${C.cyan})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', color:'#fff', fontWeight:800, flexShrink:0 }}>
                    {s.userId?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize:'.8rem', fontWeight:700, color:C.text }}>{s.userId?.name || 'Unknown'}</div>
                    <div style={{ fontSize:'.68rem', color:C.textMuted }}>{s.userId?.email}</div>
                  </div>
                </div>

                {/* Stats — visible on hover */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14, opacity: hovered===s._id ? 1 : 0.6, transition:'opacity .2s' }}>
                  {[
                    { label:'Views', value: s.views || 0, color: C.blue, icon:'👁' },
                    { label:'Leads', value: s.leads || 0, color: C.green, icon:'📋' },
                    { label:'Template', value: `#${s.templateId}`, color: C.amber, icon:'🎨' },
                  ].map(({ label, value, color, icon }) => (
                    <div key={label} style={{ background:`${color}10`, borderRadius:8, padding:'8px', textAlign:'center', border:`1px solid ${color}15` }}>
                      <div style={{ fontSize:'.75rem', marginBottom:2 }}>{icon}</div>
                      <div style={{ fontSize:'.88rem', fontWeight:800, color }}>{value}</div>
                      <div style={{ fontSize:'.6rem', color:C.textMuted, fontWeight:600 }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Hover detail */}
                {hovered === s._id && (
                  <div className="hover-panel" style={{ padding:'10px 12px', background:`${C.blue}08`, borderRadius:10, border:`1px solid ${C.blue}15`, marginBottom:12, fontSize:'.75rem', color:C.textMuted }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span>Created</span><span style={{ color:C.text, fontWeight:600 }}>{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span>Published</span><span style={{ color: s.isPublished ? C.green : C.amber, fontWeight:600 }}>{s.isPublished ? 'Yes' : 'Draft'}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span>Category</span><span style={{ color:C.text, fontWeight:600 }}>{s.templateCategory || '—'}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => toggleEnabled(s._id, s.isEnabled)} disabled={toggling===s._id} className="action-btn" style={{
                    flex:1, padding:'8px', borderRadius:9, fontSize:'.75rem', fontWeight:700, border:'none',
                    background: s.isEnabled ? `${C.red}12` : `${C.green}12`,
                    color: s.isEnabled ? C.red : C.green,
                  }}>{toggling===s._id ? '...' : s.isEnabled ? 'Disable' : 'Enable'}</button>
                  <button onClick={() => deleteStore(s._id)} disabled={deleting===s._id} className="action-btn" style={{ padding:'8px 12px', borderRadius:9, fontSize:'.75rem', fontWeight:700, border:'none', background:`${C.red}10`, color:C.red }}>
                    {deleting===s._id ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className="action-btn" style={{
              width:36, height:36, borderRadius:8, fontSize:'.82rem', fontWeight:700,
              background: page===p ? `${C.blue}20` : C.card,
              border: `1px solid ${page===p ? C.blue+'50' : C.border}`,
              color: page===p ? '#60A5FA' : C.textMuted,
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}
