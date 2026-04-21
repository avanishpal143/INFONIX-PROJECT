'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    num: '01', label: 'FIRST STEP',
    title: 'Sign up & choose your template',
    desc: 'Create your free account in 30 seconds. Browse 70+ professional templates — restaurants, hotels, pharmacies, gyms and more.',
    checks: ['No credit card required', '70+ templates to choose from', 'Takes less than 30 seconds'],
    bg: '#1a1740',
    cardBg: 'linear-gradient(135deg,#1e1b4b,#2d2a6e)',
    border: 'rgba(99,102,241,.3)',
    accent: '#6366f1', light: '#818cf8',
    glow: 'rgba(99,102,241,.4)',
    visual: 'templates',
  },
  {
    num: '02', label: 'SECOND STEP',
    title: 'Add your menu, products & brand',
    desc: 'Upload your logo, pick brand colors, add menu items with photos and prices. Customize every section in minutes.',
    checks: ['Add unlimited menu items & photos', 'Set your brand colors & logo', 'Average setup time: 4 minutes'],
    bg: '#0a1f0a',
    cardBg: 'linear-gradient(135deg,#052e16,#166534)',
    border: 'rgba(34,197,94,.25)',
    accent: '#16a34a', light: '#4ade80',
    glow: 'rgba(34,197,94,.35)',
    visual: 'menu',
  },
  {
    num: '03', label: 'FINAL STEP',
    title: 'Share your link & get customers',
    desc: 'Your website is live instantly. Share on WhatsApp, Instagram bio, or Google Maps. Customers order directly — no app, no commission.',
    checks: ['Share on WhatsApp, Instagram & Google', 'Customers order directly to you', 'First order usually within 24 hours'],
    bg: '#1a0a2e',
    cardBg: 'linear-gradient(135deg,#1a0a2e,#4c1d95)',
    border: 'rgba(236,72,153,.25)',
    accent: '#be185d', light: '#f9a8d4',
    glow: 'rgba(236,72,153,.35)',
    visual: 'share',
  },
]

function TemplatesVisual({ light }: { light: string }) {
  const tpls = [
    { c: 'linear-gradient(135deg,#c2410c,#ea580c)', i: '🍴', n: 'Restaurant' },
    { c: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', i: '🏨', n: 'Hotel' },
    { c: 'linear-gradient(135deg,#0f766e,#14b8a6)', i: '💊', n: 'Pharmacy' },
    { c: 'linear-gradient(135deg,#dc2626,#f97316)', i: '💪', n: 'Gym' },
    { c: 'linear-gradient(135deg,#9d174d,#ec4899)', i: '💅', n: 'Salon' },
    { c: 'linear-gradient(135deg,#4f46e5,#7c3aed)', i: '🚀', n: 'Startup' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontSize: '.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Choose a template</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {tpls.map((t, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: i === 0 ? `2px solid ${light}` : '1px solid rgba(255,255,255,.06)' }}>
              <div style={{ height: 48, background: t.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{t.i}</div>
              <div style={{ padding: '5px 6px', background: 'rgba(255,255,255,.04)', fontSize: '.56rem', fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{t.n}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(99,102,241,.12)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(99,102,241,.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1rem' }}>⏱</span>
        <div>
          <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#c7d2fe' }}>Average time</div>
          <div style={{ fontSize: '.65rem', color: '#64748b' }}>Less than 30 seconds to sign up</div>
        </div>
      </div>
    </div>
  )
}

function MenuVisual({ light }: { light: string }) {
  const items = [
    { name: 'Grilled Salmon', price: '₹850', badge: '🔥 Popular', img: '🐟' },
    { name: 'Truffle Pasta', price: '₹720', badge: '', img: '🍝' },
    { name: 'Wagyu Steak', price: '₹2,400', badge: "⭐ Chef's Pick", img: '🥩' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,.05)', borderRadius: 12, border: '1px solid rgba(34,197,94,.15)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{item.img}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '.84rem', fontWeight: 700, color: '#fff' }}>{item.name}</div>
            {item.badge && <div style={{ fontSize: '.65rem', color: '#f97316', fontWeight: 700 }}>{item.badge}</div>}
          </div>
          <div style={{ fontWeight: 800, color: light, fontSize: '.9rem' }}>{item.price}</div>
        </div>
      ))}
      <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,.1)', borderRadius: 12, border: '1px solid rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>⏱</span>
        <span style={{ fontSize: '.75rem', color: light, fontWeight: 700 }}>Average setup: 4 minutes</span>
      </div>
    </div>
  )
}

function ShareVisual({ light }: { light: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 16, padding: 18, border: '1px solid rgba(236,72,153,.12)' }}>
        <div style={{ fontSize: '.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Share your store link</div>
        <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: '.7rem', color: light }}>🔗</span>
          <span style={{ fontSize: '.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>yourstore.hospitalitycore.com</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ icon: '📲', label: 'WhatsApp', color: '#25D366' }, { icon: '📸', label: 'Instagram', color: '#e1306c' }, { icon: '🗺️', label: 'Google Maps', color: '#4285f4' }].map(s => (
            <div key={s.label} style={{ flex: 1, padding: '10px 6px', background: `${s.color}15`, borderRadius: 10, textAlign: 'center', border: `1px solid ${s.color}25` }}>
              <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '.58rem', fontWeight: 700, color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[{ label: 'Zero Commission', icon: '💰' }, { label: 'Direct to WhatsApp', icon: '💬' }, { label: 'No App Needed', icon: '📱' }, { label: 'Always Online', icon: '🌐' }].map(f => (
          <div key={f.label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,.04)', borderRadius: 10, border: '1px solid rgba(236,72,153,.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '.9rem' }}>{f.icon}</span>
            <span style={{ fontSize: '.68rem', fontWeight: 700, color: '#94a3b8' }}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const outerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const totalScroll = el.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const pct = totalScroll > 0 ? Math.min(1, scrolled / totalScroll) : 0
      const idx = pct < 0.34 ? 0 : pct < 0.67 ? 1 : 2
      setActive(idx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const s = STEPS[active]

  return (
    /* 300vh outer — gives scroll room */
    <div id="how" ref={outerRef} style={{ height: '200vh', position: 'relative', background: '#07070f' }}>

      {/* Sticky inner — stays in viewport */}
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        background: s.bg,
        transition: 'background .6s ease',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <style>{`
          @keyframes cardIn {
            from { opacity:0; transform:translateY(40px) scale(.97); }
            to   { opacity:1; transform:translateY(0)    scale(1);   }
          }
          .hiw-in { animation: cardIn .45s cubic-bezier(.34,1.4,.64,1) both; }
        `}</style>

        {/* Glow blob */}
        <div style={{ position: 'absolute', width: 400, height: 400, background: `radial-gradient(circle,${s.glow},transparent 70%)`, borderRadius: '50%', top: '-10%', right: '-5%', pointerEvents: 'none', transition: 'background .6s ease' }} />

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', padding: '32px 6% 16px', flexShrink: 0, position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 50, background: 'rgba(99,102,241,.15)', border: '1px solid rgba(99,102,241,.3)', fontSize: '.68rem', fontWeight: 800, color: '#818cf8', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            How it works
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem,2.8vw,2.2rem)', fontWeight: 900, color: '#fff', fontFamily: '"Playfair Display",serif', lineHeight: 1.2, marginBottom: 14 }}>
            From zero to live website in{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              3 simple steps
            </span>
          </h2>

          {/* Step pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {STEPS.map((st, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 50, background: active === i ? `${st.accent}22` : 'rgba(255,255,255,.05)', border: `1px solid ${active === i ? st.accent + '55' : 'rgba(255,255,255,.1)'}`, transition: 'all .4s ease', cursor: 'default' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: active === i ? `linear-gradient(135deg,${st.accent},${st.light})` : 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 900, color: '#fff', transition: 'all .4s' }}>{st.num}</div>
                  <span style={{ fontSize: '.68rem', fontWeight: 700, color: active === i ? st.light : '#475569', transition: 'color .4s' }}>{st.label}</span>
                </div>
                {i < 2 && <div style={{ width: 18, height: 1, background: 'rgba(255,255,255,.08)' }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Card ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5%', position: 'relative', zIndex: 2 }}>
          <div
            key={active}
            className="hiw-in"
            style={{ width: '100%', maxWidth: 1040, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', background: s.cardBg, borderRadius: 24, padding: '44px 52px', boxShadow: '0 32px 80px rgba(0,0,0,.55)', border: `1px solid ${s.border}`, position: 'relative', overflow: 'hidden' }}
          >
            {/* Inner glow */}
            <div style={{ position: 'absolute', width: 240, height: 240, background: `radial-gradient(circle,${s.glow},transparent 70%)`, borderRadius: '50%', top: '-15%', right: '-8%', pointerEvents: 'none' }} />

            {/* LEFT */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${s.accent}18`, border: `1px solid ${s.accent}40`, padding: '5px 13px', borderRadius: 50, marginBottom: 18 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg,${s.accent},${s.light})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.62rem', fontWeight: 900, color: '#fff' }}>{s.num}</span>
                <span style={{ fontSize: '.68rem', fontWeight: 800, color: s.light, letterSpacing: '.06em' }}>{s.label}</span>
              </div>
              <h3 style={{ fontSize: 'clamp(1.3rem,2vw,1.75rem)', fontWeight: 900, color: '#fff', fontFamily: '"Playfair Display",serif', lineHeight: 1.2, marginBottom: 14 }}>{s.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '.88rem', lineHeight: 1.85, marginBottom: 20 }}>{s.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: active === 2 ? 22 : 0 }}>
                {s.checks.map(c => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.82rem', color: '#cbd5e1' }}>
                    <span style={{ width: 17, height: 17, borderRadius: '50%', background: `${s.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.56rem', color: s.light, fontWeight: 900, flexShrink: 0 }}>✓</span>
                    {c}
                  </div>
                ))}
              </div>
              {active === 2 && (
                <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: `linear-gradient(135deg,${s.accent},${s.light})`, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '.88rem', boxShadow: `0 8px 24px ${s.accent}45`, marginTop: 4 }}>
                  🚀 Start for Free — No Card Needed
                </Link>
              )}
            </div>

            {/* RIGHT */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {s.visual === 'templates' && <TemplatesVisual light={s.light} />}
              {s.visual === 'menu'      && <MenuVisual      light={s.light} />}
              {s.visual === 'share'     && <ShareVisual     light={s.light} />}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        {active < 2 && (
          <div style={{ textAlign: 'center', paddingBottom: 14, flexShrink: 0, position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '.68rem', color: '#334155', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ animation: 'floatY 1.5s ease-in-out infinite', display: 'inline-block' }}>↓</span>
              Scroll to see step {active + 2}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
