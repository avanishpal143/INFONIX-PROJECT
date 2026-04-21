'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import Link from 'next/link'
import { useAdminTheme } from '../theme'

export default function AdminUsersPage() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<any | null>(null)
  const [view, setView] = useState<'card' | 'table'>('card')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), search, status })
    const res = await fetch(`/api/admin/users?${params}`, { headers })
    const data = await res.json()
    if (data.success) { setUsers(data.users); setTotal(data.total); setPages(data.pages) }
    setLoading(false)
  }

  useEffect(() => { load() }, [page, status])
  useEffect(() => { const t = setTimeout(() => load(), 400); return () => clearTimeout(t) }, [search])

  const toggleActive = async (id: string, current: boolean) => {
    setToggling(id)
    await fetch(`/api/admin/users/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ isActive: !current }) })
    setUsers(u => u.map(x => x._id === id ? { ...x, isActive: !current } : x))
    if (selected?._id === id) setSelected((p: any) => p ? { ...p, isActive: !current } : p)
    setToggling(null)
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user and ALL their stores & products? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers })
    setUsers(u => u.filter(x => x._id !== id))
    if (selected?._id === id) setSelected(null)
    setDeleting(null)
  }

  const getPlan = (storeCount: number) => {
    if (storeCount <= 1) return { label: 'Free', color: C.textMuted }
    if (storeCount <= 5) return { label: 'Pro', color: C.purple }
    return { label: 'Business', color: C.amber }
  }

  const getActivity = (u: any) => {
    const score = (u.storeCount || 0) * 3 + (u.productCount || 0) + Math.min(u.totalViews || 0, 50) / 10
    if (score >= 10) return { label: 'High', color: C.green }
    if (score >= 3) return { label: 'Medium', color: C.amber }
    return { label: 'Low', color: C.textMuted }
  }

  return (
    <div>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        .u-card{transition:all .2s ease;cursor:pointer}
        .u-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(99,102,241,.15)!important}
        .u-card.selected{border-color:${C.purple}!important;box-shadow:0 0 0 2px ${C.purple}30!important}
        .act-btn{transition:all .15s ease;cursor:pointer}
        .act-btn:hover{filter:brightness(1.12);transform:translateY(-1px)}
        .u-row{transition:background .12s}
        .u-row:hover{background:${C.card2}!important}
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, animation:'fadeIn .4s ease' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, color:C.text, letterSpacing:'-.02em' }}>👥 User Management</h1>
          <p style={{ color:C.textMuted, fontSize:'.84rem', marginTop:3 }}>
            <span style={{ color:C.text, fontWeight:700 }}>{total}</span> total users
          </p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {/* View toggle */}
          <div style={{ display:'flex', background:C.card2, borderRadius:10, padding:3, border:`1px solid ${C.border}` }}>
            {(['card','table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:'.78rem', fontWeight:700, background:view===v?C.purple:'transparent', color:view===v?'#fff':C.textMuted, transition:'all .2s' }}>
                {v==='card'?'⊞ Cards':'☰ Table'}
              </button>
            ))}
          </div>
          <div style={{ padding:'8px 14px', background:`${C.purple}12`, border:`1px solid ${C.purple}25`, borderRadius:10, fontSize:'.75rem', fontWeight:700, color:C.purpleLight }}>
            Free: 1 · Pro: 5 · Business: ∞
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, animation:'fadeIn .4s ease .1s both' }}>
        <div style={{ flex:1, position:'relative' }}>
          <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:C.textMuted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{ width:'100%', padding:'10px 14px 10px 38px', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:'.85rem', outline:'none', transition:'border-color .2s' }}
            onFocus={e => (e.target.style.borderColor = C.purple)}
            onBlur={e => (e.target.style.borderColor = C.border)} />
        </div>
        {(['','active','inactive'] as const).map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} className="act-btn" style={{
            padding:'10px 18px', borderRadius:10, fontSize:'.82rem', fontWeight:700,
            background: status===s ? `${C.purple}20` : C.card,
            border: `1px solid ${status===s ? C.purple+'50' : C.border}`,
            color: status===s ? C.purpleLight : C.textMuted,
          }}>{s===''?'All':s.charAt(0).toUpperCase()+s.slice(1)}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:60, color:C.textMuted }}>
          <div style={{ width:32, height:32, border:`3px solid ${C.purple}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
          Loading users...
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap:20, alignItems:'start' }}>

          {/* ── CARD VIEW ── */}
          {view === 'card' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {users.length === 0 ? (
                <div style={{ gridColumn:'1/-1', textAlign:'center', padding:60, color:C.textMuted }}>No users found</div>
              ) : users.map((u, i) => {
                const plan = getPlan(u.storeCount)
                const activity = getActivity(u)
                const isSelected = selected?._id === u._id
                return (
                  <div key={u._id} className={`u-card${isSelected?' selected':''}`}
                    onClick={() => setSelected(isSelected ? null : u)}
                    style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:18, animation:`fadeIn .3s ease ${i*40}ms both` }}>

                    {/* Top row */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:42, height:42, background:`linear-gradient(135deg,${C.purple},${C.cyan})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', color:'#fff', fontWeight:800, flexShrink:0 }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize:'.9rem', fontWeight:800, color:C.text }}>{u.name}</div>
                          <div style={{ fontSize:'.72rem', color:C.textMuted, marginTop:1 }}>{u.email}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                        <span style={{ fontSize:'.65rem', fontWeight:800, color:u.isActive?C.green:C.red, background:u.isActive?`${C.green}12`:`${C.red}12`, padding:'2px 8px', borderRadius:20 }}>
                          {u.isActive ? '● Active' : '○ Inactive'}
                        </span>
                        <span style={{ fontSize:'.65rem', fontWeight:800, color:plan.color, background:`${plan.color}12`, padding:'2px 8px', borderRadius:20 }}>{plan.label}</span>
                      </div>
                    </div>

                    {/* Activity stats */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
                      {[
                        { label:'Stores',   value: u.storeCount || 0,   color: C.blue,   icon:'🏪' },
                        { label:'Products', value: u.productCount || 0, color: C.purple, icon:'📦' },
                        { label:'Views',    value: u.totalViews || 0,   color: C.green,  icon:'👁' },
                        { label:'Leads',    value: u.totalLeads || 0,   color: C.amber,  icon:'📋' },
                      ].map(({ label, value, color, icon }) => (
                        <div key={label} style={{ background:C.card2, borderRadius:10, padding:'8px 6px', textAlign:'center', border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:'.8rem', marginBottom:2 }}>{icon}</div>
                          <div style={{ fontSize:'.9rem', fontWeight:900, color }}>{value}</div>
                          <div style={{ fontSize:'.58rem', color:C.textMuted, fontWeight:600 }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Activity level + joined */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:'.68rem', fontWeight:700, color:activity.color, background:`${activity.color}12`, padding:'2px 8px', borderRadius:20, border:`1px solid ${activity.color}20` }}>
                          {activity.label} Activity
                        </span>
                        {u.isVerified && <span style={{ fontSize:'.65rem', fontWeight:700, color:C.green, background:`${C.green}12`, padding:'2px 8px', borderRadius:20 }}>✓ Verified</span>}
                      </div>
                      <span style={{ fontSize:'.68rem', color:C.textMuted }}>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display:'flex', gap:7 }} onClick={e => e.stopPropagation()}>
                      <Link href={`/admin/users/${u._id}`} className="act-btn" style={{ flex:1, padding:'8px', background:`${C.purple}15`, border:`1px solid ${C.purple}25`, borderRadius:9, color:C.purpleLight, fontSize:'.75rem', fontWeight:700, textDecoration:'none', textAlign:'center' }}>
                        👁 View
                      </Link>
                      <button onClick={() => toggleActive(u._id, u.isActive)} disabled={toggling===u._id} className="act-btn" style={{
                        flex:1, padding:'8px', borderRadius:9, fontSize:'.75rem', fontWeight:700, border:'none',
                        background: u.isActive ? `${C.red}12` : `${C.green}12`,
                        color: u.isActive ? C.red : C.green,
                      }}>{toggling===u._id ? '...' : u.isActive ? '⏸ Deactivate' : '▶ Activate'}</button>
                      <button onClick={() => deleteUser(u._id)} disabled={deleting===u._id} className="act-btn" style={{
                        padding:'8px 12px', borderRadius:9, fontSize:'.75rem', fontWeight:700, border:'none',
                        background:`${C.red}12`, color:C.red,
                      }}>{deleting===u._id ? '...' : '🗑'}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {view === 'table' && (
            <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${C.border}`, background:C.card2 }}>
                    {['User','Stores','Products','Views','Activity','Status','Joined','Actions'].map(h => (
                      <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:'.65rem', fontWeight:800, color:C.textMuted, textTransform:'uppercase', letterSpacing:'.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding:40, textAlign:'center', color:C.textMuted }}>No users found</td></tr>
                  ) : users.map((u, i) => {
                    const activity = getActivity(u)
                    return (
                      <tr key={u._id} className="u-row" onClick={() => setSelected(selected?._id===u._id ? null : u)}
                        style={{ borderBottom:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', animation:`fadeIn .3s ease ${i*30}ms both` }}>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, background:`linear-gradient(135deg,${C.purple},${C.cyan})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem', color:'#fff', fontWeight:800, flexShrink:0 }}>{u.name?.[0]?.toUpperCase()}</div>
                            <div>
                              <div style={{ fontSize:'.84rem', fontWeight:700, color:C.text }}>{u.name}</div>
                              <div style={{ fontSize:'.68rem', color:C.textMuted }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'12px 14px' }}><span style={{ fontSize:'.82rem', fontWeight:800, color:C.blue }}>{u.storeCount||0}</span></td>
                        <td style={{ padding:'12px 14px' }}><span style={{ fontSize:'.82rem', fontWeight:800, color:C.purple }}>{u.productCount||0}</span></td>
                        <td style={{ padding:'12px 14px' }}><span style={{ fontSize:'.82rem', fontWeight:800, color:C.green }}>{u.totalViews||0}</span></td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ fontSize:'.68rem', fontWeight:700, color:activity.color, background:`${activity.color}12`, padding:'2px 8px', borderRadius:20 }}>{activity.label}</span>
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ fontSize:'.68rem', fontWeight:700, color:u.isActive?C.green:C.red, background:u.isActive?`${C.green}12`:`${C.red}12`, padding:'2px 8px', borderRadius:20 }}>
                            {u.isActive?'Active':'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:'.75rem', color:C.textMuted }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding:'12px 14px' }} onClick={e => e.stopPropagation()}>
                          <div style={{ display:'flex', gap:5 }}>
                            <Link href={`/admin/users/${u._id}`} className="act-btn" style={{ padding:'5px 10px', background:`${C.purple}15`, border:`1px solid ${C.purple}25`, borderRadius:7, color:C.purpleLight, fontSize:'.7rem', fontWeight:700, textDecoration:'none' }}>View</Link>
                            <button onClick={() => toggleActive(u._id,u.isActive)} disabled={toggling===u._id} className="act-btn" style={{ padding:'5px 10px', borderRadius:7, fontSize:'.7rem', fontWeight:700, border:'none', background:u.isActive?`${C.red}12`:`${C.green}12`, color:u.isActive?C.red:C.green }}>
                              {toggling===u._id?'...':u.isActive?'Deactivate':'Activate'}
                            </button>
                            <button onClick={() => deleteUser(u._id)} disabled={deleting===u._id} className="act-btn" style={{ padding:'5px 8px', borderRadius:7, fontSize:'.7rem', border:'none', background:`${C.red}10`, color:C.red }}>
                              {deleting===u._id?'...':'🗑'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── SIDE DETAIL PANEL ── */}
          {selected && (
            <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:22, position:'sticky', top:20, animation:'slideRight .25s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <h3 style={{ fontSize:'.92rem', fontWeight:800, color:C.text }}>User Details</h3>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:C.textMuted, cursor:'pointer', fontSize:'1.1rem' }}>✕</button>
              </div>

              {/* Avatar + name */}
              <div style={{ textAlign:'center', marginBottom:18 }}>
                <div style={{ width:56, height:56, background:`linear-gradient(135deg,${C.purple},${C.cyan})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', color:'#fff', fontWeight:800, margin:'0 auto 10px', boxShadow:`0 0 20px ${C.purple}40` }}>
                  {selected.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ fontWeight:800, color:C.text, fontSize:'.95rem' }}>{selected.name}</div>
                <div style={{ fontSize:'.75rem', color:C.textMuted, marginTop:2 }}>{selected.email}</div>
              </div>

              {/* Activity stats */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                {[
                  { label:'Stores',   value:selected.storeCount||0,   color:C.blue,   icon:'🏪' },
                  { label:'Products', value:selected.productCount||0, color:C.purple, icon:'📦' },
                  { label:'Views',    value:selected.totalViews||0,   color:C.green,  icon:'👁' },
                  { label:'Leads',    value:selected.totalLeads||0,   color:C.amber,  icon:'📋' },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} style={{ background:C.card2, borderRadius:10, padding:'10px', textAlign:'center', border:`1px solid ${color}15` }}>
                    <div style={{ fontSize:'.9rem', marginBottom:3 }}>{icon}</div>
                    <div style={{ fontSize:'1.2rem', fontWeight:900, color }}>{value}</div>
                    <div style={{ fontSize:'.65rem', color:C.textMuted, fontWeight:600 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Info rows */}
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
                {[
                  { label:'Status',   value:selected.isActive?'Active':'Inactive', color:selected.isActive?C.green:C.red },
                  { label:'Verified', value:selected.isVerified?'Yes':'Pending',   color:selected.isVerified?C.green:C.amber },
                  { label:'Plan',     value:getPlan(selected.storeCount).label,    color:getPlan(selected.storeCount).color },
                  { label:'Role',     value:selected.role?.toUpperCase(),          color:C.purple },
                  { label:'Joined',   value:new Date(selected.createdAt).toLocaleDateString(), color:C.textMuted },
                  { label:'Last Login', value:selected.lastLogin ? new Date(selected.lastLogin).toLocaleDateString() : 'Never', color:C.textMuted },
                  { label:'Login Count', value:selected.loginCount||0, color:C.text },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background:C.card2, borderRadius:8, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:'.75rem', color:C.textMuted, fontWeight:600 }}>{label}</span>
                    <span style={{ fontSize:'.78rem', fontWeight:800, color }}>{String(value)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <Link href={`/admin/users/${selected._id}`} className="act-btn" style={{ display:'block', textAlign:'center', padding:'10px', background:`${C.purple}15`, border:`1px solid ${C.purple}30`, borderRadius:10, color:C.purpleLight, fontSize:'.82rem', fontWeight:700, textDecoration:'none' }}>
                  👁 View Full Profile
                </Link>
                <button onClick={() => toggleActive(selected._id, selected.isActive)} disabled={toggling===selected._id} className="act-btn" style={{
                  padding:'10px', borderRadius:10, fontSize:'.82rem', fontWeight:700, border:'none', cursor:'pointer',
                  background:selected.isActive?`${C.red}12`:`${C.green}12`,
                  color:selected.isActive?C.red:C.green,
                }}>{toggling===selected._id?'...':(selected.isActive?'⏸ Deactivate User':'▶ Activate User')}</button>
                <button onClick={() => deleteUser(selected._id)} disabled={deleting===selected._id} className="act-btn" style={{
                  padding:'10px', borderRadius:10, fontSize:'.82rem', fontWeight:700, border:`1px solid ${C.red}25`, cursor:'pointer',
                  background:`${C.red}10`, color:C.red,
                }}>{deleting===selected._id?'Deleting...':'🗑 Delete User & All Data'}</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="act-btn" style={{ padding:'8px 14px', borderRadius:8, fontSize:'.8rem', fontWeight:700, background:C.card, border:`1px solid ${C.border}`, color:C.textMuted, cursor:'pointer' }}>← Prev</button>
          {Array.from({ length: Math.min(pages,7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className="act-btn" style={{
              width:36, height:36, borderRadius:8, fontSize:'.82rem', fontWeight:700, cursor:'pointer',
              background: page===p ? C.purple : C.card,
              border: `1px solid ${page===p ? C.purple : C.border}`,
              color: page===p ? '#fff' : C.textMuted,
            }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="act-btn" style={{ padding:'8px 14px', borderRadius:8, fontSize:'.8rem', fontWeight:700, background:C.card, border:`1px solid ${C.border}`, color:C.textMuted, cursor:'pointer' }}>Next →</button>
        </div>
      )}
    </div>
  )
}
