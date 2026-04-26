'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MobileNavProps {
    navLinks: [string, string][]
    activeSection: string
    navScrolled: boolean
}

export default function MobileNav({ navLinks, activeSection, navScrolled }: MobileNavProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [mobileMenuOpen])

    // Fixed navigation items matching biznesso.vip
    const mainNavItems = [
        { label: 'Home', href: '/' },
        { label: 'Templates', href: '#templates', hasDropdown: true },
        { label: 'Listings', href: '#listings' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Pages', href: '#pages', hasDropdown: true },
        { label: 'Blog', href: '#blog' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
    ]

    return (
        <>
            <style>{`
                @keyframes navFadeDown {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInFromRight {
                    from { opacity: 0; transform: translateX(100%); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                
                .nav-link {
                    position: relative;
                    color: #111;
                    text-decoration: none;
                    font-size: 0.95rem;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .nav-link:hover {
                    color: #ff6b6b;
                    background: rgba(255,107,107,0.08);
                }
                
                .nav-link.active {
                    color: #ff6b6b;
                    font-weight: 600;
                }
                
                .language-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 14px;
                    background: none;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    color: #111;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .language-btn:hover {
                    border-color: #ff6b6b;
                    color: #ff6b6b;
                }
                
                .login-btn {
                    padding: 10px 24px;
                    background: #ff6b6b;
                    color: #fff;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(255,107,107,0.25);
                }
                
                .login-btn:hover {
                    background: #ff5252;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255,107,107,0.35);
                }
                
                .mobile-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    color: #374151;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 500;
                    border-radius: 8px;
                    transition: all 0.18s ease;
                }
                
                .mobile-nav-link:hover, .mobile-nav-link.active {
                    background: #fff5f5;
                    color: #ff6b6b;
                }
                
                .hamburger {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    cursor: pointer;
                    padding: 8px;
                    z-index: 1001;
                }
                
                .hamburger span {
                    width: 24px;
                    height: 2.5px;
                    background: #111;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }
                
                .hamburger.open span:nth-child(1) {
                    transform: rotate(45deg) translate(7px, 7px);
                }
                
                .hamburger.open span:nth-child(2) {
                    opacity: 0;
                }
                
                .hamburger.open span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -7px);
                }
            `}</style>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                padding: '0 6%',
                height: 70,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: navScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderBottom: navScrolled ? '1px solid rgba(0,0,0,.08)' : '1px solid rgba(255,255,255,.5)',
                boxShadow: navScrolled ? '0 2px 16px rgba(0,0,0,.06)' : 'none',
                transition: 'all .35s ease',
                animation: 'navFadeDown .5s ease',
            }}>

                {/* LEFT — Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, zIndex: 1001 }}>
                    <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#111', fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
                        Webra<span style={{ color: '#ff6b6b' }}>zeo</span>
                    </div>
                </Link>

                {/* CENTER — Desktop Navigation */}
                {!isMobile && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                    }}>
                        {mainNavItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`nav-link${activeSection === item.href.slice(1) ? ' active' : ''}`}
                            >
                                {item.label}
                                {item.hasDropdown && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </a>
                        ))}
                    </div>
                )}

                {/* RIGHT — Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {!isMobile && (
                        <>
                            {/* Language Selector */}
                            <button className="language-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="2" y1="12" x2="22" y2="12"/>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                </svg>
                                English
                            </button>
                            
                            {/* Login Button - NOT CHANGED */}
                            <Link href="/login" className="login-btn">
                                Login
                            </Link>
                        </>
                    )}

                    {/* Mobile Hamburger */}
                    {isMobile && (
                        <div 
                            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── MOBILE MENU ── */}
            {isMobile && mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 70,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(20px)',
                    zIndex: 199,
                    padding: '24px 6%',
                    overflowY: 'auto',
                    animation: 'slideInFromRight 0.3s ease',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {mainNavItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`mobile-nav-link${activeSection === item.href.slice(1) ? ' active' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span style={{ fontSize: '1.2rem' }}>
                                    {item.label === 'Home' ? '🏠' : 
                                     item.label === 'Templates' ? '🎨' : 
                                     item.label === 'Listings' ? '📋' :
                                     item.label === 'Pricing' ? '💎' : 
                                     item.label === 'Pages' ? '📄' :
                                     item.label === 'Blog' ? '📝' :
                                     item.label === 'FAQ' ? '❓' :
                                     item.label === 'Contact' ? '📧' : '→'}
                                </span>
                                {item.label}
                            </a>
                        ))}
                        
                        <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
                        
                        <Link href="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                            Login
                        </Link>
                        
                        <Link href="/signup" style={{
                            padding: '14px 24px',
                            background: '#ff6b6b',
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: 8,
                            textAlign: 'center',
                            marginTop: 8,
                        }} onClick={() => setMobileMenuOpen(false)}>
                            Get Started Free
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}
