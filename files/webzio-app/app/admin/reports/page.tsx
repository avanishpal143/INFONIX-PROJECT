'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'

const C = {
  purple: '#8B5CF6', teal: '#14B8A6', blue: '#3B82F6', amber: '#F59E0B',
  card: '#0F172A', cardBorder: 'rgba(139,92,246,0.12)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444',
}

function BarChart({ data, color, label }: { data: any[]; color: string; label: string }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.textMuted, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: '0.6rem', color: C.textMuted, fontWeight: 700, opacity: d.count ? 1 : 0 }}>{d.count}</div>
            <div style={{ width: '100%', background: `${color}20`, borderRadius: '4px 4px 0 0', overflow: 'hidden', height: 60, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', background: `linear-gradient(to top, ${color}, ${color}80)`, borderRadius: '4px 4px 0 0', height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 0, transition: 'height 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
            </div>
            <div style={{ fontSize: '0.55rem', color: C.textMuted, transform: 'rotate(-45deg)', transformOrigin: 'center', width: 20, textAlign: 'center' }}>{d._id?.slice(5)}</div>
          </div>
        ))}
        {!data.length && <div style={{ flex: 1, textAlign: 'center', color: C.textMuted, fontSize: '0.8rem', paddingBottom: 20 }}>No data for this range</div>}
      </div>
    </div>
  )
}

export default function AdminReportsPage() {
  const { token } = useAuthStore()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/reports?range=${range}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setData(d) })
      .finally(() => setLoading(false))
  }, [range, token])

  const s = data?.summary || {}

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text }}>📈 Reports & Analytics</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>Platform growth insights</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['7', '7 Days'], ['14', '14 Days'], ['30', '30 Days'], ['90', '90 Days']].map(([v, l]) => (
            <button key={v} onClick={() => setRange(v)} style={{
              padding: '9px 16px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
              background: range === v ? 'rgba(139,92,246,0.2)' : C.card,
              border: `1px solid ${range === v ? 'rgba(139,92,246,0.5)' : C.cardBorder}`,
              color: range === v ? '#A78BFA' : C.textMuted,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Users', value: s.totalUsers ?? '—', color: C.purple, icon: '👥' },
          { label: 'Total Stores', value: s.totalStores ?? '—', color: C.blue, icon: '🏪' },
          { label: 'Total Templates', value: s.totalTemplates ?? '—', color: C.amber, icon: '🎨' },
          { label: `New Users (${range}d)`, value: s.newUsersInRange ?? '—', color: C.green, icon: '👤' },
          { label: `New Stores (${range}d)`, value: s.newStoresInRange ?? '—', color: C.teal, icon: '🆕' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: C.card, border: `1px solid ${color}20`, borderRadius: 14, padding: '20px 18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color, marginBottom: 4 }}>{loading ? '—' : value}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* User Growth */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>👥 User Growth</h3>
          {loading ? <div style={{ color: C.textMuted }}>Loading...</div> : <BarChart data={data?.userGrowth || []} color={C.purple} label={`Daily new registrations (Last ${range} days)`} />}
        </div>

        {/* Store Creation Trends */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>🏪 Store Creation Trends</h3>
          {loading ? <div style={{ color: C.textMuted }}>Loading...</div> : <BarChart data={data?.storeGrowth || []} color={C.blue} label={`Daily store creations (Last ${range} days)`} />}
        </div>
      </div>

      {/* Template Usage */}
      <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>🎨 Template Usage Stats</h3>
        {loading ? <div style={{ color: C.textMuted }}>Loading...</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(data?.templateUsage || []).length === 0 && <p style={{ color: C.textMuted, fontSize: '0.85rem' }}>No template usage data yet.</p>}
            {(data?.templateUsage || []).map((item: any, i: number) => {
              const maxCount = Math.max(...(data?.templateUsage || []).map((t: any) => t.count), 1)
              const pct = Math.round((item.count / maxCount) * 100)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: C.textMuted, width: 50, textAlign: 'right' }}>#{item._id}</div>
                  <div style={{ flex: 1, height: 10, background: 'rgba(139,92,246,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${C.purple}, ${C.blue})`, borderRadius: 5, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: C.purple, width: 40 }}>{item.count}</div>
                  <div style={{ fontSize: '0.7rem', color: C.textMuted, width: 60 }}>stores</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
