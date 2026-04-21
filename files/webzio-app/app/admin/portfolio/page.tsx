'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'

const EMPTY: any = {
  name:'', category:'', icon:'🖼️', desc:'',
  color:'linear-gradient(135deg,#EC4899,#9D174D)', accentColor:'#EC4899',
  tags:'', popular:false, isActive:true, previewImage:'', templateType:'portfolio',
  // Portfolio-specific fields
  sections: {
    hero: { show:true, title:'', subtitle:'', bgImage:'' },
    about: { show:true, bio:'', photo:'', location:'', available:true },
    skills: { show:true, items:'' },
    experience: { show:true, items:'' },
    education: { show:true, items:'' },
    projects: { show:true, items:'' },
    stats: { show:true, items:'' },
    links: { show:true, github:'', linkedin:'', twitter:'', website:'', instagram:'' },
    contact: { show:true, email:'', phone:'' },
  }
}

export default function AdminPortfolioPage() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/templates?type=portfolio', { headers: { Authorization:`Bearer ${token}` } })
    const data = await res.json()
    if (data.success) setTemplates(data.templates)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name || !form.category) return alert('Name and category required')
    setSaving(true)
    const body = { ...form, templateType:'portfolio', tags: form.tags.split(',').map((t:string) => t.trim()).filter(Boolean) }
    const url = editing ? `/api/admin/templates/${editing}` : '/api/admin/templates'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      editing ? setTemplates(t => t.map(x => x._id===editing ? data.template : x)) : setTemplates(t => [data.template,...t])
      setForm(EMPTY); setEditing(null); setShowForm(false); setActiveTab('basic')
    }
    setSaving(false)
  }

  const toggleStatus = async (id:string, cur:boolean) => {
    await fetch(`/api/admin/templates/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify({isActive:!cur}) })
    setTemplates(t => t.map(x => x._id===id ? {...x,isActive:!cur} : x))
  }

  const del = async (id:string) => {
    if (!confirm('Delete this portfolio template?')) return
    await fetch(`/api/admin/templates/${id}`, { method:'DELETE', headers:{Authorization:`Bearer ${token}`} })
    setTemplates(t => t.filter(x => x._id!==id))
  }

  const startEdit = (t:any) => {
    setForm({...EMPTY,...t, tags:(t.tags||[]).join(', '), sections:{...EMPTY.sections,...(t.sections||{})}})
    setEditing(t._id); setShowForm(true); setActiveTab('basic')
  }

  const inp = { width:'100%', padding:'9px 12px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:'.83rem', outline:'none', fontFamily:'inherit' }
  const setSection = (sec:string, key:string, val:any) => setForm((f:any) => ({...f, sections:{...f.sections, [sec]:{...f.sections[sec],[key]:val}}}))

  const TABS = [
    {id:'basic',label:'Basic Info'},
    {id:'hero',label:'Hero'},
    {id:'about',label:'About'},
    {id:'skills',label:'Skills'},
    {id:'experience',label:'Experience'},
    {id:'education',label:'Education'},
    {id:'projects',label:'Projects'},
    {id:'stats',label:'Stats'},
    {id:'links',label:'Links'},
    {id:'contact',label:'Contact'},
  ]

  return (
    <div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.ptpl-card{transition:transform .2s,box-shadow .2s}.ptpl-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(236,72,153,.15)!important}`}</style>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, animation:'fadeIn .4s ease' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, color:C.text, letterSpacing:'-.02em' }}>🖼️ Portfolio Templates</h1>
          <p style={{ color:C.textMuted, fontSize:'.84rem', marginTop:4 }}>Manage portfolio templates with full section control. {templates.length} templates</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(!showForm); setActiveTab('basic') }}
          style={{ padding:'10px 20px', background:'linear-gradient(135deg,#EC4899,#9D174D)', border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.86rem', cursor:'pointer', boxShadow:'0 4px 16px rgba(236,72,153,.4)' }}>
          {showForm ? '✕ Cancel' : '+ Add Portfolio Template'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background:C.card, border:`1px solid rgba(236,72,153,.2)`, borderRadius:16, padding:24, marginBottom:24, animation:'fadeIn .3s ease' }}>
          <h3 style={{ fontSize:'.95rem', fontWeight:800, color:C.text, marginBottom:16 }}>{editing ? '✏️ Edit Portfolio Template' : '➕ New Portfolio Template'}</h3>

          {/* Tabs */}
          <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding:'7px 14px', borderRadius:8, fontSize:'.75rem', fontWeight:700, cursor:'pointer', background:activeTab===tab.id?'rgba(236,72,153,.2)':C.card2, border:`1px solid ${activeTab===tab.id?'rgba(236,72,153,.5)':C.border}`, color:activeTab===tab.id?'#F9A8D4':C.textMuted, transition:'all .15s' }}>{tab.label}</button>
            ))}
          </div>

          {/* Basic Info */}
          {activeTab==='basic' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {[{label:'Template Name *',key:'name',placeholder:'e.g. Creative Developer'},{label:'Category *',key:'category',placeholder:'e.g. Portfolio'},{label:'Icon',key:'icon',placeholder:'🖼️'},{label:'Description',key:'desc',placeholder:'What this template offers...'},{label:'Tags (comma-sep)',key:'tags',placeholder:'Gallery, Creative, Hire'},{label:'Preview Image URL',key:'previewImage',placeholder:'https://...'}].map(({label,key,placeholder}) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>{label}</label>
                  <input style={inp} value={form[key]} onChange={e => setForm((f:any) => ({...f,[key]:e.target.value}))} placeholder={placeholder} />
                </div>
              ))}
              <div style={{ display:'flex', gap:20, gridColumn:'1/-1', marginTop:4 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.84rem', color:C.text, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.popular} onChange={e => setForm((f:any) => ({...f,popular:e.target.checked}))} /> Popular
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.84rem', color:C.text, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm((f:any) => ({...f,isActive:e.target.checked}))} /> Active
                </label>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeTab==='hero' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Hero Title</label><input style={inp} value={form.sections.hero.title} onChange={e => setSection('hero','title',e.target.value)} placeholder="Hi, I'm John Doe" /></div>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Hero Subtitle</label><input style={inp} value={form.sections.hero.subtitle} onChange={e => setSection('hero','subtitle',e.target.value)} placeholder="Full Stack Developer & Designer" /></div>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Background Image URL</label><input style={inp} value={form.sections.hero.bgImage} onChange={e => setSection('hero','bgImage',e.target.value)} placeholder="https://..." /></div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.84rem', color:C.text, cursor:'pointer' }}><input type="checkbox" checked={form.sections.hero.show} onChange={e => setSection('hero','show',e.target.checked)} /> Show Hero Section</label></div>
            </div>
          )}

          {/* About Section */}
          {activeTab==='about' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Bio / About Text</label><textarea style={{...inp, resize:'vertical'}} rows={4} value={form.sections.about.bio} onChange={e => setSection('about','bio',e.target.value)} placeholder="Write a short bio about yourself..." /></div>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Profile Photo URL</label><input style={inp} value={form.sections.about.photo} onChange={e => setSection('about','photo',e.target.value)} placeholder="https://..." /></div>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Location</label><input style={inp} value={form.sections.about.location} onChange={e => setSection('about','location',e.target.value)} placeholder="Mumbai, India" /></div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.84rem', color:C.text, cursor:'pointer' }}><input type="checkbox" checked={form.sections.about.available} onChange={e => setSection('about','available',e.target.checked)} /> Available for Work</label></div>
            </div>
          )}

          {/* Skills */}
          {activeTab==='skills' && (
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Skills (comma-separated)</label>
              <textarea style={{...inp, resize:'vertical'}} rows={4} value={form.sections.skills.items} onChange={e => setSection('skills','items',e.target.value)} placeholder="React, Node.js, TypeScript, MongoDB, AWS, Docker..." />
              <p style={{ fontSize:'.72rem', color:C.textMuted, marginTop:6 }}>Enter skills separated by commas. Each will be shown as a skill badge.</p>
            </div>
          )}

          {/* Experience */}
          {activeTab==='experience' && (
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Work Experience (one per line: Title | Company | Duration | Description)</label>
              <textarea style={{...inp, resize:'vertical'}} rows={6} value={form.sections.experience.items} onChange={e => setSection('experience','items',e.target.value)} placeholder={'Senior Developer | Google | 2022-Present | Led team of 5 engineers\nFrontend Dev | Startup | 2020-2022 | Built React applications'} />
            </div>
          )}

          {/* Education */}
          {activeTab==='education' && (
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Education (one per line: Degree | Institution | Year | Grade)</label>
              <textarea style={{...inp, resize:'vertical'}} rows={5} value={form.sections.education.items} onChange={e => setSection('education','items',e.target.value)} placeholder={'B.Tech Computer Science | IIT Delhi | 2020 | 8.5 CGPA\n12th Science | DPS | 2016 | 95%'} />
            </div>
          )}

          {/* Projects */}
          {activeTab==='projects' && (
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Projects (one per line: Name | Description | Tech Stack | URL)</label>
              <textarea style={{...inp, resize:'vertical'}} rows={6} value={form.sections.projects.items} onChange={e => setSection('projects','items',e.target.value)} placeholder={'Portfolio Website | Personal portfolio | React,Next.js | https://...\nE-commerce App | Full stack shop | Node,MongoDB | https://...'} />
            </div>
          )}

          {/* Stats */}
          {activeTab==='stats' && (
            <div>
              <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Stats / Numbers (one per line: Label | Value | Icon)</label>
              <textarea style={{...inp, resize:'vertical'}} rows={5} value={form.sections.stats.items} onChange={e => setSection('stats','items',e.target.value)} placeholder={'Projects Completed | 50+ | 🚀\nHappy Clients | 30+ | 😊\nYears Experience | 5+ | ⭐\nCoffee Cups | 1000+ | ☕'} />
            </div>
          )}

          {/* Links */}
          {activeTab==='links' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[{label:'GitHub URL',key:'github',placeholder:'https://github.com/username'},{label:'LinkedIn URL',key:'linkedin',placeholder:'https://linkedin.com/in/username'},{label:'Twitter / X URL',key:'twitter',placeholder:'https://twitter.com/username'},{label:'Personal Website',key:'website',placeholder:'https://yoursite.com'},{label:'Instagram URL',key:'instagram',placeholder:'https://instagram.com/username'}].map(({label,key,placeholder}) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>{label}</label>
                  <input style={inp} value={form.sections.links[key]} onChange={e => setSection('links',key,e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          {activeTab==='contact' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Email</label><input style={inp} value={form.sections.contact.email} onChange={e => setSection('contact','email',e.target.value)} placeholder="hello@example.com" /></div>
              <div><label style={{ display:'block', fontSize:'.7rem', fontWeight:700, color:C.textMuted, marginBottom:5, textTransform:'uppercase' }}>Phone</label><input style={inp} value={form.sections.contact.phone} onChange={e => setSection('contact','phone',e.target.value)} placeholder="+91 99999 99999" /></div>
            </div>
          )}

          <button onClick={save} disabled={saving} style={{ marginTop:20, padding:'11px 28px', background:'linear-gradient(135deg,#EC4899,#9D174D)', border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.88rem', cursor:'pointer' }}>
            {saving ? 'Saving...' : editing ? 'Update Template' : 'Create Portfolio Template'}
          </button>
        </div>
      )}

      {/* Cards */}
      {loading ? <div style={{ textAlign:'center', padding:60, color:C.textMuted }}>Loading...</div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {templates.map((t,i) => (
            <div key={t._id} className="ptpl-card" style={{ background:C.card, border:`1px solid rgba(236,72,153,.15)`, borderRadius:14, overflow:'hidden', animation:`fadeIn .3s ease ${i*40}ms both` }}>
              <div style={{ height:110, background:t.color||'linear-gradient(135deg,#EC4899,#9D174D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', position:'relative' }}>
                {t.previewImage ? <img src={t.previewImage} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} /> : t.icon}
                <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:4 }}>
                  {t.popular && <span style={{ fontSize:'.6rem', fontWeight:800, background:'rgba(245,158,11,.9)', color:'#000', padding:'2px 8px', borderRadius:20 }}>⭐</span>}
                  <span style={{ fontSize:'.6rem', fontWeight:800, padding:'2px 8px', borderRadius:20, background:t.isActive?'rgba(34,197,94,.9)':'rgba(239,68,68,.9)', color:'#fff' }}>{t.isActive?'Active':'Off'}</span>
                </div>
                <div style={{ position:'absolute', bottom:8, left:8, background:'rgba(236,72,153,.3)', padding:'2px 8px', borderRadius:20, fontSize:'.6rem', fontWeight:700, color:'#fff', border:'1px solid rgba(236,72,153,.4)' }}>Portfolio</div>
              </div>
              <div style={{ padding:'12px 14px' }}>
                <div style={{ fontSize:'.88rem', fontWeight:800, color:C.text, marginBottom:3 }}>{t.name}</div>
                <div style={{ fontSize:'.72rem', color:'#F9A8D4', fontWeight:700, marginBottom:6 }}>{t.category}</div>
                <div style={{ fontSize:'.72rem', color:C.textMuted, marginBottom:10, lineHeight:1.5 }}>{t.desc}</div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
                  {(t.tags||[]).slice(0,3).map((tag:string) => <span key={tag} style={{ fontSize:'.6rem', fontWeight:700, padding:'2px 8px', borderRadius:20, background:'rgba(236,72,153,.1)', color:'#F9A8D4', border:'1px solid rgba(236,72,153,.2)' }}>{tag}</span>)}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => startEdit(t)} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer', background:'rgba(236,72,153,.1)', border:'none', color:'#F9A8D4' }}>Edit</button>
                  <button onClick={() => toggleStatus(t._id,t.isActive)} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer', background:t.isActive?`${C.red}10`:`${C.green}10`, border:'none', color:t.isActive?C.red:C.green }}>{t.isActive?'Disable':'Enable'}</button>
                  <button onClick={() => del(t._id)} style={{ padding:'7px 10px', borderRadius:8, fontSize:'.72rem', cursor:'pointer', background:`${C.red}10`, border:'none', color:C.red }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
          {templates.length===0 && <p style={{ color:C.textMuted, gridColumn:'1/-1', textAlign:'center', padding:40 }}>No portfolio templates yet. Add your first one!</p>}
        </div>
      )}
    </div>
  )
}
