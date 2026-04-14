'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../../stores/authStore'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

const C = {
  pink: '#EC4899', card: '#111827', border: 'rgba(59,130,246,0.15)',
  text: '#E2E8F0', textMuted: '#6B7280', red: '#EF4444', blue: '#3B82F6',
}
const MAX = 5

export default function GalleryPage() {
  const { token } = useAuthStore()
  const params = useParams()
  const storeId = params?.storeId as string
  const [gallery, setGallery] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/store/${storeId}/gallery`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setGallery(data.gallery)
    setLoading(false)
  }
  useEffect(() => { load() }, [storeId])

  const addImage = async () => {
    if (!newUrl.trim()) return toast.error('Please enter an image URL')
    if (gallery.length >= MAX) return toast.error(`Maximum ${MAX} images allowed`)
    setAdding(true)
    const res = await fetch(`/api/store/${storeId}/gallery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl: newUrl.trim() }),
    })
    const data = await res.json()
    if (data.success) { setGallery(data.gallery); setNewUrl(''); toast.success('Image added!') }
    else toast.error(data.message || 'Failed')
    setAdding(false)
  }

  const deleteImage = async (url: string) => {
    setDeleting(url)
    const res = await fetch(`/api/store/${storeId}/gallery`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ imageUrl: url }),
    })
    const data = await res.json()
    if (data.success) { setGallery(data.gallery); toast.success('Image removed') }
    setDeleting(null)
  }

  const used = gallery.length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: C.text }}>🖼️ Media Gallery</h1>
        <p style={{ color: C.textMuted, fontSize: '0.85rem', marginTop: 4 }}>Upload and manage your store images</p>
      </div>

      {/* Usage Bar */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.text }}>Storage Usage</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: used >= MAX ? C.red : C.pink }}>{used} / {MAX} images</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(used / MAX) * 100}%`, background: used >= MAX ? C.red : `linear-gradient(90deg, #EC4899, #9D174D)`, borderRadius: 4, transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: C.textMuted, marginTop: 8 }}>
          {used >= MAX ? '⛔ Maximum images reached. Delete one to add more.' : `${MAX - used} image slot${MAX - used !== 1 ? 's' : ''} remaining.`}
        </p>
      </div>

      {/* Add Image */}
      {used < MAX && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: C.text, marginBottom: 14 }}>➕ Add Image</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={newUrl} onChange={e => setNewUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addImage()}
              placeholder="Paste image URL (https://...)"
              style={{ flex: 1, padding: '11px 14px', background: '#0D1117', border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontSize: '0.85rem', outline: 'none' }}
            />
            <button onClick={addImage} disabled={adding} style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#EC4899,#9D174D)', border: 'none', borderRadius: 9, color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {adding ? 'Adding...' : '+ Add Image'}
            </button>
          </div>
          {newUrl && (
            <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', height: 100, background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}` }}>
              <img src={newUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? <p style={{ color: C.textMuted }}>Loading gallery...</p> : (
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            Gallery ({gallery.length} image{gallery.length !== 1 ? 's' : ''})
          </p>
          {gallery.length === 0 ? (
            <div style={{ background: C.card, border: `2px dashed rgba(236,72,153,0.2)`, borderRadius: 14, padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🖼️</div>
              <p style={{ color: C.textMuted, fontSize: '0.88rem' }}>No images yet. Add your first gallery image above.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {gallery.map((url, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', border: `1px solid ${C.border}`, background: C.card, cursor: 'pointer', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={url} alt={`Gallery ${i + 1}`} onClick={() => setPreview(url)} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: 8, transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}>
                    <button onClick={() => setPreview(url)} style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, color: '#fff', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>View</button>
                    <button onClick={() => deleteImage(url)} disabled={deleting === url} style={{ padding: '5px 8px', background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: 6, color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}>
                      {deleting === url ? '...' : '🗑'}
                    </button>
                  </div>
                  <div style={{ position: 'absolute', top: 8, left: 8, width: 22, height: 22, background: 'rgba(236,72,153,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>{i + 1}</div>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: MAX - gallery.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{ borderRadius: 12, border: `2px dashed rgba(236,72,153,0.15)`, background: 'rgba(236,72,153,0.02)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>+</span>
                  <span style={{ fontSize: '0.65rem', color: C.textMuted }}>Empty slot</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(8px)', cursor: 'zoom-out' }}>
          <img src={preview} alt="Preview" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: '#fff', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}
    </div>
  )
}
