'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'

const ICONS = ['📁','💼','🛒','📸','🍴','🏥','🏠','💻','🎓','💅','💪','🌐','🎨','📦','⚡','🏨','🍕','💊','🔧','🎪','📚','🌿','🎵','🏗️','✍️']
const COLORS = ['#6366F1','#3B82F6','#22C55E','#F59E0B','#EF4444','#EC4899','#14B8A6','#8B5CF6','#F97316','#0EA5E9']
const EMPTY = { name:'', description:'', icon:'📁', color:'#6366F1' }

export default function AdminCategoriesPage() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categories', { headers: { Authorization:`Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setCategories(data.categories)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name) return alert('Name required')
    setSaving(true)
    const url = editing ? `/api/admin/categories/${editing}` : '/api/admin/categories'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify(form) })
    const data = await res.json()
    if (data.success) {
      editing ? setCategories(c => c.map(x => x._id===editing ? data.category : x)) : setCategories(c => [data.category,...c])
      setForm(EMPTY); setEditing(null); setShowForm(false)
    } else alert(data.message)
    setSaving(false)
  }

  const del = async (id:string) => {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/admin/categories/${id}`, { method:'DELETE', headers:{Authorization:`Bearer ${token}`} })
    setCategories(c => c.filter(x => x._id!==id))
  }

  const startEdit = (cat:any) => { setForm({name:cat.name,description:cat.description||'',icon:cat.icon,color:cat.color}); setEditing(cat._id); setShowForm(true) }

  return (
    <div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.cat-card{transition:transform .2s,box-shadow .2s}.cat-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.15)!important}`}</style>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, animation:'fadeIn .4s ease' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, color:C.text, letterSpacing:'-.02em' }}>📁 Template Categories</h1>
          <p style={{ color:C.textMuted, fontSize:'.84rem', marginTop:4 }}>{categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm) }}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.86rem', cursor:'pointer', boxShadow:`0 4px 16px ${C.purple}40` }}>
          {showForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:24, marginBottom:24, animation:'fadeIn .3s ease' }}>
          <h3 style={{ fontSize:'.95rem', fontWeight:800, color:C.text, marginBottom:20 }}>{editing ? '✏️ Edit Category' : '➕ New Category'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="e.g. Food & Dining"
                style={{ width:'100%', padding:'10px 14px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:'.84rem', outline:'none' }} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Description</label>
              <input value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))} placeholder="Short description..."
                style={{ width:'100%', padding:'10px 14px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:'.84rem', outline:'none' }} />
            </div>
          </div>

          {/* Icon Picker */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:8, textTransform:'uppercase' }}>Icon</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setForm(f => ({...f,icon}))} style={{ width:40, height:40, borderRadius:10, border:`2px solid ${form.icon===icon?form.color:'transparent'}`, background:form.icon===icon?`${form.color}20`:`${C.card2}`, fontSize:'1.2rem', cursor:'pointer', transition:'all .15s' }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:8, textTransform:'uppercase' }}>Color</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {COLORS.map(color => (
                <button key={color} onClick={() => setForm(f => ({...f,color}))} style={{ width:32, height:32, borderRadius:'50%', background:color, border:`3px solid ${form.color===color?'#fff':'transparent'}`, cursor:'pointer', boxShadow:form.color===color?`0 0 12px ${color}`:'none', transition:'all .15s' }} />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{ padding:'12px 16px', background:`${form.color}12`, border:`1px solid ${form.color}25`, borderRadius:10, display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <div style={{ width:44, height:44, background:`${form.color}20`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', border:`1px solid ${form.color}30` }}>{form.icon}</div>
            <div>
              <div style={{ fontWeight:800, color:C.text, fontSize:'.9rem' }}>{form.name || 'Category Name'}</div>
              <div style={{ fontSize:'.75rem', color:form.color, fontWeight:600 }}>{form.description || 'Description'}</div>
            </div>
          </div>

          <button onClick={save} disabled={saving} style={{ padding:'11px 28px', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.88rem', cursor:'pointer' }}>
            {saving ? 'Saving...' : editing ? 'Update' : 'Create Category'}
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? <div style={{ textAlign:'center', padding:60, color:C.textMuted }}>Loading...</div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
          {categories.map((cat,i) => (
            <div key={cat._id} className="cat-card" style={{ background:C.card, border:`1px solid ${cat.color}25`, borderRadius:14, padding:20, position:'relative', overflow:'hidden', animation:`fadeIn .3s ease ${i*40}ms both` }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:cat.color }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div style={{ width:48, height:48, background:`${cat.color}15`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', border:`1px solid ${cat.color}25` }}>{cat.icon}</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => startEdit(cat)} style={{ padding:'5px 10px', borderRadius:7, fontSize:'.7rem', fontWeight:700, cursor:'pointer', background:`${C.blue}12`, border:'none', color:'#60A5FA' }}>Edit</button>
                  <button onClick={() => del(cat._id)} style={{ padding:'5px 10px', borderRadius:7, fontSize:'.7rem', fontWeight:700, cursor:'pointer', background:`${C.red}10`, border:'none', color:C.red }}>🗑</button>
                </div>
              </div>
              <div style={{ fontSize:'.95rem', fontWeight:800, color:C.text, marginBottom:4 }}>{cat.name}</div>
              <div style={{ fontSize:'.75rem', color:C.textMuted, marginBottom:8 }}>{cat.description || 'No description'}</div>
              <div style={{ fontSize:'.68rem', fontWeight:700, color:cat.color }}>/{cat.slug}</div>
            </div>
          ))}
          {categories.length===0 && <p style={{ color:C.textMuted, gridColumn:'1/-1', textAlign:'center', padding:40 }}>No categories yet.</p>}
        </div>
      )}
    </div>
  )
}
