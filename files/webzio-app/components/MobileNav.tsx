'use client'
import Link from 'next/link'
import { useState } from 'react'

interface MobileNavProps {
    navLinks: [string, string][]
    activeSection: string
    navScrolled: boolean
}

export default function MobileNav({ navLinks, activeSection, navScrolled }: MobileNavProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-user-icon { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
          .mobile-user-icon { display: none !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

            {/* Navigation Bar */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, background: navScrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', borderBottom: navScrolled ? '1px solid #f0f0f0' : '1px solid transparent', padding: '0 4%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .35s ease', boxShadow: navScrolled ? '0 4px 24px rgba(0,0,0,.06)' : 'none' }}>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-.03em', fontFamily: '"Playfair Display",serif', animation: 'slideDown .5s ease' }}>
                    Hospitality<span style={{ color: '#4f46e5' }}>Core</span>
                </div>

                {/* Desktop Navigation */}
                <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center', marginLeft: 'auto', marginRight: '40px' }}>
                    {navLinks.map(([l, h]) => (
                        <a key={l} href={h} className={`nav-a${activeSection === h.slice(1) ? ' active' : ''}`} style={{ color: '#374151', textDecoration: 'none', fontSize: '.88rem', fontWeight: 500, transition: 'color .2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                        >{l}</a>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="desktop-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Link href="/login" style={{ padding: '8px 20px', color: '#374151', textDecoration: 'none', fontSize: '.88rem', fontWeight: 500, borderRadius: 8, transition: 'background .2s', display: 'flex', alignItems: 'center', gap: 6 }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Log in
                    </Link>
                    <Link href="/signup" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: '.88rem', fontWeight: 600, boxShadow: '0 4px 14px rgba(99,102,241,.35)', display: 'inline-block', transition: 'transform .2s, box-shadow .2s' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)'
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,.4)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,.35)'
                        }}
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Actions */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {/* Mobile User Icon */}
                    <Link href="/login" className="mobile-user-icon" style={{ display: 'none', width: 36, height: 36, background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </Link>

                    {/* Mobile Hamburger Menu */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ display: 'none', width: 36, height: 36, background: 'transparent', border: 'none', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                        <span style={{ width: 22, height: 2, background: '#4f46e5', borderRadius: 2, transition: 'all .3s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }}></span>
                        <span style={{ width: 22, height: 2, background: '#4f46e5', borderRadius: 2, transition: 'all .3s', opacity: mobileMenuOpen ? 0 : 1 }}></span>
                        <span style={{ width: 22, height: 2, background: '#4f46e5', borderRadius: 2, transition: 'all .3s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199, animation: 'fadeIn .3s ease' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ position: 'absolute', top: 0, right: 0, width: '75%', maxWidth: 300, height: '100%', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', padding: '24px', animation: 'slideInRight .3s ease' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {navLinks.map(([l, h]) => (
                                <a
                                    key={l}
                                    href={h}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ color: '#111', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '12px 16px', borderRadius: 8, transition: 'background .2s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f5f3ff')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {l}
                                </a>
                            ))}
                            <div style={{ height: 1, background: '#e5e7eb', margin: '12px 0' }}></div>
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '12px 16px', borderRadius: 8, textAlign: 'center', border: '2px solid #4f46e5' }}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ padding: '12px 16px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: '1rem', fontWeight: 700, textAlign: 'center', boxShadow: '0 4px 14px rgba(79,70,229,.35)' }}
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
