'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'

function useCountUp(target: number, start: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start || !target) return
    let t0: number
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / 1200, 1)
      setVal(Math.floor(ease(p) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target])
  return val
}

function BarChart({ data, color, label }: { data: any[]; color: string; label: string }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 400); return () => clearTimeout(t) }, [data])
  const max = Math.max(...data.map(d => d.count), 1)
  if (!data.length) return <div style={{ textAlign:'center', padding:'24px 0', color:'#64748B', fontSize:'.82rem' }}>No data for this period</div>
  return (
    <div>
      <div style={{ fontSize:'.75rem', fontWeight:700, color:'#64748B', marginBottom:10 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:90 }}>
        {data.map((d,i) => (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            {d.count > 0 && <div style={{ fontSize:'.55rem', color:'#64748B', fontWeight:700 }}>{d.count}</div>}
            <div style={{ width:'100%', background:`${color}18`, borderRadius:'3px 3px 0 0', overflow:'hidden', height:70, display:'flex', alignItems:'flex-end' }}>
              <div style={{ width:'100%', background:`linear-gradient(to top,${color},${color}80)`, borderRadius:'3px 3px 0 0', height:ready?`${(d.count/max)*100}%`:'0%', minHeight:d.count&&ready?4:0, transition:`height 1s cubic-bezier(.34,1.56,.64,1) ${i*30}ms` }} />
            </div>
            <div style={{ fontSize:'.5rem', color:'#64748B', transform:'rotate(-45deg)', transformOrigin:'center', width:18, textAlign:'center', overflow:'hidden' }}>{d._id?.slice(5)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminReportsPage() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')
  const [countStart, setCountStart] = useState(false)

  useEffect(() => {
    setLoading(true)
    setCountStart(false)
    fetch(`/api/admin/reports?range=${range}`, { headers: { Authorization:`Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) { setData(d); setTimeout(() => setCountStart(true), 300) } })
      .finally(() => setLoading(false))
  }, [range, token])

  const s = data?.summary || {}
  const totalUsers = useCountUp(s.totalUsers ?? 0, countStart)
  const totalStores = useCountUp(s.totalStores ?? 0, countStart)
  const totalTemplates = useCountUp(s.totalTemplates ?? 0, countStart)
  const newUsers = useCountUp(s.newUsersInRange ?? 0, countStart)
  const newStores = useCountUp(s.newStoresInRange ?? 0, countStart)

  const summaryCards = [
    { label:'Total Users',       value:totalUsers,    color:C.purple, icon:'👥' },
    { label:'Total Stores',      value:totalStores,   color:C.blue,   icon:'🏪' },
    { label:'Total Templates',   value:totalTemplates,color:C.amber,  icon:'🎨' },
    { label:`New Users (${range}d)`,  value:newUsers,  color:C.green,  icon:'👤' },
    { label:`New Stores (${range}d)`, value:newStores, color:C.cyan,   icon:'🆕' },
  ]

  return (
    <div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, animation:'fadeIn .4s ease' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, color:C.text, letterSpacing:'-.02em' }}>📈 Reports & Analytics</h1>
          <p style={{ color:C.textMuted, fontSize:'.84rem', marginTop:4 }}>Real-time platform growth insights</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {[['7','7 Days'],['14','14 Days'],['30','30 Days'],['90','90 Days']].map(([v,l]) => (
            <button key={v} onClick={() => setRange(v)} style={{ padding:'9px 16px', borderRadius:10, fontSize:'.8rem', fontWeight:700, cursor:'pointer', background:range===v?`${C.purple}20`:C.card, border:`1px solid ${range===v?C.purple+'50':C.border}`, color:range===v?C.purpleLight:C.textMuted, transition:'all .2s' }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24, animation:'fadeIn .4s ease .1s both' }}>
        {summaryCards.map(({label,value,color,icon},i) => (
          <div key={label} style={{ background:C.card, border:`1px solid ${color}20`, borderRadius:14, padding:'18px 16px', position:'relative', overflow:'hidden', animation:`fadeIn .4s ease ${i*60}ms both` }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
            <div style={{ fontSize:'1.3rem', marginBottom:8 }}>{icon}</div>
            <div style={{ fontSize:'1.6rem', fontWeight:900, color, marginBottom:4 }}>{loading ? '—' : value.toLocaleString()}</div>
            <div style={{ fontSize:'.68rem', fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:24, animation:'fadeIn .4s ease .3s both' }}>
          <h3 style={{ fontSize:'.9rem', fontWeight:800, color:C.text, marginBottom:20 }}>👥 User Growth</h3>
          {loading ? <div style={{ color:C.textMuted }}>Loading...</div> : <BarChart data={data?.userGrowth||[]} color={C.purple} label={`Daily registrations — last ${range} days`} />}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:24, animation:'fadeIn .4s ease .4s both' }}>
          <h3 style={{ fontSize:'.9rem', fontWeight:800, color:C.text, marginBottom:20 }}>🏪 Store Creation Trends</h3>
          {loading ? <div style={{ color:C.textMuted }}>Loading...</div> : <BarChart data={data?.storeGrowth||[]} color={C.blue} label={`Daily store creations — last ${range} days`} />}
        </div>
      </div>

      {/* Template Usage */}
      <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:24, animation:'fadeIn .4s ease .5s both' }}>
        <h3 style={{ fontSize:'.9rem', fontWeight:800, color:C.text, marginBottom:20 }}>🎨 Template Usage Stats</h3>
        {loading ? <div style={{ color:C.textMuted }}>Loading...</div> : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {!(data?.templateUsage?.length) && <p style={{ color:C.textMuted, fontSize:'.84rem' }}>No template usage data yet.</p>}
            {(data?.templateUsage||[]).map((item:any, i:number) => {
              const maxCount = Math.max(...(data?.templateUsage||[]).map((t:any) => t.count), 1)
              const pct = Math.round((item.count/maxCount)*100)
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:14, animation:`fadeIn .3s ease ${i*40}ms both` }}>
                  <div style={{ fontSize:'.8rem', fontWeight:700, color:C.textMuted, width:60, textAlign:'right', flexShrink:0 }}>T-{item._id}</div>
                  <div style={{ flex:1, height:10, background:`${C.purple}15`, borderRadius:5, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.purple},${C.blue})`, borderRadius:5, transition:'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
                  </div>
                  <div style={{ fontSize:'.84rem', fontWeight:800, color:C.purple, width:36, flexShrink:0 }}>{item.count}</div>
                  <div style={{ fontSize:'.7rem', color:C.textMuted, width:50, flexShrink:0 }}>stores</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
