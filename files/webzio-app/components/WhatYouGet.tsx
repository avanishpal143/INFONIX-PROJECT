'use client'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: '🌐',
    title: 'Custom Domain',
    desc: 'It is a long established fact that a reader will be distracted by the readable content of a page',
    color: '#3b82f6',
    delay: 0,
  },
  {
    icon: '🌍',
    title: 'Unlimited Language',
    desc: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum',
    color: '#f59e0b',
    delay: 100,
  },
  {
    icon: '💻',
    title: 'Attractive Themes',
    desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered',
    color: '#8b5cf6',
    delay: 200,
  },
  {
    icon: '📋',
    title: 'Form Builder',
    desc: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum',
    color: '#10b981',
    delay: 300,
  },
  {
    icon: '📱',
    title: 'QR Builder',
    desc: 'It is a long established fact that a reader will be distracted by the readable content of a page',
    color: '#ef4444',
    delay: 400,
  },
  {
    icon: '💳',
    title: 'vCard',
    desc: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered',
    color: '#06b6d4',
    delay: 500,
  },
]

export default function WhatYouGet() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px 6% 90px',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) rotate(-10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px) rotate(10deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-10px) scale(1.1);
          }
          50% {
            transform: translateY(0) scale(1);
          }
          75% {
            transform: translateY(-5px) scale(1.05);
          }
        }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }

        .feature-card:hover .feature-icon {
          animation: iconBounce 0.6s ease;
        }

        .feature-card:hover .feature-icon-bg {
          transform: scale(1.2) rotate(10deg);
        }

        .feature-icon-bg {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .decorative-blob {
          animation: float 6s ease-in-out infinite;
        }

        .decorative-blob:nth-child(2) {
          animation-delay: 1s;
          animation-duration: 7s;
        }

        .decorative-blob:nth-child(3) {
          animation-delay: 2s;
          animation-duration: 8s;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Animated Decorative Background Elements */}
      <div
        className="decorative-blob"
        style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="decorative-blob"
        style={{
          position: 'absolute',
          top: '40%',
          left: '3%',
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="decorative-blob"
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating Decorative Shapes */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: 60,
          height: 60,
          background: 'linear-gradient(135deg, #ff6b6b20, #ff6b6b10)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animation: 'float 5s ease-in-out infinite, rotate 20s linear infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          right: '12%',
          width: 80,
          height: 80,
          background: 'linear-gradient(135deg, #3b82f620, #3b82f610)',
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
          animation: 'float 6s ease-in-out infinite, rotate 25s linear infinite reverse',
          animationDelay: '1s',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Left Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: 60,
            alignItems: 'center',
          }}
        >
          {/* Left Side - Text Content */}
          <div
            style={{
              animation: isVisible ? 'fadeInLeft 0.8s ease both' : 'none',
            }}
          >
            <p
              style={{
                color: '#ff6b6b',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: '0.05em',
                textTransform: 'none',
                animation: isVisible ? 'fadeInUp 0.6s ease both' : 'none',
              }}
            >
              Why You Choose Our Template
            </p>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 900,
                color: '#111',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                lineHeight: 1.2,
                marginBottom: 24,
                letterSpacing: '-0.02em',
                animation: isVisible ? 'fadeInUp 0.8s ease 0.1s both' : 'none',
              }}
            >
              Bring More Profits With More Valuable Features
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                marginBottom: 32,
              }}
            >
              {[
                'It is a long established fact that a reader will be choose by the readable content of a page when looking at',
                'We completed 500+ client\'s projects',
                'We have 10+ multiple developer',
                '100+ active client\'s working with us',
                'Your trusted business partner',
              ].map((text, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    animation: isVisible ? `fadeInLeft 0.6s ease ${0.2 + i * 0.1}s both` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>✓</span>
                  </div>
                  <p
                    style={{
                      color: '#4b5563',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <button
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #ff6b6b, #ff8787)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
                transition: 'all 0.3s ease',
                animation: isVisible ? 'fadeInUp 1s ease 0.8s both' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 107, 107, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 107, 0.4)'
              }}
            >
              Purchase Now
            </button>
          </div>

          {/* Right Side - Feature Cards Grid */}
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              animation: isVisible ? 'fadeInRight 0.8s ease 0.2s both' : 'none',
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                isVisible={isVisible}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, isVisible, index }: { feature: any; isVisible: boolean; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="feature-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        animation: isVisible ? `scaleIn 0.6s ease ${feature.delay}ms both` : 'none',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Gradient Background on Hover */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${feature.color}08, ${feature.color}03)`,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Shine Effect */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: isHovered ? '150%' : '-50%',
          width: '50%',
          height: '200%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          transform: 'rotate(25deg)',
          transition: 'left 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
            border: `2px solid ${feature.color}20`,
          }}
        >
          {/* Icon Background Animation */}
          <div
            className="feature-icon-bg"
            style={{
              position: 'absolute',
              inset: -10,
              background: `radial-gradient(circle, ${feature.color}20, transparent 70%)`,
              borderRadius: '50%',
            }}
          />
          <span
            className="feature-icon"
            style={{
              fontSize: '2rem',
              position: 'relative',
              zIndex: 1,
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            }}
          >
            {feature.icon}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#111',
            marginBottom: 10,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.01em',
            transition: 'color 0.3s ease',
          }}
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {feature.desc}
        </p>

        {/* Decorative Corner Element */}
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            right: -20,
            width: 80,
            height: 80,
            background: `linear-gradient(135deg, ${feature.color}10, transparent)`,
            borderRadius: '50%',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  )
}
