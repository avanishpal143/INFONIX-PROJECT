'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'

const C = {
  purple: '#8B5CF6', pink: '#EC4899', card: '#0F172A', cardBorder: 'rgba(236,72,153,0.15)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444',
}

const EMPTY_FORM = { name: '', category: '', icon: '🖼️', desc: '', color: 'linear-gradient(135deg,#EC4899,#9D174D)', accentColor: '#EC4899', tags: '', popular: false, isActive: true, previewImage: '', templateType: 'portfolio' }

export default function AdminPortfolioPage() {
  const { token } = useAuthStore()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/templates?type=portfolio', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setTemplates(data.templates)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name || !form.category) return alert('Name and category are required')
    setSaving(true)
    const body = { ...form, templateType: 'portfolio', tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) }
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
    if (!confirm('Delete this portfolio template?')) return
    await fetch(`/api/admin/templates/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setTemplates(t => t.filter(x => x._id !== id))
  }

  const startEdit = (t: any) => {
    setForm({ ...t, tags: (t.tags || []).join(', '), templateType: 'portfolio' })
    setEditing(t._id); setShowForm(true)
  }

  const inputStyle: any = { width: '100%', padding: '10px 14px', background: '#0A0F1E', border: `1px solid rgba(236,72,153,0.15)`, borderRadius: 8, color: C.text, fontSize: '0.85rem', outline: 'none' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text }}>🖼️ Portfolio Templates</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>Manage portfolio-type templates independently. {templates.length} template{templates.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowForm(!showForm) }} style={{ padding: '11px 22px', background: 'linear-gradient(135deg, #EC4899, #9D174D)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(236,72,153,0.35)' }}>
          {showForm ? '✕ Cancel' : '+ Add Portfolio Template'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: C.card, border: `1px solid rgba(236,72,153,0.2)`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>{editing ? '✏️ Edit Portfolio Template' : '➕ New Portfolio Template'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { label: 'Template Name *', key: 'name', placeholder: 'e.g. Creative Photographer' },
              { label: 'Category *', key: 'category', placeholder: 'e.g. Photography, Design' },
              { label: 'Icon', key: 'icon', placeholder: '🖼️' },
              { label: 'Description', key: 'desc', placeholder: 'What this template offers...' },
              { label: 'Tags (comma-sep)', key: 'tags', placeholder: 'Gallery, Creative, Hire' },
              { label: 'Preview Image URL', key: 'previewImage', placeholder: 'https://...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>{label}</label>
                <input style={inputStyle} value={(form as any)[key]} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.popular} onChange={e => setForm(f => ({ ...f, popular: e.target.checked }))} /> Popular
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: C.text, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active
            </label>
          </div>
          <button onClick={save} disabled={saving} style={{ marginTop: 18, padding: '12px 28px', background: 'linear-gradient(135deg,#EC4899,#9D174D)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
            {saving ? 'Saving...' : editing ? 'Update Template' : 'Create Portfolio Template'}
          </button>
        </div>
      )}

      {/* Cards */}
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {templates.map(t => (
            <div key={t._id} style={{ background: C.card, border: `1px solid rgba(236,72,153,0.15)`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ height: 110, background: t.color || 'linear-gradient(135deg,#EC4899,#9D174D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', position: 'relative' }}>
                {t.previewImage ? <img src={t.previewImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : t.icon}
                <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', gap: 4 }}>
                  {t.popular && <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'rgba(245,158,11,0.9)', color: '#000', padding: '2px 8px', borderRadius: 20 }}>⭐</span>}
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: t.isActive ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)', color: '#fff' }}>{t.isActive ? 'Active' : 'Off'}</span>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(236,72,153,0.2)', padding: '3px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, color: '#F9A8D4', border: '1px solid rgba(236,72,153,0.3)' }}>Portfolio</div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: C.text }}>{t.name}</div>
                <div style={{ fontSize: '0.75rem', color: C.pink, fontWeight: 700, margin: '3px 0 8px' }}>{t.category}</div>
                <div style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: 10 }}>{t.desc}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                  {(t.tags || []).map((tag: string) => <span key={tag} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(236,72,153,0.1)', color: '#F9A8D4', border: '1px solid rgba(236,72,153,0.2)' }}>{tag}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={() => startEdit(t)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(236,72,153,0.1)', border: 'none', color: '#F9A8D4' }}>Edit</button>
                  <button onClick={() => toggleStatus(t._id, t.isActive)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: t.isActive ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: 'none', color: t.isActive ? C.red : C.green }}>
                    {t.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deleteTemplate(t._id)} style={{ padding: '7px 10px', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: 'none', color: C.red }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
          {templates.length === 0 && <p style={{ color: C.textMuted, gridColumn: '1/-1' }}>No portfolio templates yet.</p>}
        </div>
      )}
    </div>
  )
}
