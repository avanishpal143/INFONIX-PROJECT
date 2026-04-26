'use client'

const STEPS = [
  {
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="15" y="10" width="30" height="40" rx="2" stroke="#4f46e5" strokeWidth="2.5" fill="none"/>
        <rect x="20" y="15" width="8" height="12" fill="#ef4444"/>
        <rect x="30" y="15" width="8" height="12" fill="#3b82f6"/>
        <line x1="20" y1="32" x2="38" y2="32" stroke="#4f46e5" strokeWidth="2"/>
        <line x1="20" y1="37" x2="38" y2="37" stroke="#4f46e5" strokeWidth="2"/>
        <line x1="20" y1="42" x2="32" y2="42" stroke="#4f46e5" strokeWidth="2"/>
      </svg>
    ),
    title: 'Purchase Template',
    desc: 'We provide graphics and visual identity design services.',
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  {
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="18" stroke="#10b981" strokeWidth="2.5" fill="none"/>
        <path d="M30 12 L30 30 L42 30" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
        <text x="18" y="26" fontSize="10" fill="#10b981" fontWeight="bold">W</text>
        <text x="36" y="26" fontSize="10" fill="#10b981" fontWeight="bold">W</text>
        <text x="27" y="44" fontSize="10" fill="#10b981" fontWeight="bold">W</text>
      </svg>
    ),
    title: 'Add Services',
    desc: 'We provide graphics and visual identity design services.',
    color: '#10b981',
    bgColor: '#f0fdf4',
  },
  {
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect x="12" y="15" width="36" height="26" rx="2" stroke="#f59e0b" strokeWidth="2.5" fill="none"/>
        <rect x="20" y="41" width="20" height="2" fill="#f59e0b"/>
        <rect x="15" y="43" width="30" height="3" rx="1" fill="#f59e0b"/>
        <line x1="18" y1="22" x2="42" y2="22" stroke="#f59e0b" strokeWidth="1.5"/>
        <line x1="18" y1="26" x2="42" y2="26" stroke="#f59e0b" strokeWidth="1.5"/>
        <line x1="18" y1="30" x2="35" y2="30" stroke="#f59e0b" strokeWidth="1.5"/>
        <rect x="18" y="33" width="8" height="5" fill="#f59e0b" opacity="0.3"/>
        <rect x="28" y="33" width="8" height="5" fill="#f59e0b" opacity="0.3"/>
      </svg>
    ),
    title: 'Setup Website',
    desc: 'We provide graphics and visual identity design services.',
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  {
    icon: (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="16" stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
        <circle cx="30" cy="30" r="10" stroke="#3b82f6" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="30" r="4" fill="#3b82f6"/>
        <line x1="30" y1="14" x2="30" y2="18" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="30" y1="42" x2="30" y2="46" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="46" y1="30" x2="42" y2="30" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="14" y1="30" x2="18" y2="30" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="41" y1="19" x2="38" y2="22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
        <line x1="19" y1="41" x2="22" y2="38" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Launch Website',
    desc: 'We provide graphics and visual identity design services.',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding: '60px 6% 70px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes iconBounce { 
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(5deg); }
        }
        
        .step-card { 
          transition: all .4s cubic-bezier(0.4, 0, 0.2, 1); 
          position: relative;
          overflow: hidden;
        }
        
        .step-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: var(--card-color);
          transition: width .4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .step-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 28px rgba(0,0,0,.12);
        }
        
        .step-card:hover::before {
          width: 5px;
        }
        
        .step-card:hover {
          background: var(--card-bg) !important;
        }
        
        .step-card:hover .step-icon-wrapper {
          transform: scale(1.1);
          animation: iconBounce .6s ease;
        }
        
        .step-card:hover .step-title {
          color: var(--card-color);
        }
        
        .step-icon-wrapper { 
          transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .step-title {
          transition: color .3s ease;
        }
        
        @media (max-width: 968px) {
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'left', marginBottom: 50, position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: '#111', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1.2, marginBottom: 0 }}>
          How To Setup Website
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="step-card"
            style={{
              '--card-color': step.color,
              '--card-bg': step.bgColor,
              background: '#fff',
              borderRadius: 10,
              padding: '36px 28px',
              textAlign: 'center',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,.04)',
              animation: `fadeInUp .6s ease ${i * 100}ms both`,
            } as React.CSSProperties}
          >
            {/* Icon */}
            <div className="step-icon-wrapper" style={{
              width: 75,
              height: 75,
              margin: '0 auto 22px',
              borderRadius: 10,
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #f0f0f0',
            }}>
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="step-title" style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#111',
              marginBottom: 12,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {step.title}
            </h3>

            {/* Description */}
            <p style={{
              color: '#6b7280',
              fontSize: '.87rem',
              lineHeight: 1.65,
            }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
