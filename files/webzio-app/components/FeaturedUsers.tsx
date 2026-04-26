'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FeaturedWebsite {
  _id: string
  siteName: string
  slug: string
  logo: string
  heroTitle: string
  primaryColor: string
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
  views: number
  createdAt: string
  owner: {
    name: string
    email: string
  }
  websiteUrl: string
}

const socialIcons = {
  facebook: '📘',
  twitter: '🐦',
  linkedin: '💼',
  instagram: '📸',
  youtube: '▶️',
}

export default function FeaturedUsers() {
  const [websites, setWebsites] = useState<FeaturedWebsite[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const res = await fetch('/api/featured-websites')
        const data = await res.json()
        if (data.success) {
          setWebsites(data.websites)
        }
      } catch (error) {
        console.error('Error fetching featured websites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWebsites()
  }, [])

  const itemsPerView = 4
  const maxIndex = Math.max(0, websites.length - itemsPerView)

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.max(0, prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  if (loading) {
    return (
      <section style={{ padding: '80px 6%', background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading featured websites...</div>
      </section>
    )
  }

  if (websites.length === 0) {
    return null
  }

  return (
    <section
      style={{
        padding: '80px 6% 90px',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        .user-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }

        .user-card:hover .website-preview {
          transform: scale(1.05);
        }

        .website-logo {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-card:hover .website-logo {
          transform: scale(1.1) rotate(5deg);
        }

        .social-icon {
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          transform: translateY(-3px) scale(1.2);
        }

        .nav-arrow {
          transition: all 0.3s ease;
        }

        .nav-arrow:hover:not(:disabled) {
          transform: scale(1.15);
          box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4) !important;
        }

        .nav-arrow:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .decorative-shape {
          animation: float 6s ease-in-out infinite;
        }

        .website-preview {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-count {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @media (max-width: 1200px) {
          .users-container {
            grid-template-columns: repeat(3, minmax(280px, 1fr)) !important;
          }
        }

        @media (max-width: 900px) {
          .users-container {
            grid-template-columns: repeat(2, minmax(280px, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .users-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div
        className="decorative-shape"
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #ff6b6b20, #ff6b6b10)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          pointerEvents: 'none',
        }}
      />
      <div
        className="decorative-shape"
        style={{
          position: 'absolute',
          top: '60%',
          right: '8%',
          width: 100,
          height: 100,
          background: 'linear-gradient(135deg, #4f46e520, #4f46e510)',
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
          pointerEvents: 'none',
          animationDelay: '1s',
        }}
      />

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 50,
            animation: 'fadeInUp 0.8s ease both',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 900,
                color: '#111',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                lineHeight: 1.2,
                marginBottom: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Take a Look at The Featured Users
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="nav-arrow"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: '#ff6b6b',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(255, 107, 107, 0.3)',
              }}
            >
              ←
            </button>
            <button
              className="nav-arrow"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: '#ff6b6b',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(255, 107, 107, 0.3)',
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Users Carousel */}
        <div
          style={{
            overflow: 'hidden',
            animation: 'fadeInUp 0.8s ease 0.2s both',
          }}
        >
          <div
            className="users-container"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(itemsPerView, websites.length)}, minmax(300px, 1fr))`,
              gap: 28,
              transform: `translateX(-${(currentIndex * 100) / Math.max(itemsPerView, websites.length)}%)`,
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {websites.map((website, index) => (
              <WebsiteCard key={website._id} website={website} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function WebsiteCard({ website, index }: { website: FeaturedWebsite; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Get first letter of site name for fallback logo
  const firstLetter = website.siteName.charAt(0).toUpperCase()

  // Get social links that exist
  const socialLinks = Object.entries(website.socialLinks).filter(([_, url]) => url && url.trim() !== '')

  return (
    <div
      className="user-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        border: '2px solid rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
        minWidth: 300,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(135deg, ${website.primaryColor}15, ${website.primaryColor}05)`,
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.4s ease',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo/Preview */}
        <div
          className="website-preview"
          style={{
            width: 100,
            height: 100,
            borderRadius: 20,
            background: website.logo
              ? `url(${website.logo}) center/cover`
              : `linear-gradient(135deg, ${website.primaryColor}, ${website.primaryColor}dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: `0 8px 24px ${website.primaryColor}40`,
            border: '4px solid #fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {!website.logo && (
            <span
              className="website-logo"
              style={{
                fontSize: '3rem',
                fontWeight: 900,
                color: '#fff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {firstLetter}
            </span>
          )}

          {/* View Count Badge */}
          <div
            className="view-count"
            style={{
              position: 'absolute',
              bottom: -8,
              right: -8,
              background: '#fff',
              borderRadius: 20,
              padding: '4px 10px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: website.primaryColor,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: `2px solid ${website.primaryColor}`,
            }}
          >
            👁️ {website.views}
          </div>
        </div>

        {/* Site Name */}
        <h3
          style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#111',
            marginBottom: 6,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          {website.siteName}
        </h3>

        {/* Owner Name */}
        <p
          style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          by {website.owner.name}
        </p>

        {/* Hero Title */}
        <p
          style={{
            fontSize: '0.85rem',
            color: '#9ca3af',
            marginBottom: 20,
            lineHeight: 1.5,
            minHeight: 40,
          }}
        >
          {website.heroTitle}
        </p>

        {/* Social Icons */}
        {socialLinks.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            {socialLinks.map(([platform, url]) => (
              <a
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: `${website.primaryColor}15`,
                  color: website.primaryColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  border: `2px solid ${website.primaryColor}30`,
                  fontSize: '1.2rem',
                }}
              >
                {socialIcons[platform as keyof typeof socialIcons]}
              </a>
            ))}
          </div>
        )}

        {/* Visit Website Button */}
        <a
          href={website.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            padding: '14px 24px',
            borderRadius: 12,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${website.primaryColor}, ${website.primaryColor}dd)`,
            color: '#fff',
            border: 'none',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 14px ${website.primaryColor}40`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 8px 24px ${website.primaryColor}60`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = `0 4px 14px ${website.primaryColor}40`
          }}
        >
          Visit Website →
        </a>
      </div>
    </div>
  )
}
