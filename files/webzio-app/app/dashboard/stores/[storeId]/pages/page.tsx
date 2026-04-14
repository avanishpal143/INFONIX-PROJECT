'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../../stores/authStore'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

const C = {
  purple: '#8B5CF6', card: '#111827', border: 'rgba(59,130,246,0.15)',
  text: '#E2E8F0', textMuted: '#6B7280', green: '#22C55E', red: '#EF4444', blue: '#3B82F6',
}

const SYSTEM_PAGES = [
  { title: 'About Us', slug: 'about', icon: '📖', desc: 'Tell your story, mission, team' },
  { title: 'Contact Us', slug: 'contact', icon: '📞', desc: 'Forms, address, WhatsApp link' },
]

export default function CMSPagesPage() {
  const { token } = useAuthStore()
  const params = useParams()
  const storeId = params?.storeId as string
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newPage, setNewPage] = useState({ title: '', slug: '', content: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/store/${storeId}/pages`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setPages(data.pages)
    setLoading(false)
  }
  useEffect(() => { load() }, [storeId])

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    const res = await fetch(`/api/store/${storeId}/pages`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ slug: editing.slug, title: editing.title, content: editing.content, isPublished: editing.isPublished }),
    })
    const data = await res.json()
    if (data.success) { setPages(data.pages); setEditing(null); toast.success('Page saved!') }
    else toast.error(data.message || 'Failed')
    setSaving(false)
  }

  const createPage = async () => {
    if (!newPage.title || !newPage.slug) return toast.error('Title and slug required')
    setSaving(true)
    const slug = newPage.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const res = await fetch(`/api/store/${storeId}/pages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...newPage, slug }),
    })
    const data = await res.json()
    if (data.success) { setPages(data.pages); setShowNew(false); setNewPage({ title: '', slug: '', content: '' }); toast.success('Page created!') }
    else toast.error(data.message || 'Failed')
    setSaving(false)
  }

  const deletePage = async (slug: string) => {
    if (!confirm('Delete this page?')) return
    setDeleting(slug)
    const res = await fetch(`/api/store/${storeId}/pages`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ slug }),
    })
    const data = await res.json()
    if (data.success) { setPages(data.pages); toast.success('Page deleted') }
    setDeleting(null)
  }

  const inputStyle: any = { width: '100%', padding: '10px 14px', background: '#0D1117', border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontSize: '0.85rem', outline: 'none' }
  const labelStyle: any = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: C.text }}>📄 CMS Management</h1>
          <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>Create and manage your store pages</p>
        </div>
        <button onClick={() => setShowNew(!showNew)} style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
          {showNew ? '✕ Cancel' : '+ New Page'}
        </button>
      </div>

      {/* New Page Form */}
      {showNew && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: C.text, marginBottom: 18 }}>➕ Create Custom Page</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Page Title *</label>
              <input style={inputStyle} value={newPage.title} onChange={e => setNewPage(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} placeholder="e.g. Our Team" />
            </div>
            <div>
              <label style={labelStyle}>URL Slug *</label>
              <input style={inputStyle} value={newPage.slug} onChange={e => setNewPage(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. our-team" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Page Content</label>
            <textarea style={{ ...inputStyle, height: 140, resize: 'vertical' }} value={newPage.content} onChange={e => setNewPage(p => ({ ...p, content: e.target.value }))} placeholder="Write your page content here (HTML supported)..." />
          </div>
          <button onClick={createPage} disabled={saving} style={{ padding: '11px 24px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}>
            {saving ? 'Creating...' : 'Create Page'}
          </button>
        </div>
      )}

      {/* System Pages */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>System Pages</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {SYSTEM_PAGES.map(sp => {
            const existing = pages.find(p => p.slug === sp.slug)
            return (
              <div key={sp.slug} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.4rem' }}>{sp.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: C.text }}>{sp.title}</div>
                    <div style={{ fontSize: '0.72rem', color: C.textMuted }}>{sp.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (existing) setEditing({ ...existing })
                    else setEditing({ title: sp.title, slug: sp.slug, content: '', isPublished: true })
                  }}
                  style={{ padding: '7px 14px', background: 'rgba(59,130,246,0.1)', border: `1px solid rgba(59,130,246,0.2)`, borderRadius: 8, color: '#60A5FA', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                  {existing ? 'Edit' : 'Setup'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Pages */}
      {loading ? <p style={{ color: C.textMuted }}>Loading pages...</p> : (
        <>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Custom Pages ({pages.filter(p => !['about', 'contact'].includes(p.slug)).length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pages.filter(p => !['about', 'contact'].includes(p.slug)).map(page => (
              <div key={page.slug} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: C.text }}>{page.title}</div>
                  <div style={{ fontSize: '0.72rem', color: C.textMuted }}>/{page.slug}</div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, color: page.isPublished ? C.green : C.textMuted, background: page.isPublished ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)' }}>
                  {page.isPublished ? '● Published' : '○ Draft'}
                </span>
                <div style={{ display: 'flex', gap: 7 }}>
                  <button onClick={() => setEditing({ ...page })} style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(59,130,246,0.1)', border: 'none', color: '#60A5FA' }}>Edit</button>
                  <button onClick={() => deletePage(page.slug)} disabled={deleting === page.slug} style={{ padding: '6px 10px', borderRadius: 8, fontSize: '0.75rem', cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: 'none', color: C.red }}>
                    {deleting === page.slug ? '...' : '🗑'}
                  </button>
                </div>
              </div>
            ))}
            {pages.filter(p => !['about', 'contact'].includes(p.slug)).length === 0 &&
              <p style={{ color: C.textMuted, fontSize: '0.85rem' }}>No custom pages yet. Create your first one above.</p>}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32, width: '90%', maxWidth: 680 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: C.text }}>✏️ Edit: {editing.title}</h3>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Page Title</label>
              <input style={inputStyle} value={editing.title} onChange={e => setEditing((p: any) => ({ ...p, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Content (HTML supported)</label>
              <textarea style={{ ...inputStyle, height: 200, resize: 'vertical' }} value={editing.content} onChange={e => setEditing((p: any) => ({ ...p, content: e.target.value }))} placeholder="Write your page content here..." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <input type="checkbox" id="pub" checked={editing.isPublished} onChange={e => setEditing((p: any) => ({ ...p, isPublished: e.target.checked }))} />
              <label htmlFor="pub" style={{ fontSize: '0.85rem', color: C.text, cursor: 'pointer' }}>Published</label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                {saving ? 'Saving...' : '💾 Save Page'}
              </button>
              <button onClick={() => setEditing(null)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 10, color: C.textMuted, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
