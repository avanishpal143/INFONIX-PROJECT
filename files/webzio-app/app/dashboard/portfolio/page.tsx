'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../stores/authStore'

interface PortfolioTemplate {
    _id: string
    name: string
    category: string
    icon: string
    desc: string
    color: string
    accentColor: string
    tags: string[]
    popular: boolean
    isActive: boolean
    previewImage?: string
    templateType: string
}

interface Store {
    _id: string
    siteName: string
    slug: string
}

export default function PortfolioPage() {
    const router = useRouter()
    const { token } = useAuthStore()
    const [templates, setTemplates] = useState<PortfolioTemplate[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showStoreSelector, setShowStoreSelector] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    useEffect(() => {
        async function loadData() {
            try {
                // Load portfolio templates
                const templatesRes = await fetch('/api/admin/templates?type=portfolio', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const templatesData = await templatesRes.json()
                if (templatesData.success) {
                    const activeTemplates = templatesData.templates.filter((t: PortfolioTemplate) => t.isActive)
                    setTemplates(activeTemplates)
                }

                // Load user's stores
                const storesRes = await fetch('/api/websites', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const storesData = await storesRes.json()
                if (storesData.success) {
                    setStores(storesData.websites)
                }
            } catch (error) {
                console.error('Failed to load data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [token])

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>🖼️</div>
                    <div style={{ color: '#64748b', fontSize: '.9rem' }}>Loading portfolio templates...</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .portfolio-card { transition: transform .25s, box-shadow .25s; }
        .portfolio-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(236,72,153,.15); }
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-.02em' }}>
                    🖼️ Portfolio Templates
                </h1>
                <p style={{ color: '#64748b', fontSize: '.9rem' }}>
                    Choose from {templates.length} professional portfolio templates. Perfect for showcasing your work.
                </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 28 }}>
                <input
                    type="text"
                    placeholder="🔍  Search portfolio templates..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', width: 300, background: '#fff' }}
                />
            </div>

            {/* Count */}
            <p style={{ color: '#94a3b8', fontSize: '.82rem', marginBottom: 20 }}>
                Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {filtered.map(t => (
                    <div key={t._id} className="portfolio-card" style={{ background: '#fff', border: '1px solid rgba(236,72,153,.15)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
                        {/* Preview */}
                        <div style={{ height: 110, background: t.color || 'linear-gradient(135deg,#EC4899,#9D174D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
                            {t.previewImage ? (
                                <img src={t.previewImage} alt={t.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                t.icon || '🖼️'
                            )}
                            {t.popular && (
                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(245,158,11,.9)', color: '#fff', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 800 }}>
                                    🔥 Popular
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(236,72,153,.3)', padding: '2px 8px', borderRadius: 20, fontSize: '.6rem', fontWeight: 700, color: '#fff', border: '1px solid rgba(236,72,153,.4)' }}>
                                Portfolio
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: '.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>{t.name}</div>
                            <div style={{ fontSize: '.72rem', color: '#F9A8D4', fontWeight: 700, marginBottom: 6 }}>{t.category}</div>
                            <div style={{ fontSize: '.72rem', color: '#64748b', marginBottom: 10, lineHeight: 1.5 }}>{t.desc}</div>

                            {/* Tags */}
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                                {t.tags.slice(0, 3).map(tag => (
                                    <span key={tag} style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(236,72,153,.1)', color: '#F9A8D4', border: '1px solid rgba(236,72,153,.2)' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Use Button */}
                            <Link
                                href={stores.length > 0 ? `/dashboard/stores/${stores[0]._id}/edit` : `/dashboard/stores?openModal=true&template=${t._id}`}
                                style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'linear-gradient(135deg,#EC4899,#9D174D)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '.8rem', boxShadow: '0 3px 10px rgba(236,72,153,.25)' }}
                                onClick={(e) => {
                                    if (stores.length > 1) {
                                        e.preventDefault()
                                        setSelectedTemplate(t._id)
                                        setShowStoreSelector(true)
                                    }
                                }}
                            >
                                {stores.length > 0 ? 'Configure Store →' : 'Use This Template →'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>No portfolio templates found</div>
                    <div style={{ fontSize: '.85rem' }}>Try a different search or check back later</div>
                </div>
            )}

            {/* Store Selector Modal */}
            {showStoreSelector && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowStoreSelector(false)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Select Store to Configure</h2>
                        <p style={{ color: '#64748b', fontSize: '.9rem', marginBottom: 24 }}>Choose which store you want to configure with this template</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {stores.map(store => (
                                <Link
                                    key={store._id}
                                    href={`/dashboard/stores/${store._id}/edit`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        transition: 'all .2s',
                                        background: '#fff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#EC4899'
                                        e.currentTarget.style.background = '#fdf2f8'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb'
                                        e.currentTarget.style.background = '#fff'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{store.siteName}</div>
                                        <div style={{ fontSize: '.75rem', color: '#64748b' }}>/{store.slug}</div>
                                    </div>
                                    <div style={{ fontSize: '1.2rem' }}>→</div>
                                </Link>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowStoreSelector(false)}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                padding: '12px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: 10,
                                color: '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '.9rem'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
