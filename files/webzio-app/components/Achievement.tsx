'use client'
import { useEffect, useRef, useState } from 'react'

interface Brand {
  name: string
  icon: JSX.Element
}

const BRANDS: Brand[] = [
  { 
    name: 'ZETIXE',
    icon: (
      <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 12L32 12L12 38L28 38M38 12L58 38M58 12L38 38" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: 'WEPIORA',
    icon: (
      <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 42L12 18L28 30L44 18L36 42M52 18L68 42L84 18" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: 'AVEXI',
    icon: (
      <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 38L28 12L41 38M23 28H33M50 12L63 38M63 12L76 38" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { 
    name: 'VECTRO',
    icon: (
      <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 12L28 38L41 12M50 12L50 38L70 12L70 38" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
]

export default function Achievement() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % BRANDS.length)
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % BRANDS.length)
    }, 3000)
  }

  return (
    <section 
      className="achievement-section"
      style={{ 
        padding: '60px 6% 50px', 
        background: '#fafafa', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .brand-item {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.3;
          filter: grayscale(100%);
          transform: scale(0.95);
        }

        .brand-item.active {
          opacity: 1;
          filter: grayscale(0%);
          transform: scale(1.08);
        }

        .brand-item:hover {
          opacity: 0.7;
          filter: grayscale(60%);
          transform: scale(1.02);
          cursor: pointer;
        }

        .carousel-dot {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
          padding: 0;
          background: #d1d5db;
        }

        .carousel-dot:hover {
          transform: scale(1.3);
          background: #ff8a8a;
        }

        .carousel-dot.active {
          background: #ff6b6b;
        }

        @media (max-width: 1024px) {
          .brands-row {
            gap: 60px !important;
          }
        }

        @media (max-width: 768px) {
          .brands-row {
            gap: 40px !important;
            flex-wrap: wrap !important;
          }
          
          .brand-item {
            flex: 0 0 calc(50% - 20px);
          }
        }

        @media (max-width: 480px) {
          .brand-item {
            flex: 0 0 100%;
          }
        }
      `}</style>

      {/* Header Section */}
      <header style={{ marginBottom: 50, animation: 'fadeInUp 0.8s ease both' }}>
        <p style={{ 
          color: '#ff6b6b', 
          fontSize: '1rem', 
          fontWeight: 600, 
          marginBottom: 16, 
          letterSpacing: '0.02em',
          textTransform: 'none'
        }}>
          Our Great Achievement Proved Us!
        </p>
        
        <h2 style={{ 
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', 
          fontWeight: 900, 
          color: '#111', 
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
          lineHeight: 1.25, 
          marginBottom: 8,
          letterSpacing: '-0.02em'
        }}>
          We Completed 500+ Projects
        </h2>
        
        <h3 style={{ 
          fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', 
          fontWeight: 900, 
          color: '#111', 
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
          lineHeight: 1.25,
          letterSpacing: '-0.02em'
        }}>
          With Clints Satisfiction
        </h3>
      </header>

      {/* Brands Row - Single Line */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 40px', 
        position: 'relative', 
        padding: '40px 20px'
      }}>
        <div 
          className="brands-row"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 80,
            flexWrap: 'nowrap'
          }}
        >
          {BRANDS.map((brand, index) => (
            <article
              key={brand.name}
              className={`brand-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                animation: `slideInFromLeft 0.7s ease ${index * 150}ms both`,
                userSelect: 'none',
                minWidth: 'fit-content'
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${brand.name} brand`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleDotClick(index)
                }
              }}
            >
              {/* Brand Icon */}
              <div 
                style={{ 
                  color: index === activeIndex ? '#2d3748' : '#9ca3af',
                  transition: 'color 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-hidden="true"
              >
                {brand.icon}
              </div>
              
              {/* Brand Name */}
              <span style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 700,
                color: '#9ca3af',
                letterSpacing: '0.1em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                whiteSpace: 'nowrap'
              }}>
                {brand.name}
              </span>
            </article>
          ))}
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <nav 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 10 
        }}
        aria-label="Brand carousel navigation"
      >
        {BRANDS.map((brand, index) => (
          <button
            key={`dot-${brand.name}`}
            className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            style={{
              width: index === activeIndex ? 32 : 10,
              height: 10,
              borderRadius: 5,
            }}
            aria-label={`Go to ${brand.name}`}
            aria-current={index === activeIndex ? 'true' : 'false'}
          />
        ))}
      </nav>
    </section>
  )
}
