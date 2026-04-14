'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../../stores/authStore'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

const C = {
  blue: '#3B82F6', card: '#111827', border: 'rgba(59,130,246,0.15)',
  text: '#E2E8F0', textMuted: '#6B7280', green: '#22C55E', bg: '#0D1117',
}

const SOCIAL_FIELDS = [
  { key: 'facebook', label: 'Facebook URL', icon: '📘', placeholder: 'https://facebook.com/yourpage' },
  { key: 'instagram', label: 'Instagram URL', icon: '📸', placeholder: 'https://instagram.com/yourhandle' },
  { key: 'twitter', label: 'Twitter / X URL', icon: '🐦', placeholder: 'https://twitter.com/yourhandle' },
  { key: 'youtube', label: 'YouTube URL', icon: '📺', placeholder: 'https://youtube.com/@yourchannel' },
  { key: 'linkedin', label: 'LinkedIn URL', icon: '💼', placeholder: 'https://linkedin.com/in/yourprofile' },
]

export default function BrandingPage() {
  const { token } = useAuthStore()
  const params = useParams()
  const storeId = params?.storeId as string

  const [form, setForm] = useState<any>({
    siteName: '', content: {
      logo: '', heroTitle: '', heroSubtitle: '', heroImage: '',
      aboutTitle: '', aboutText: '', aboutImage: '',
      contactPhone: '', contactEmail: '', contactAddress: '', whatsappNumber: '',
      footerDesc: '', primaryColor: '#3B82F6',
      socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '' }
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'about' | 'contact' | 'social'>('branding')

  useEffect(() => {
    fetch(`/api/store/${storeId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        if (d.success) setForm({
          siteName: d.store.siteName,
          content: { ...form.content, ...d.store.content, socialLinks: { ...form.content.socialLinks, ...(d.store.content?.socialLinks || {}) } }
        })
      }).finally(() => setLoading(false))
  }, [storeId, token])

  const set = (key: string, val: any) => setForm((f: any) => ({ ...f, content: { ...f.content, [key]: val } }))
  const setSocial = (key: string, val: string) => setForm((f: any) => ({ ...f, content: { ...f.content, socialLinks: { ...f.content.socialLinks, [key]: val } } }))

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/store/${storeId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ siteName: form.siteName, content: form.content }),
    })
    const data = await res.json()
    if (data.success) toast.success('Branding saved!')
    else toast.error(data.message || 'Failed to save')
    setSaving(false)
  }

  const inputStyle: any = { width: '100%', padding: '11px 14px', background: '#0D1117', border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontSize: '0.85rem', outline: 'none', transition: 'border 0.2s' }
  const labelStyle: any = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }

  const tabs = [
    { id: 'branding', label: '🎨 Brand', title: 'Brand Identity' },
    { id: 'hero', label: '🖼️ Hero', title: 'Hero Section' },
    { id: 'about', label: '📖 About', title: 'About Section' },
    { id: 'contact', label: '📞 Contact', title: 'Contact Details' },
    { id: 'social', label: '🌐 Social', title: 'Social Links' },
  ]

  if (loading) return <div style={{ color: C.textMuted, padding: 40 }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: C.text }}>🎨 Branding & Identity</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>Customize your store's look and feel</p>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}>
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: C.card, padding: 6, borderRadius: 12, border: `1px solid ${C.border}`, width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{
            padding: '9px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
            background: activeTab === t.id ? 'linear-gradient(135deg,#3B82F6,#2563EB)' : 'transparent',
            color: activeTab === t.id ? '#fff' : C.textMuted, boxShadow: activeTab === t.id ? '0 4px 12px rgba(59,130,246,0.35)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, marginBottom: 22 }}>{tabs.find(t => t.id === activeTab)?.title}</h3>

        {activeTab === 'branding' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Store Name</label>
              <input style={inputStyle} value={form.siteName} onChange={e => setForm((f: any) => ({ ...f, siteName: e.target.value }))} placeholder="Your Business Name" />
            </div>
            <div>
              <label style={labelStyle}>Logo URL</label>
              <input style={inputStyle} value={form.content.logo} onChange={e => set('logo', e.target.value)} placeholder="https://your-logo-url.com/logo.png" />
              {form.content.logo && <img src={form.content.logo} alt="logo preview" style={{ marginTop: 10, height: 50, objectFit: 'contain', borderRadius: 6, background: 'rgba(255,255,255,0.05)', padding: 6 }} />}
            </div>
            <div>
              <label style={labelStyle}>Footer Description</label>
              <input style={inputStyle} value={form.content.footerDesc} onChange={e => set('footerDesc', e.target.value)} placeholder="Quality products delivered to you." />
            </div>
            <div>
              <label style={labelStyle}>Primary Brand Color</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={form.content.primaryColor} onChange={e => set('primaryColor', e.target.value)} style={{ width: 52, height: 42, borderRadius: 8, border: `1px solid ${C.border}`, cursor: 'pointer', background: 'transparent' }} />
                <input style={{ ...inputStyle, flex: 1 }} value={form.content.primaryColor} onChange={e => set('primaryColor', e.target.value)} placeholder="#3B82F6" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>WhatsApp Number</label>
              <input style={inputStyle} value={form.content.whatsappNumber} onChange={e => set('whatsappNumber', e.target.value)} placeholder="+91 9800000000" />
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>Hero / Banner Image URL</label>
              <input style={inputStyle} value={form.content.heroImage} onChange={e => set('heroImage', e.target.value)} placeholder="https://your-image-url.com/banner.jpg" />
              {form.content.heroImage && <img src={form.content.heroImage} alt="hero" style={{ marginTop: 10, width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} />}
            </div>
            <div>
              <label style={labelStyle}>Hero Title</label>
              <input style={inputStyle} value={form.content.heroTitle} onChange={e => set('heroTitle', e.target.value)} placeholder="Welcome to Our Store" />
            </div>
            <div>
              <label style={labelStyle}>Hero Subtitle</label>
              <input style={inputStyle} value={form.content.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} placeholder="Discover our amazing collection" />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={labelStyle}>About Title</label>
              <input style={inputStyle} value={form.content.aboutTitle} onChange={e => set('aboutTitle', e.target.value)} placeholder="About Us" />
            </div>
            <div>
              <label style={labelStyle}>About Image URL</label>
              <input style={inputStyle} value={form.content.aboutImage} onChange={e => set('aboutImage', e.target.value)} placeholder="https://..." />
              {form.content.aboutImage && <img src={form.content.aboutImage} alt="about" style={{ marginTop: 10, width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} />}
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={labelStyle}>About Text</label>
              <textarea style={{ ...inputStyle, height: 120, resize: 'vertical' }} value={form.content.aboutText} onChange={e => set('aboutText', e.target.value)} placeholder="Tell your customers about your business..." />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[
              { label: 'Contact Email', key: 'contactEmail', placeholder: 'hello@yourbusiness.com' },
              { label: 'Contact Phone', key: 'contactPhone', placeholder: '+91 98000 00000' },
              { label: 'Business Address', key: 'contactAddress', placeholder: '123 Main Street, City' },
              { label: 'WhatsApp Number', key: 'whatsappNumber', placeholder: '+91 98000 00000' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input style={inputStyle} value={(form.content as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SOCIAL_FIELDS.map(({ key, label, icon, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{icon} {label}</label>
                <input style={inputStyle} value={form.content.socialLinks?.[key] || ''} onChange={e => setSocial(key, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save floating bar */}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={save} disabled={saving} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}>
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>
    </div>
  )
}
