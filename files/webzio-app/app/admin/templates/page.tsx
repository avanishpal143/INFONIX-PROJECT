'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', amber: '#F59E0B', card: '#0F172A', cardBorder: 'rgba(124, 58, 237, 0.15)',
  text: '#E2E8F0', textMuted: '#94A3B8', green: '#22C55E', red: '#EF4444',
  inner: 'rgba(124, 58, 237, 0.08)',
}

const EMPTY_FORM = { name: '', category: '', icon: '🌐', desc: '', color: 'linear-gradient(135deg,#7C3AED,#22D3EE)', accentColor: '#7C3AED', tags: '', popular: false, isActive: true, previewImage: '', templateType: 'general' }

export default function AdminTemplatesPage() {
  const { token } = useAuthStore()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [preview, setPreview] = useState<any | null>(null)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (typeFilter) params.set('type', typeFilter)
    const res = await fetch(`/api/admin/templates?${params}`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setTemplates(data.templates)
    setLoading(false)
  }

  useEffect(() => { load() }, [typeFilter])

  const save = async () => {
    if (!form.name || !form.category) return alert('Name and category are required')
    setSaving(true)
    const body = { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) }
    if (editing) {
      const res = await fetch(`/api/admin/templates/${editing}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) setTemplates(t => t.map(x => x._id === editing ? data.template : x))
    } else {
      const res = await fetch('/api/admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.success) setTemplates(t => [data.template, ...t])
    }
    setForm(EMPTY_FORM); setEditing(null); setShowForm(false); setSaving(false)
  }

  const toggleStatus = async (id: string, current: boolean) => {
    await fetch(`/api/admin/templates/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ isActive: !current }) })
    setTemplates(t => t.map(x => x._id === id ? { ...x, isActive: !current } : x))
  }

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/admin/templates/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setTemplates(t => t.filter(x => x._id !== id))
  }

  const startEdit = (t: any) => {
    setForm({ ...t, tags: (t.tags || []).join(', ') })
    setEditing(t._id); setShowForm(true)
  }

  const F = ({ label, children }: any) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      {children}
    </div>
  )
  const inputStyle: any = { width: '100%', padding: '10px 14px', background: '#0A0F1E', border: `1px solid ${C.cardBorder}`, borderRadius: 8, color: C.text, fontSize: '0.85rem', outline: 'none' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text }}>🎨 Template Management</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>{templates.length} templates</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowForm(!showForm) }} style={{ padding: '11px 22px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: `0 4px 20px ${C.purple}60` }}>
          {showForm ? '✕ Cancel' : '+ Add Template'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>{editing ? '✏️ Edit Template' : '➕ Add New Template'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <F label="Template Name *"><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Modern Restaurant" /></F>
            <F label="Category *"><input style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Food & Dining" /></F>
            <F label="Icon (Emoji)"><input style={inputStyle} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="🌐" /></F>
            <F label="Description"><input style={inputStyle} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Short description..." /></F>
            <F label="Tags (comma-sep)"><input style={inputStyle} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Menu, WhatsApp, Booking" /></F>
            <F label="Accent Color"><input style={{ ...inputStyle, height: 42 }} type="color" value={form.accentColor} onChange={e => setForm(f => ({ ...f, accentColor: e.target.value }))} /></F>
            <F label="Gradient CSS"><input style={inputStyle} value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="linear-gradient(135deg,...)" /></F>
            <F label="Preview Image URL"><input style={inputStyle} value={form.previewImage} onChange={e => setForm(f => ({ ...f, previewImage: e.target.value }))} placeholder="https://..." /></F>
            <F label="Type">
              <select style={inputStyle} value={form.templateType} onChange={e => setForm(f => ({ ...f, templateType: e.target.value }))}>
                <option value="general">General</option>
                <option value="portfolio">Portfolio</option>
              </select>
            </F>
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.popular} onChange={e => setForm(f => ({ ...f, popular: e.target.checked }))} /> Mark as Popular
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active
            </label>
          </div>
          <button onClick={save} disabled={saving} style={{ marginTop: 20, padding: '12px 28px', background: `linear-gradient(135deg,${C.purple},${C.cyan})`, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
            {saving ? 'Saving...' : editing ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {[['', 'All'], ['general', 'General'], ['portfolio', 'Portfolio']].map(([v, l]) => (
          <button key={v} onClick={() => setTypeFilter(v)} style={{ padding: '8px 18px', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', background: typeFilter === v ? `${C.purple}30` : C.card, border: `1px solid ${typeFilter === v ? C.purple + '80' : C.cardBorder}`, color: typeFilter === v ? C.cyan : C.textMuted }}>{l}</button>
        ))}
      </div>

      {/* Template Cards Grid */}
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {templates.map(t => (
            <div key={t._id} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
              {/* Preview Banner */}
              <div style={{ height: 100, background: t.color || `linear-gradient(135deg,${C.purple},${C.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
                {t.previewImage ? <img src={t.previewImage} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /> : t.icon}
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
                  {t.popular && <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#F59E0B', color: '#000', padding: '2px 8px', borderRadius: 20 }}>⭐ Popular</span>}
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: t.isActive ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)', color: '#fff' }}>{t.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: C.text, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: '0.75rem', color: C.purple, fontWeight: 700, marginBottom: 6 }}>{t.category}</div>
                <div style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: 10 }}>{t.desc}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                  {(t.tags || []).map((tag: string) => (
                    <span key={tag} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(139,92,246,0.1)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setPreview(t)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: `${C.purple}20`, border: `1px solid ${C.purple}40`, color: C.cyan }}>Preview</button>
                  <button onClick={() => startEdit(t)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA' }}>Edit</button>
                  <button onClick={() => toggleStatus(t._id, t.isActive)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: t.isActive ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: 'none', color: t.isActive ? C.red : C.green }}>
                    {t.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deleteTemplate(t._id)} style={{ padding: '7px 10px', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: 'none', color: C.red }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
          {templates.length === 0 && <p style={{ color: C.textMuted, gridColumn: '1/-1' }}>No templates yet. Add your first one!</p>}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(6px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 20, padding: 32, maxWidth: 480, width: '90%' }}>
            <div style={{ height: 160, background: preview.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              {preview.previewImage ? <img src={preview.previewImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : preview.icon}
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: C.text, marginBottom: 6 }}>{preview.name}</h2>
            <div style={{ fontSize: '0.85rem', color: preview.accentColor, fontWeight: 700, marginBottom: 10 }}>{preview.category} · {preview.templateType}</div>
            <p style={{ fontSize: '0.88rem', color: C.textMuted, marginBottom: 16 }}>{preview.desc}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(preview.tags || []).map((tag: string) => (
                <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: `${preview.accentColor}20`, color: preview.accentColor, border: `1px solid ${preview.accentColor}40` }}>{tag}</span>
              ))}
            </div>
            <button onClick={() => setPreview(null)} style={{ marginTop: 20, width: '100%', padding: '11px', background: `${C.purple}20`, border: `1px solid ${C.purple}40`, borderRadius: 10, color: C.cyan, fontWeight: 700, cursor: 'pointer' }}>Close Preview</button>
          </div>
        </div>
      )}
    </div>
  )
}
