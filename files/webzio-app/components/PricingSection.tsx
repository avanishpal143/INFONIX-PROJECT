'use client'
import { useState } from 'react'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Startup',
    icon: '📚',
    monthlyPrice: 999,
    yearlyPrice: 799,
    period: '/ month',
    description: "What's Included",
    features: [
      'Custom Domain',
      'Subdomain',
      'Ecommerce',
      'Hotel Booking',
    ],
    showMoreText: 'Show More +',
    bgColor: '#fff',
    hoverGradient: 'linear-gradient(180deg, #ff6b6b, #ff8787)',
    textColor: '#111',
    border: '#e5e7eb',
  },
  {
    name: 'Growth',
    icon: '✓',
    monthlyPrice: 1299,
    yearlyPrice: 999,
    period: '/ month',
    description: "What's Included",
    features: [
      'Custom Domain',
      'Subdomain',
      'Ecommerce',
      'Hotel Booking',
    ],
    showMoreText: 'Show More +',
    bgColor: '#fff',
    hoverGradient: 'linear-gradient(180deg, #10b981, #059669)',
    textColor: '#111',
    border: '#e5e7eb',
  },
  {
    name: 'Maturity',
    icon: '📦',
    monthlyPrice: 1999,
    yearlyPrice: 1499,
    period: '/ month',
    description: "What's Included",
    features: [
      'Custom Domain',
      'Subdomain',
      'Ecommerce',
      'Hotel Booking',
    ],
    showMoreText: 'Show More +',
    bgColor: '#fff',
    hoverGradient: 'linear-gradient(180deg, #3b82f6, #2563eb)',
    textColor: '#111',
    border: '#e5e7eb',
  },
]

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly')

  return (
    <section
      id="pricing"
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

        @keyframes colorWave {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .pricing-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }

        .pricing-card .color-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform: translateY(-100%);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }

        .pricing-card:hover .color-overlay {
          transform: translateY(0);
        }

        .pricing-card-content {
          position: relative;
          z-index: 1;
        }

        .pricing-card:hover .card-text {
          color: #fff !important;
        }

        .pricing-card:hover .card-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .card-icon {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-item {
          transition: all 0.3s ease;
        }

        .pricing-card:hover .feature-item {
          transform: translateX(5px);
        }

        .btn-pricing {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-pricing::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-pricing:hover::before {
          width: 300px;
          height: 300px;
        }

        .billing-toggle {
          transition: all 0.3s ease;
        }

        .billing-toggle:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255, 107, 107, 0.08), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '-5%',
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08), transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 50,
            animation: 'fadeInUp 0.8s ease both',
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
            }}
          >
            Build Your Relationship With Us
          </p>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              color: '#111',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              lineHeight: 1.2,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            Choose Our Pricing Plan
          </h2>

          <p
            style={{
              color: '#6b7280',
              fontSize: '1rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 40px',
            }}
          >
            Curabitur non nulla sit amet nisl tempus iactus Nullo porttitor accumsan tincidunt.
          </p>

          {/* Billing Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0,
              background: '#fff',
              borderRadius: 50,
              padding: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e5e7eb',
            }}
          >
            <button
              className="billing-toggle"
              onClick={() => setBillingPeriod('monthly')}
              style={{
                padding: '10px 28px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: billingPeriod === 'monthly' ? '#ff6b6b' : 'transparent',
                color: billingPeriod === 'monthly' ? '#fff' : '#6b7280',
                transition: 'all 0.3s ease',
              }}
            >
              Monthly
            </button>
            <button
              className="billing-toggle"
              onClick={() => setBillingPeriod('yearly')}
              style={{
                padding: '10px 28px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: billingPeriod === 'yearly' ? '#ff6b6b' : 'transparent',
                color: billingPeriod === 'yearly' ? '#fff' : '#6b7280',
                transition: 'all 0.3s ease',
              }}
            >
              Yearly
            </button>
            <button
              className="billing-toggle"
              onClick={() => setBillingPeriod('lifetime')}
              style={{
                padding: '10px 28px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: billingPeriod === 'lifetime' ? '#ff6b6b' : 'transparent',
                color: billingPeriod === 'lifetime' ? '#fff' : '#6b7280',
                transition: 'all 0.3s ease',
              }}
            >
              Lifetime
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          className="pricing-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
            animation: 'fadeInUp 0.8s ease 0.2s both',
          }}
        >
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              billingPeriod={billingPeriod}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  plan,
  billingPeriod,
  index,
}: {
  plan: any
  billingPeriod: 'monthly' | 'yearly' | 'lifetime'
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  const price =
    billingPeriod === 'yearly'
      ? plan.yearlyPrice
      : billingPeriod === 'lifetime'
      ? plan.monthlyPrice * 10
      : plan.monthlyPrice

  return (
    <div
      className="pricing-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 32,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: `2px solid ${plan.border}`,
        animation: `fadeInUp 0.8s ease ${0.3 + index * 0.1}s both`,
      }}
    >
      {/* Color Overlay for Hover Animation (Top to Bottom) */}
      <div
        className="color-overlay"
        style={{
          background: plan.hoverGradient,
        }}
      />

      {/* Card Content */}
      <div className="pricing-card-content">
        {/* Icon */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 16,
            background: isHovered ? 'rgba(255, 255, 255, 0.3)' : '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            border: isHovered ? '2px solid rgba(255, 255, 255, 0.4)' : '2px solid #e5e7eb',
            transition: 'all 0.3s ease',
          }}
        >
          <span
            className="card-icon"
            style={{
              fontSize: '2rem',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            }}
          >
            {plan.icon}
          </span>
        </div>

        {/* Plan Name */}
        <h3
          className="card-text"
          style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: isHovered ? '#fff' : plan.textColor,
            marginBottom: 8,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.01em',
            transition: 'color 0.3s ease',
          }}
        >
          {plan.name}
        </h3>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span
              className="card-text"
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: isHovered ? '#fff' : '#111',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: 1,
                transition: 'color 0.3s ease',
              }}
            >
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span
              className="card-text"
              style={{
                fontSize: '0.9rem',
                color: isHovered ? 'rgba(255, 255, 255, 0.8)' : '#6b7280',
                transition: 'color 0.3s ease',
              }}
            >
              {billingPeriod === 'lifetime' ? '/ lifetime' : plan.period}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="card-text"
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: isHovered ? 'rgba(255, 255, 255, 0.9)' : '#111',
            marginBottom: 20,
            transition: 'color 0.3s ease',
          }}
        >
          {plan.description}
        </p>

        {/* Features */}
        <div style={{ marginBottom: 24 }}>
          {plan.features.map((feature: string, i: number) => (
            <div
              key={i}
              className="feature-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isHovered ? 'rgba(255, 255, 255, 0.3)' : '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: isHovered
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid #86efac',
                  transition: 'all 0.3s ease',
                }}
              >
                <span
                  style={{
                    color: isHovered ? '#fff' : '#16a34a',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                  }}
                >
                  ✓
                </span>
              </div>
              <span
                className="card-text"
                style={{
                  fontSize: '0.9rem',
                  color: isHovered ? 'rgba(255, 255, 255, 0.9)' : '#4b5563',
                  transition: 'color 0.3s ease',
                }}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Show More Link */}
        <div style={{ marginBottom: 24 }}>
          <button
            className="card-text"
            style={{
              background: 'none',
              border: 'none',
              color: isHovered ? 'rgba(255, 255, 255, 0.9)' : '#ff6b6b',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              transition: 'color 0.3s ease',
            }}
          >
            {plan.showMoreText}
          </button>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Link
            href="/signup"
            className="btn-pricing"
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              textAlign: 'center',
              background: isHovered ? 'rgba(255, 255, 255, 0.3)' : '#fff',
              color: isHovered ? '#fff' : '#ff6b6b',
              border: isHovered
                ? '2px solid rgba(255, 255, 255, 0.4)'
                : '2px solid #ff6b6b',
              transition: 'all 0.3s ease',
            }}
          >
            Trial
          </Link>
          <Link
            href="/signup"
            className="btn-pricing"
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              textAlign: 'center',
              background: isHovered ? '#fff' : 'rgba(255, 107, 107, 0.1)',
              color: isHovered ? '#ff6b6b' : '#ff6b6b',
              border: '2px solid transparent',
              transition: 'all 0.3s ease',
            }}
          >
            Purchase
          </Link>
        </div>
      </div>
    </div>
  )
}
