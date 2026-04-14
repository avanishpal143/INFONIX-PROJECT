'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '📊', path: '/admin' },
  { label: 'Users', icon: '👥', path: '/admin/users' },
  { label: 'Stores', icon: '🏪', path: '/admin/stores' },
  { label: 'Templates', icon: '🎨', path: '/admin/templates' },
  { label: 'Categories', icon: '📁', path: '/admin/categories' },
  { label: 'Portfolio', icon: '🖼️', path: '/admin/portfolio' },
  { label: 'Reports', icon: '📈', path: '/admin/reports' },
]

const C = {
  bg: '#0A0F1E',
  sidebar: '#0F172A',
  purple: '#7C3AED',
  cyan: '#22D3EE',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  border: 'rgba(124, 58, 237, 0.15)',
  cardBg: '#1E293B',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  // Check if user is admin/superadmin, redirect to login if not
  useEffect(() => {
    if (pathname !== '/admin/login' && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
      router.push('/admin/login')
    }
  }, [user, pathname, router])

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = () => { logout(); router.push('/admin/login') }

  const sideW = collapsed ? 72 : 260

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: sideW, minHeight: '100vh', background: `linear-gradient(180deg, ${C.sidebar} 0%, ${C.bg} 100%)`,
        borderRight: `1px solid ${C.border}`, position: 'fixed', top: 0, bottom: 0, left: 0,
        display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '24px 16px' : '28px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, minWidth: 38, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: `0 0 20px ${C.purple}60` }}>⚡</div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>Super<span style={{ color: C.purple }}>Admin</span></div>
              <div style={{ fontSize: '0.65rem', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Master Control</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
            return (
              <Link key={item.path} href={item.path} title={collapsed ? item.label : ''} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px' : '11px 14px',
                borderRadius: 10, textDecoration: 'none',
                background: isActive ? `linear-gradient(135deg, ${C.purple}30, ${C.cyan}10)` : 'transparent',
                border: `1px solid ${isActive ? C.purple + '50' : 'transparent'}`,
                color: isActive ? C.cyan : C.textMuted,
                fontWeight: isActive ? 700 : 500, fontSize: '0.88rem',
                transition: 'all 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                boxShadow: isActive ? `0 4px 12px ${C.purple}30` : 'none',
              }}>
                <span style={{ fontSize: '1.15rem', minWidth: 20, textAlign: 'center' }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.cyan, boxShadow: `0 0 8px ${C.cyan}` }} />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: `1px solid ${C.border}` }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: `${C.purple}10`, borderRadius: 10, border: `1px solid ${C.purple}20`, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, minWidth: 36, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Super Admin'}</div>
                <div style={{ fontSize: '0.65rem', color: C.purple, fontWeight: 700 }}>MASTER CONTROL</div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: C.textMuted, fontSize: '1rem', cursor: 'pointer', marginBottom: 8, transition: 'all 0.2s' }}>
            {collapsed ? '→' : '← Collapse'}
          </button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, color: '#F87171', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {collapsed ? '🚪' : '🚪 Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: sideW, flex: 1, minHeight: '100vh', background: C.bg, transition: 'margin-left 0.3s ease' }}>
        {/* Topbar */}
        <div style={{ padding: '20px 40px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${C.sidebar}CC`, backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '4px 12px', background: `${C.purple}20`, border: `1px solid ${C.purple}40`, borderRadius: 20, fontSize: '0.72rem', fontWeight: 800, color: C.cyan, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ⚡ Super Admin
            </div>
            <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>Master Control Panel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.6)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.78rem', color: C.textMuted, fontWeight: 600 }}>System Online</span>
            <Link href="/dashboard" style={{ padding: '8px 16px', background: `${C.cyan}20`, border: `1px solid ${C.cyan}40`, borderRadius: 8, color: C.cyan, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              → User Panel
            </Link>
          </div>
        </div>
        <div style={{ padding: '32px 40px' }}>
          {children}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.purple}50; border-radius: 3px; }
      `}</style>
    </div>
  )
}
