'use client'
import { useState } from 'react'
import { useAdminTheme } from '../theme'

const GOOGLE_FONTS = ['Inter','Roboto','Open Sans','Lato','Montserrat','Poppins','Nunito','Raleway','Playfair Display','Merriweather','Lora','Source Serif Pro','DM Sans','Plus Jakarta Sans','Outfit','Syne','Space Grotesk']

const SECTION_LIST = [
  { key:'hero',        label:'Hero Section',   icon:'🦸', desc:'Main banner with CTA' },
  { key:'features',    label:'Features',       icon:'⚡', desc:'Key features grid' },
  { key:'services',    label:'Services',       icon:'🛠️', desc:'Services offered' },
  { key:'testimonials',label:'Testimonials',   icon:'💬', desc:'Customer reviews' },
  { key:'gallery',     label:'Gallery',        icon:'🖼️', desc:'Photo gallery' },
  { key:'faq',         label:'FAQ',            icon:'❓', desc:'Frequently asked questions' },
  { key:'contactForm', label:'Contact Form',   icon:'📬', desc:'Contact / enquiry form' },
  { key:'footer',      label:'Footer',         icon:'📄', desc:'Footer with links' },
]

interface BuilderProps {
  config: any
  onChange: (cfg: any) => void
}

export default function TemplateBuilder({ config: cfg, onChange }: BuilderProps) {
  const { C } = useAdminTheme()
  const [tab, setTab] = useState('typography')

  const set = (key: string, val: any) => onChange({ ...cfg, [key]: val })
  const setSection = (key: string, val: boolean) => onChange({ ...cfg, sections: { ...cfg.sections, [key]: val } })
  const setSocial = (key: string, val: string) => onChange({ ...cfg, socialLinks: { ...cfg.socialLinks, [key]: val } })

  const inp = { width:'100%', padding:'9px 12px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:'.83rem', outline:'none', fontFamily:'inherit' }
  const sel = { ...inp, cursor:'pointer' }
  const lbl = { display:'block' as const, fontSize:'.68rem', fontWeight:700 as const, color:C.textMuted, marginBottom:5, textTransform:'uppercase' as const, letterSpacing:'.05em' }

  const TABS = [
    { id:'typography', label:'🔤 Typography' },
    { id:'navbar',     label:'🧭 Navbar' },
    { id:'colors',     label:'🎨 Colors' },
    { id:'hero',       label:'🦸 Hero' },
    { id:'sections',   label:'📋 Sections' },
    { id:'footer',     label:'📄 Footer' },
    { id:'branding',   label:'🏷️ Branding' },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display:'flex', gap:4, marginBottom:20, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'7px 13px', borderRadius:8, fontSize:'.75rem', fontWeight:700, cursor:'pointer', border:`1px solid ${tab===t.id?C.purple+'60':C.border}`, background:tab===t.id?`${C.purple}20`:C.card2, color:tab===t.id?C.purpleLight:C.textMuted, transition:'all .15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TYPOGRAPHY ── */}
      {tab==='typography' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div>
            <label style={lbl}>Heading Font</label>
            <select style={sel} value={cfg.headingFont} onChange={e => set('headingFont', e.target.value)}>
              {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div style={{ marginTop:6, padding:'8px 12px', background:C.card2, borderRadius:8, fontFamily:`'${cfg.headingFont}',serif`, fontSize:'1rem', fontWeight:700, color:C.text }}>
              The quick brown fox
            </div>
          </div>
          <div>
            <label style={lbl}>Body Font</label>
            <select style={sel} value={cfg.bodyFont} onChange={e => set('bodyFont', e.target.value)}>
              {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <div style={{ marginTop:6, padding:'8px 12px', background:C.card2, borderRadius:8, fontFamily:`'${cfg.bodyFont}',sans-serif`, fontSize:'.85rem', color:C.textMuted }}>
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Base Font Size: {cfg.baseFontSize}px</label>
            <input type="range" min={12} max={20} step={1} value={cfg.baseFontSize} onChange={e => set('baseFontSize', Number(e.target.value))}
              style={{ width:'100%', accentColor:C.purple }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:C.textMuted, marginTop:3 }}>
              <span>12px (Small)</span><span>16px (Default)</span><span>20px (Large)</span>
            </div>
          </div>
        </div>
      )}

      {/* ── NAVBAR ── */}
      {tab==='navbar' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div>
            <label style={lbl}>Navbar Style</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[
                { val:'sticky',      label:'Sticky',      icon:'📌', desc:'Stays at top while scrolling' },
                { val:'transparent', label:'Transparent', icon:'🔍', desc:'See-through over hero' },
                { val:'minimal',     label:'Minimal',     icon:'➖', desc:'Clean white bar' },
              ].map(opt => (
                <div key={opt.val} onClick={() => set('navbarStyle', opt.val)} style={{ padding:'12px 10px', borderRadius:10, border:`2px solid ${cfg.navbarStyle===opt.val?C.purple:C.border}`, background:cfg.navbarStyle===opt.val?`${C.purple}15`:C.card2, cursor:'pointer', textAlign:'center', transition:'all .15s' }}>
                  <div style={{ fontSize:'1.2rem', marginBottom:4 }}>{opt.icon}</div>
                  <div style={{ fontSize:'.75rem', fontWeight:700, color:cfg.navbarStyle===opt.val?C.purpleLight:C.text }}>{opt.label}</div>
                  <div style={{ fontSize:'.62rem', color:C.textMuted, marginTop:2 }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={lbl}>CTA Button Text</label>
              <input style={inp} value={cfg.navCTAText} onChange={e => set('navCTAText', e.target.value)} placeholder="Get Started" />
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:C.card2, borderRadius:10, border:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:'.82rem', fontWeight:700, color:C.text }}>Show CTA Button</div>
                <div style={{ fontSize:'.7rem', color:C.textMuted }}>Display action button in navbar</div>
              </div>
              <div onClick={() => set('showNavCTA', !cfg.showNavCTA)} style={{ width:44, height:24, borderRadius:12, background:cfg.showNavCTA?C.purple:C.border, cursor:'pointer', position:'relative', transition:'background .2s' }}>
                <div style={{ position:'absolute', top:2, left:cfg.showNavCTA?22:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COLORS ── */}
      {tab==='colors' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { key:'primaryColor',   label:'Primary Color',        desc:'Main brand color' },
            { key:'secondaryColor', label:'Secondary Color',      desc:'Accent & highlights' },
            { key:'bgLight',        label:'Background (Light)',   desc:'Page background' },
            { key:'bgDark',         label:'Background (Dark)',    desc:'Dark sections' },
            { key:'cardBg',         label:'Card Background',      desc:'Cards & panels' },
            { key:'textColor',      label:'Text Color',           desc:'Main body text' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ padding:'14px', background:C.card2, borderRadius:12, border:`1px solid ${C.border}` }}>
              <label style={lbl}>{label}</label>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="color" value={cfg[key]} onChange={e => set(key, e.target.value)}
                  style={{ width:40, height:40, borderRadius:8, border:'none', cursor:'pointer', padding:2, background:'none' }} />
                <div>
                  <div style={{ fontSize:'.8rem', fontWeight:700, color:C.text }}>{cfg[key]}</div>
                  <div style={{ fontSize:'.68rem', color:C.textMuted }}>{desc}</div>
                </div>
              </div>
              <div style={{ marginTop:10, height:8, borderRadius:4, background:cfg[key] }}/>
            </div>
          ))}
          {/* Color palette preview */}
          <div style={{ gridColumn:'1/-1', padding:'14px', background:C.card2, borderRadius:12, border:`1px solid ${C.border}` }}>
            <label style={lbl}>Color Palette Preview</label>
            <div style={{ display:'flex', gap:8, marginTop:6 }}>
              {[cfg.primaryColor, cfg.secondaryColor, cfg.bgLight, cfg.bgDark, cfg.cardBg, cfg.textColor].map((c, i) => (
                <div key={i} style={{ flex:1, height:32, borderRadius:8, background:c, border:'1px solid rgba(0,0,0,.1)' }} title={c}/>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      {tab==='hero' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Hero Layout</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { val:'centered',   label:'Centered',   icon:'⬛', desc:'Text centered, full width' },
                { val:'split',      label:'Split',      icon:'⬜', desc:'Text left, image right' },
                { val:'fullscreen', label:'Fullscreen', icon:'🖥️', desc:'Full viewport height' },
              ].map(opt => (
                <div key={opt.val} onClick={() => set('heroLayout', opt.val)} style={{ padding:'12px', borderRadius:10, border:`2px solid ${cfg.heroLayout===opt.val?C.purple:C.border}`, background:cfg.heroLayout===opt.val?`${C.purple}15`:C.card2, cursor:'pointer', textAlign:'center', transition:'all .15s' }}>
                  <div style={{ fontSize:'1.4rem', marginBottom:4 }}>{opt.icon}</div>
                  <div style={{ fontSize:'.78rem', fontWeight:700, color:cfg.heroLayout===opt.val?C.purpleLight:C.text }}>{opt.label}</div>
                  <div style={{ fontSize:'.62rem', color:C.textMuted, marginTop:2 }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Hero Title</label>
            <input style={inp} value={cfg.heroTitle} onChange={e => set('heroTitle', e.target.value)} placeholder="Welcome to Our Store" />
          </div>
          <div>
            <label style={lbl}>CTA Button Text</label>
            <input style={inp} value={cfg.heroCTAText} onChange={e => set('heroCTAText', e.target.value)} placeholder="Explore Now" />
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Hero Subtitle</label>
            <input style={inp} value={cfg.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} placeholder="Discover amazing products and services." />
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Background Image URL (optional)</label>
            <input style={inp} value={cfg.heroBgImage} onChange={e => set('heroBgImage', e.target.value)} placeholder="https://images.unsplash.com/..." />
          </div>
        </div>
      )}

      {/* ── SECTIONS ── */}
      {tab==='sections' && (
        <div>
          <p style={{ fontSize:'.82rem', color:C.textMuted, marginBottom:16 }}>Toggle which sections appear on the website. Drag to reorder (coming soon).</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {SECTION_LIST.map(s => {
              const enabled = cfg.sections?.[s.key] ?? true
              return (
                <div key={s.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:enabled?`${C.purple}08`:C.card2, borderRadius:12, border:`1px solid ${enabled?C.purple+'30':C.border}`, transition:'all .2s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, background:enabled?`${C.purple}15`:C.border+'40', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize:'.84rem', fontWeight:700, color:enabled?C.text:C.textMuted }}>{s.label}</div>
                      <div style={{ fontSize:'.68rem', color:C.textMuted }}>{s.desc}</div>
                    </div>
                  </div>
                  <div onClick={() => setSection(s.key, !enabled)} style={{ width:44, height:24, borderRadius:12, background:enabled?C.purple:C.border, cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:2, left:enabled?22:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop:14, padding:'12px 14px', background:`${C.green}08`, border:`1px solid ${C.green}20`, borderRadius:10, fontSize:'.78rem', color:C.textMuted }}>
            ✅ <strong style={{ color:C.green }}>{Object.values(cfg.sections||{}).filter(Boolean).length}</strong> sections enabled
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      {tab==='footer' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div>
            <label style={lbl}>Footer Columns: {cfg.footerColumns}</label>
            <input type="range" min={1} max={4} step={1} value={cfg.footerColumns} onChange={e => set('footerColumns', Number(e.target.value))}
              style={{ width:'100%', accentColor:C.purple }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:C.textMuted, marginTop:3 }}>
              {[1,2,3,4].map(n => <span key={n}>{n} col{n>1?'s':''}</span>)}
            </div>
          </div>
          <div>
            <label style={lbl}>Copyright Text</label>
            <input style={inp} value={cfg.footerCopyright} onChange={e => set('footerCopyright', e.target.value)} placeholder="© 2026 All rights reserved." />
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={{ ...lbl, marginBottom:10 }}>Social Media Links</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { key:'facebook',  icon:'📘', placeholder:'https://facebook.com/page' },
                { key:'instagram', icon:'📸', placeholder:'https://instagram.com/handle' },
                { key:'twitter',   icon:'🐦', placeholder:'https://twitter.com/handle' },
                { key:'youtube',   icon:'▶️', placeholder:'https://youtube.com/channel' },
                { key:'linkedin',  icon:'💼', placeholder:'https://linkedin.com/company' },
              ].map(({ key, icon, placeholder }) => (
                <div key={key} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{icon}</span>
                  <input style={{ ...inp, flex:1 }} value={cfg.socialLinks?.[key]||''} onChange={e => setSocial(key, e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BRANDING ── */}
      {tab==='branding' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div>
            <label style={lbl}>Logo URL</label>
            <input style={inp} value={cfg.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://yoursite.com/logo.png" />
            {cfg.logoUrl && (
              <div style={{ marginTop:8, padding:'10px', background:C.card2, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src={cfg.logoUrl} alt="logo preview" style={{ maxHeight:40, maxWidth:120, objectFit:'contain' }} onError={e => (e.currentTarget.style.display='none')} />
              </div>
            )}
          </div>
          <div>
            <label style={lbl}>Favicon URL</label>
            <input style={inp} value={cfg.faviconUrl} onChange={e => set('faviconUrl', e.target.value)} placeholder="https://yoursite.com/favicon.ico" />
            {cfg.faviconUrl && (
              <div style={{ marginTop:8, padding:'10px', background:C.card2, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src={cfg.faviconUrl} alt="favicon preview" style={{ width:32, height:32, objectFit:'contain' }} onError={e => (e.currentTarget.style.display='none')} />
              </div>
            )}
          </div>
          <div style={{ gridColumn:'1/-1', padding:'14px', background:`${C.amber}08`, border:`1px solid ${C.amber}20`, borderRadius:12 }}>
            <div style={{ fontSize:'.82rem', fontWeight:700, color:C.amber, marginBottom:4 }}>💡 Branding Tips</div>
            <ul style={{ fontSize:'.75rem', color:C.textMuted, paddingLeft:16, lineHeight:1.8, margin:0 }}>
              <li>Logo: Use PNG with transparent background, min 200×60px</li>
              <li>Favicon: Use 32×32 or 64×64 ICO/PNG file</li>
              <li>Host images on CDN (Cloudinary, Imgur) for best performance</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
