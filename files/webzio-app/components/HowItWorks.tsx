'use client'
import Link from 'next/link'
import { useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Sign up & choose your template',
    desc: 'Create your free account in 30 seconds. Browse 70+ professional templates — restaurants, hotels, pharmacies, gyms and more. Pick the one that fits your business.',
    checks: ['No credit card required', '70+ templates to choose from', 'Takes less than 30 seconds'],
    accent: '#4f46e5', light: '#818cf8', bg: '#eef2ff',
    visual: 'templates',
  },
  {
    num: '02',
    title: 'Add your menu, products & brand',
    desc: 'Upload your logo, pick brand colors, add menu items with photos and prices. Customize every section — hero text, about us, contact details, WhatsApp number.',
    checks: ['Add unlimited menu items & photos', 'Set your brand colors & logo', 'Average setup time: 4 minutes'],
    accent: '#16a34a', light: '#4ade80', bg: '#f0fdf4',
    visual: 'menu',
  },
  {
    num: '03',
    title: 'Share your link & get customers',
    desc: 'Your website is live instantly. Share on WhatsApp, Instagram bio, or Google Maps. Customers browse your menu and order directly — no app, no commission.',
    checks: ['Share on WhatsApp, Instagram & Google', 'Customers order directly to you', 'First order usually within 24 hours'],
    accent: '#9333ea', light: '#c084fc', bg: '#fdf4ff',
    visual: 'share',
  },
]

function TemplatesVisual({ accent }: { accent: string }) {
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
      <div style={{ background: '#f8faff', borderRadius: 14, padding: 18, border: `1px solid ${accent}18` }}>
        <div style={{ fontSize: '.6rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Choose a template</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
          {tpls.map((t, i) => (
            <div key={i} style={{ borderRadius: 9, overflow: 'hidden', border: i === 0 ? `2px solid ${accent}` : '1px solid #e5e7eb' }}>
              <div style={{ height: 44, background: t.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{t.i}</div>
              <div style={{ padding: '4px 5px', background: '#f9fafb', fontSize: '.54rem', fontWeight: 700, color: '#6b7280', textAlign: 'center' }}>{t.n}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: `${accent}08`, borderRadius: 10, padding: '11px 14px', border: `1px solid ${accent}18`, display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: '1rem' }}>⏱</span>
        <div>
          <div style={{ fontSize: '.74rem', fontWeight: 700, color: '#374151' }}>Average time: 30 seconds</div>
          <div style={{ fontSize: '.63rem', color: '#6b7280' }}>Just sign up and pick a template</div>
        </div>
      </div>
    </div>
  )
}

function MenuVisual({ accent }: { accent: string }) {
  const items = [
    { name: 'Grilled Salmon', price: '₹850', badge: '🔥 Popular', img: '🐟' },
    { name: 'Truffle Pasta', price: '₹720', badge: '', img: '🍝' },
    { name: 'Wagyu Steak', price: '₹2,400', badge: "⭐ Chef's Pick", img: '🥩' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', background: '#f9fafb', borderRadius: 11, border: `1px solid ${accent}14` }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: `${accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{item.img}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: '#111' }}>{item.name}</div>
            {item.badge && <div style={{ fontSize: '.62rem', color: '#f97316', fontWeight: 700 }}>{item.badge}</div>}
          </div>
          <div style={{ fontWeight: 800, color: accent, fontSize: '.88rem' }}>{item.price}</div>
        </div>
      ))}
      <div style={{ padding: '11px 14px', background: `${accent}08`, borderRadius: 10, border: `1px solid ${accent}18`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>⏱</span>
        <span style={{ fontSize: '.74rem', color: accent, fontWeight: 700 }}>Average setup: 4 minutes</span>
      </div>
    </div>
  )
}

function ShareVisual({ accent }: { accent: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      <div style={{ background: '#f9fafb', borderRadius: 14, padding: 16, border: `1px solid ${accent}12` }}>
        <div style={{ fontSize: '.6rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 9 }}>Share your store link</div>
        <div style={{ background: '#fff', borderRadius: 9, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '.68rem', color: accent }}>🔗</span>
          <span style={{ fontSize: '.68rem', color: '#6b7280', fontFamily: 'monospace' }}>yourstore.webrazeo.com</span>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {[{ icon: '📲', label: 'WhatsApp', color: '#25D366' }, { icon: '📸', label: 'Instagram', color: '#e1306c' }, { icon: '🗺️', label: 'Google Maps', color: '#4285f4' }].map(s => (
            <div key={s.label} style={{ flex: 1, padding: '9px 5px', background: `${s.color}10`, borderRadius: 9, textAlign: 'center', border: `1px solid ${s.color}20` }}>
              <div style={{ fontSize: '1rem', marginBottom: 3 }}>{s.icon}</div>
              <div style={{ fontSize: '.56rem', fontWeight: 700, color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
        {[{ label: 'Zero Commission', icon: '💰' }, { label: 'Direct to WhatsApp', icon: '💬' }, { label: 'No App Needed', icon: '📱' }, { label: 'Always Online', icon: '🌐' }].map(f => (
          <div key={f.label} style={{ padding: '9px 11px', background: '#f9fafb', borderRadius: 9, border: `1px solid ${accent}10`, display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: '.85rem' }}>{f.icon}</span>
            <span style={{ fontSize: '.65rem', fontWeight: 700, color: '#374151' }}>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const s = STEPS[active]

  const prev = () => setActive(a => Math.max(0, a - 1))
  const next = () => setActive(a => Math.min(STEPS.length - 1, a + 1))

  return (
    <section id="how" style={{ padding: '80px 6%', background: s.bg, transition: 'background .4s ease' }}>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        .hiw-card { animation: slideUp .4s cubic-bezier(.34,1.4,.64,1) both; }
        .nav-btn { transition: all .2s ease; cursor: pointer; }
        .nav-btn:hover { transform: scale(1.08); }
        .nav-btn:disabled { opacity: .35; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 50, background: '#eef2ff', border: '1px solid #c7d2fe', fontSize: '.68rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>
          How it works
        </div>
        <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, color: '#111', fontFamily: '"Playfair Display",serif', lineHeight: 1.15, marginBottom: 8 }}>
          From zero to live website in{' '}
          <span style={{ background: 'linear-gradient(135deg,#4f46e5,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            3 simple steps
          </span>
        </h2>
        <p style={{ color: '#6b7280', fontSize: '.9rem' }}>No tech skills. No designer. No hosting setup.</p>
      </div>

      {/* Step tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {STEPS.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setActive(i)}
              className="nav-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 50, border: 'none',
                background: active === i ? `linear-gradient(135deg,${st.accent},${st.light})` : '#fff',
                boxShadow: active === i ? `0 4px 16px ${st.accent}35` : '0 1px 4px rgba(0,0,0,.08)',
                color: active === i ? '#fff' : '#6b7280',
                fontWeight: 700, fontSize: '.8rem',
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: active === i ? 'rgba(255,255,255,.25)' : `${st.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', fontWeight: 900, color: active === i ? '#fff' : st.accent, flexShrink: 0 }}>
                {st.num}
              </span>
              {i === 0 ? 'Sign Up' : i === 1 ? 'Customize' : 'Go Live'}
            </button>
            {i < 2 && (
              <div style={{ width: 32, height: 2, borderRadius: 1, background: active > i ? `linear-gradient(90deg,${STEPS[i].accent},${STEPS[i+1].accent})` : '#e5e7eb', transition: 'background .4s' }} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto' }}>
        <div
          key={active}
          className="hiw-card"
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44, alignItems: 'center',
            background: '#fff', borderRadius: 22, padding: '40px 48px',
            boxShadow: `0 16px 48px ${s.accent}14, 0 2px 12px rgba(0,0,0,.05)`,
            border: `1px solid ${s.accent}18`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${s.accent},${s.light})` }} />

          {/* LEFT */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: `${s.accent}10`, border: `1px solid ${s.accent}28`, padding: '5px 12px', borderRadius: 50, marginBottom: 16 }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: `linear-gradient(135deg,${s.accent},${s.light})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.62rem', fontWeight: 900, color: '#fff' }}>{s.num}</span>
              <span style={{ fontSize: '.68rem', fontWeight: 800, color: s.accent, letterSpacing: '.05em' }}>STEP {s.num}</span>
            </div>
            <h3 style={{ fontSize: 'clamp(1.2rem,2vw,1.65rem)', fontWeight: 900, color: '#111', fontFamily: '"Playfair Display",serif', lineHeight: 1.25, marginBottom: 12 }}>{s.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '.88rem', lineHeight: 1.85, marginBottom: 18 }}>{s.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: active === 2 ? 20 : 0 }}>
              {s.checks.map(c => (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.82rem', color: '#374151' }}>
                  <span style={{ width: 17, height: 17, borderRadius: '50%', background: `${s.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.55rem', color: s.accent, fontWeight: 900, flexShrink: 0 }}>✓</span>
                  {c}
                </div>
              ))}
            </div>
            {active === 2 && (
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: `linear-gradient(135deg,${s.accent},${s.light})`, color: '#fff', borderRadius: 11, textDecoration: 'none', fontWeight: 700, fontSize: '.86rem', boxShadow: `0 6px 20px ${s.accent}30`, marginTop: 4 }}>
                🚀 Start for Free — No Card Needed
              </Link>
            )}
          </div>

          {/* RIGHT */}
          <div>
            {s.visual === 'templates' && <TemplatesVisual accent={s.accent} />}
            {s.visual === 'menu'      && <MenuVisual      accent={s.accent} />}
            {s.visual === 'share'     && <ShareVisual     accent={s.accent} />}
          </div>
        </div>

        {/* ← → Navigation buttons */}
        <button
          onClick={prev}
          disabled={active === 0}
          className="nav-btn"
          style={{
            position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%', border: 'none',
            background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', color: '#374151',
          }}
        >
          ←
        </button>
        <button
          onClick={next}
          disabled={active === STEPS.length - 1}
          className="nav-btn"
          style={{
            position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 44, borderRadius: '50%', border: 'none',
            background: `linear-gradient(135deg,${s.accent},${s.light})`,
            boxShadow: `0 4px 16px ${s.accent}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', color: '#fff',
          }}
        >
          →
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {STEPS.map((st, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="nav-btn"
            style={{
              width: active === i ? 28 : 8, height: 8, borderRadius: 4, border: 'none',
              background: active === i ? `linear-gradient(90deg,${st.accent},${st.light})` : '#d1d5db',
              transition: 'all .3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  )
}
