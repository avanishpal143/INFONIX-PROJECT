'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'

const C = {
  purple: '#8B5CF6', card: '#0F172A', cardBorder: 'rgba(139,92,246,0.12)',
  text: '#E2E8F0', textMuted: '#64748B', green: '#22C55E', red: '#EF4444',
}

const ICONS = ['📁', '💼', '🛒', '📸', '🍴', '🏥', '🏠', '💻', '🎓', '💅', '💪', '🌐', '🎨', '📦', '⚡']
const COLORS = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#6366F1']
const EMPTY = { name: '', description: '', icon: '📁', color: '#8B5CF6' }

export default function AdminCategoriesPage() {
  const { token } = useAuthStore()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setCategories(data.categories)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name) return alert('Name is required')
    setSaving(true)
    if (editing) {
      const res = await fetch(`/api/admin/categories/${editing}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) setCategories(c => c.map(x => x._id === editing ? data.category : x))
    } else {
      const res = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) setCategories(c => [data.category, ...c])
      else { alert(data.message); setSaving(false); return }
    }
    setForm(EMPTY); setEditing(null); setShowForm(false); setSaving(false)
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setCategories(c => c.filter(x => x._id !== id))
  }

  const startEdit = (cat: any) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon, color: cat.color })
    setEditing(cat._id); setShowForm(true)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text }}>📁 Template Categories</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>{categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm) }} style={{ padding: '11px 22px', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
          {showForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>{editing ? '✏️ Edit Category' : '➕ New Category'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Business"
                style={{ width: '100%', padding: '10px 14px', background: '#0A0F1E', border: `1px solid ${C.cardBorder}`, borderRadius: 8, color: C.text, fontSize: '0.85rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..."
                style={{ width: '100%', padding: '10px 14px', background: '#0A0F1E', border: `1px solid ${C.cardBorder}`, borderRadius: 8, color: C.text, fontSize: '0.85rem', outline: 'none' }} />
            </div>
          </div>
          {/* Icon Picker */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: 'uppercase' }}>Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))} style={{ width: 40, height: 40, borderRadius: 10, border: `2px solid ${form.icon === icon ? C.purple : 'transparent'}`, background: form.icon === icon ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', fontSize: '1.3rem', cursor: 'pointer' }}>{icon}</button>
              ))}
            </div>
          </div>
          {/* Color Picker */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: 'uppercase' }}>Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map(color => (
                <button key={color} onClick={() => setForm(f => ({ ...f, color }))} style={{ width: 32, height: 32, borderRadius: '50%', background: color, border: `3px solid ${form.color === color ? '#fff' : 'transparent'}`, cursor: 'pointer', boxShadow: form.color === color ? `0 0 12px ${color}` : 'none' }} />
              ))}
            </div>
          </div>
          {/* Preview */}
          <div style={{ marginBottom: 20, padding: '14px 18px', background: `${form.color}10`, border: `1px solid ${form.color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.8rem' }}>{form.icon}</span>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text }}>{form.name || 'Category Name'}</div>
              <div style={{ fontSize: '0.78rem', color: form.color, fontWeight: 600 }}>{form.description || 'Description'}</div>
            </div>
          </div>
          <button onClick={save} disabled={saving} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
            {saving ? 'Saving...' : editing ? 'Update' : 'Create Category'}
          </button>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? <p style={{ color: C.textMuted }}>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <div key={cat._id} style={{ background: C.card, border: `1px solid ${cat.color}25`, borderRadius: 14, padding: 22, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cat.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, background: `${cat.color}15`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', border: `1px solid ${cat.color}25` }}>{cat.icon}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(cat)} style={{ padding: '5px 10px', borderRadius: 7, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(59,130,246,0.1)', border: 'none', color: '#60A5FA' }}>Edit</button>
                  <button onClick={() => deleteCategory(cat._id)} style={{ padding: '5px 10px', borderRadius: 7, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: 'none', color: C.red }}>🗑</button>
                </div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: '0.78rem', color: C.textMuted, marginBottom: 10 }}>{cat.description || 'No description'}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: cat.color }}>/{cat.slug}</div>
            </div>
          ))}
          {categories.length === 0 && <p style={{ color: C.textMuted, gridColumn: '1/-1' }}>No categories yet. Add your first one!</p>}
        </div>
      )}
    </div>
  )
}
