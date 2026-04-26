'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface TemplateData {
  _id: string
  name: string
  category: string
  icon: string
  desc: string
  color: string
  accentColor: string
  tags: string[]
  popular: boolean
  previewImage: string
  config: any
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates')
        const data = await res.json()
        if (data.success) {
          setTemplates(data.templates)
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.templates.map((t: TemplateData) => t.category)))
          setCategories(uniqueCategories as string[])
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: '1.2rem', color: '#6b7280', fontWeight: 600 }}>Loading templates...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .template-card-wrapper { animation: fadeInUp 0.8s ease both; }
        .template-card-wrapper:nth-child(1) { animation-delay: 0ms; }
        .template-card-wrapper:nth-child(2) { animation-delay: 100ms; }
        .template-card-wrapper:nth-child(3) { animation-delay: 200ms; }
        .template-card-wrapper:nth-child(4) { animation-delay: 300ms; }
        .template-card-wrapper:nth-child(5) { animation-delay: 400ms; }
        .template-card-wrapper:nth-child(6) { animation-delay: 500ms; }
        .template-card-wrapper:nth-child(7) { animation-delay: 600ms; }
        .template-card-wrapper:nth-child(8) { animation-delay: 700ms; }
        .template-card-wrapper:nth-child(9) { animation-delay: 800ms; }
        .category-btn {
          transition: all 0.3s ease;
        }
        .category-btn:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 1024px) {
          .templates-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .templates-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header Section */}
      <div style={{ padding: '80px 6% 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative Background */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'fadeInUp 0.8s ease both' }}>
          <p style={{ color: '#ff6b6b', fontSize: '1rem', fontWeight: 600, marginBottom: 16, letterSpacing: '0.02em' }}>
            {templates.length} Professional Templates
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: '#111', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.03em' }}>
            Choose Your Perfect Template
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 700, margin: '0 auto 40px' }}>
            Browse our collection of professionally designed templates. Each one is fully customizable and optimized for your business needs.
          </p>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            <button
              className="category-btn"
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                border: selectedCategory === 'all' ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                background: selectedCategory === 'all' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#fff',
                color: selectedCategory === 'all' ? '#fff' : '#6b7280',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: selectedCategory === 'all' ? '0 4px 14px rgba(79, 70, 229, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              All Templates ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className="category-btn"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  border: selectedCategory === cat ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                  background: selectedCategory === cat ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#fff',
                  color: selectedCategory === cat ? '#fff' : '#6b7280',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: selectedCategory === cat ? '0 4px 14px rgba(79, 70, 229, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                {cat} ({templates.filter(t => t.category === cat).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div style={{ padding: '0 6% 80px' }}>
        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', marginBottom: 8 }}>No templates found</h3>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>Try selecting a different category</p>
          </div>
        ) : (
          <div className="templates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, maxWidth: 1300, margin: '0 auto' }}>
            {filteredTemplates.map((template) => (
              <TemplateCard key={template._id} template={template} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div style={{ padding: '60px 6%', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', marginBottom: 16, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Ready to Build Your Website?
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          Choose a template and start building your professional website in minutes
        </p>
        <Link
          href="/signup"
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: '#fff',
            color: '#4f46e5',
            borderRadius: 14,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}
        >
          Get Started Free →
        </Link>
      </div>
    </div>
  )
}

// Template Card Component (same as homepage)
function TemplateCard({ template }: { template: TemplateData }) {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !isHovered) return
    
    let pos = 0
    let dir = 1
    const speed = 0.8
    let raf: number

    const animate = () => {
      pos += speed * dir
      const maxScroll = el.scrollHeight - el.clientHeight
      if (pos >= maxScroll) { dir = -1; pos = maxScroll }
      if (pos <= 0) { dir = 1; pos = 0 }
      el.scrollTop = pos
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [isHovered])

  return (
    <div
      className="template-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
    >
      <div style={{
        position: 'relative',
        height: 420,
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        padding: 20,
        boxShadow: isHovered ? '0 25px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: template.color, opacity: 0.05, transition: 'opacity 0.5s ease', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '-50%', left: isHovered ? '150%' : '-50%', width: '50%', height: '200%', background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)', transform: 'rotate(25deg)', transition: 'left 0.7s ease', pointerEvents: 'none', zIndex: 2 }} />
        
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111', marginBottom: 6, fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
              {template.name}
            </h3>
            <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.03em', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
              {template.category}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div style={{ background: '#f3f4f6', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 4, padding: '3px 8px', fontSize: '0.6rem', color: '#9ca3af' }}>
                {template.name.toLowerCase().replace(/\s+/g, '')}.webrazeo.com
              </div>
            </div>

            <div ref={scrollRef} style={{ height: 'calc(100% - 33px)', position: 'relative', overflow: 'hidden', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.template-card-wrapper div::-webkit-scrollbar { display: none; }`}</style>
              <LivePreview template={template} />
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: isHovered ? 'auto' : 'none', zIndex: 3 }}>
            <Link href="/signup" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)', border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(79, 70, 229, 0.5)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.4)' }}>
              Use This Template →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Live Preview Component (same as homepage)
function LivePreview({ template }: { template: TemplateData }) {
  const cfg = template.config || {}
  const primary = cfg.primaryColor || template.accentColor || '#4F46E5'
  const secondary = cfg.secondaryColor || '#7C3AED'
  const textColor = cfg.textColor || '#111827'
  const bgLight = cfg.bgLight || '#FFFFFF'
  const cardBg = cfg.cardBg || '#F8FAFF'

  return (
    <div style={{ minHeight: '200%', background: bgLight }}>
      <div style={{ padding: '12px 16px', background: primary, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.25)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{template.icon}</div>
          <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#fff' }}>{template.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Home', 'About', 'Services', 'Contact'].map((item, i) => (
            <div key={i} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>{item}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: '32px 16px', background: `linear-gradient(135deg, ${primary}, ${secondary})`, textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{template.category}</div>
        <h2 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: 8 }}>{cfg.heroTitle || template.name}</h2>
        <p style={{ fontSize: '0.7rem', opacity: 0.85, marginBottom: 16 }}>{cfg.heroSubtitle || template.desc}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.9)', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, color: primary }}>Get Started</div>
          <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)' }}>Learn More</div>
        </div>
      </div>
      <div style={{ padding: '24px 16px', background: cardBg }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: textColor, marginBottom: 16, textAlign: 'center' }}>Our Features</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[{icon:'⚡',title:'Fast'},{icon:'🎨',title:'Beautiful'},{icon:'📱',title:'Mobile'}].map((f, i) => (
            <div key={i} style={{ padding: 12, background: bgLight, borderRadius: 8, border: `1px solid ${primary}20`, textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: textColor }}>{f.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 16px', background: bgLight }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: textColor, marginBottom: 16, textAlign: 'center' }}>Our Services</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{icon:'🛠️',title:'Custom Solutions'},{icon:'📊',title:'Analytics'},{icon:'🔒',title:'Security'},{icon:'🚀',title:'Fast Delivery'}].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: cardBg, borderRadius: 8, border: `1px solid ${primary}15` }}>
              <div style={{ width: 32, height: 32, background: `${primary}20`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: textColor }}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 16px', background: `${primary}08` }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: textColor, marginBottom: 16, textAlign: 'center' }}>What Clients Say</div>
        {[{name:'Rahul S.',text:'Amazing template!'},{name:'Priya M.',text:'Professional and easy!'}].map((t, i) => (
          <div key={i} style={{ padding: 14, background: bgLight, borderRadius: 8, border: `1px solid ${primary}15`, marginBottom: 10 }}>
            <div style={{ color: '#f59e0b', fontSize: '0.7rem', marginBottom: 6 }}>★★★★★</div>
            <p style={{ fontSize: '0.65rem', color: `${textColor}80`, marginBottom: 10, fontStyle: 'italic' }}>"{t.text}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, background: primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>{t.name[0]}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: textColor }}>{t.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '32px 16px', background: `${primary}10`, textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: textColor, marginBottom: 8 }}>Ready to Get Started?</div>
        <div style={{ fontSize: '0.65rem', color: `${textColor}70`, marginBottom: 16 }}>Join thousands of happy customers</div>
        <div style={{ padding: '10px 24px', background: primary, borderRadius: 8, display: 'inline-block', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>Get Started Now</div>
      </div>
      <div style={{ padding: '20px 16px', background: '#1f2937' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Column {i}</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Link One</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>Link Two</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>© 2026 {template.name}. All rights reserved.</div>
      </div>
    </div>
  )
}
