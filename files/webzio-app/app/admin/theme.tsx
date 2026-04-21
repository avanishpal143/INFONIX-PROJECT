'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx { theme: Theme; toggle: () => void; C: typeof DARK }

const DARK = {
  bg: '#060B18', bg2: '#0D1526', sidebar: '#0A1020',
  card: '#0F1A2E', card2: '#162035', cardBorder: 'rgba(99,102,241,0.15)',
  purple: '#6366F1', purpleLight: '#818CF8', purpleDim: 'rgba(99,102,241,0.12)',
  cyan: '#22D3EE', green: '#22C55E', red: '#EF4444', amber: '#F59E0B', blue: '#3B82F6', pink: '#EC4899',
  text: '#F1F5F9', textMuted: '#64748B', textSub: '#94A3B8',
  border: 'rgba(99,102,241,0.12)', borderHover: 'rgba(99,102,241,0.35)',
  topbar: 'rgba(10,16,32,0.85)',
  shadow: '0 4px 24px rgba(0,0,0,0.4)',
  glow: '0 0 20px rgba(99,102,241,0.3)',
}

const LIGHT = {
  bg: '#F8FAFF', bg2: '#EEF2FF', sidebar: '#FFFFFF',
  card: '#FFFFFF', card2: '#F1F5F9', cardBorder: 'rgba(99,102,241,0.15)',
  purple: '#4F46E5', purpleLight: '#6366F1', purpleDim: 'rgba(79,70,229,0.08)',
  cyan: '#0891B2', green: '#16A34A', red: '#DC2626', amber: '#D97706', blue: '#2563EB', pink: '#DB2777',
  text: '#0F172A', textMuted: '#64748B', textSub: '#94A3B8',
  border: 'rgba(99,102,241,0.12)', borderHover: 'rgba(99,102,241,0.35)',
  topbar: 'rgba(255,255,255,0.9)',
  shadow: '0 4px 24px rgba(0,0,0,0.08)',
  glow: '0 0 20px rgba(99,102,241,0.15)',
}

const Ctx = createContext<ThemeCtx>({ theme: 'dark', toggle: () => {}, C: DARK })

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') as Theme
    if (saved) setTheme(saved)
  }, [])
  const toggle = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('admin-theme', next)
      return next
    })
  }
  const C = theme === 'dark' ? DARK : LIGHT
  return <Ctx.Provider value={{ theme, toggle, C }}>{children}</Ctx.Provider>
}

export const useAdminTheme = () => useContext(Ctx)
export { DARK, LIGHT }
