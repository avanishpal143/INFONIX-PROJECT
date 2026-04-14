'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import Link from 'next/link'

const C = {
  purple: '#8B5CF6', purpleLight: '#A78BFA', purpleDim: 'rgba(139,92,246,0.1)',
  purpleBorder: 'rgba(139,92,246,0.2)', card: '#0F172A', cardBorder: 'rgba(139,92,246,0.12)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444',
  blue: '#3B82F6', amber: '#F59E0B',
}

function StatCard({ label, value, icon, color, sub, loading }: any) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, background: `${color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: `1px solid ${color}25` }}>{icon}</div>
        {sub && <div style={{ fontSize: '0.72rem', fontWeight: 800, color, background: `${color}15`, padding: '4px 10px', borderRadius: 20, border: `1px solid ${color}25` }}>{sub}</div>}
      </div>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color: C.text }}>{loading ? <span style={{ color: C.textMuted }}>—</span> : value}</div>
    </div>
  )
}

function MiniBar({ data, color, label }: { data: any[], color: string, label: string }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.textMuted, marginBottom: 12 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
        {data.slice(-14).map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', background: `${color}20`, borderRadius: 3, overflow: 'hidden', height: 48, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', background: color, borderRadius: 3, height: `${(d.count / max) * 100}%`, minHeight: d.count ? 4 : 0, transition: 'height 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { token } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setStats(d) })
      .finally(() => setLoading(false))
  }, [token])

  const s = stats?.stats || {}

  const statCards = [
    { label: 'Total Users', value: s.totalUsers ?? 0, icon: '👥', color: C.purple, sub: `+${s.activeUsers ?? 0} active` },
    { label: 'Total Stores', value: s.totalStores ?? 0, icon: '🏪', color: C.blue, sub: `${s.activeStores ?? 0} enabled` },
    { label: 'Inactive Stores', value: s.inactiveStores ?? 0, icon: '⛔', color: C.red, sub: 'disabled' },
    { label: 'Templates', value: s.totalTemplates ?? 0, icon: '🎨', color: C.amber, sub: `${s.activeTemplates ?? 0} active` },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Master <span style={{ color: C.purple }}>Dashboard</span>
        </h1>
        <p style={{ color: C.textMuted, fontSize: '0.88rem' }}>Real-time control over your entire platform.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
        {statCards.map((c, i) => <StatCard key={i} {...c} loading={loading} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* User & Store Growth Charts */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>📈 Growth Overview (14 days)</h3>
          {loading ? <div style={{ color: C.textMuted }}>Loading...</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <MiniBar data={stats?.userGrowth || []} color={C.purple} label="User Registrations" />
              <MiniBar data={stats?.storeGrowth || []} color={C.blue} label="Store Creations" />
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text }}>⚡ Recent Activities</h3>
          </div>
          {loading ? <div style={{ color: C.textMuted }}>Loading...</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(stats?.recentActivities || []).slice(0, 7).map((a: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(139,92,246,0.04)', borderRadius: 10, border: '1px solid rgba(139,92,246,0.08)' }}>
                  <span style={{ fontSize: '1rem' }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text }}>{a.message}</div>
                    <div style={{ fontSize: '0.68rem', color: C.textMuted }}>{new Date(a.time).toLocaleString()}</div>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.type === 'user' ? C.purple : C.blue, boxShadow: `0 0 6px ${a.type === 'user' ? C.purple : C.blue}` }} />
                </div>
              ))}
              {(!stats?.recentActivities?.length) && <p style={{ color: C.textMuted, fontSize: '0.85rem' }}>No recent activities</p>}
            </div>
          )}
        </div>
      </div>

      {/* Quick Nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Manage Users', icon: '👥', path: '/admin/users', desc: 'View, activate or deactivate users', color: C.purple },
          { label: 'Manage Stores', icon: '🏪', path: '/admin/stores', desc: 'Enable, disable or delete stores', color: C.blue },
          { label: 'Templates', icon: '🎨', path: '/admin/templates', desc: 'Add & manage templates', color: C.amber },
          { label: 'Categories', icon: '📁', path: '/admin/categories', desc: 'Manage template categories', color: C.green },
          { label: 'Portfolio', icon: '🖼️', path: '/admin/portfolio', desc: 'Portfolio template section', color: '#EC4899' },
          { label: 'Reports', icon: '📈', path: '/admin/reports', desc: 'Analytics & growth reports', color: '#14B8A6' },
        ].map((item) => (
          <Link key={item.path} href={item.path} style={{ display: 'block', background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '20px 22px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: C.text }}>{item.label}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: C.textMuted, margin: 0 }}>{item.desc}</p>
            <div style={{ marginTop: 12, display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, color: item.color, background: `${item.color}15`, padding: '3px 10px', borderRadius: 20, border: `1px solid ${item.color}25` }}>Open →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
