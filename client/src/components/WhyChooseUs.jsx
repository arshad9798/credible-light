import React from 'react';
import { PenTool, ShieldCheck, Clock, DollarSign, Users, Headphones, Sparkles } from 'lucide-react';

export default function WhyChooseUs({ stats = [] }) {
  const businessesServed = stats.find(s => s.stat_label.includes('Businesses'))?.stat_value || '500+';

  const benefits = [
    {
      icon: PenTool,
      title: 'Custom Design',
      desc: 'Tailored precisely as per your brand guidelines, typography and aesthetic architecture.'
    },
    {
      icon: ShieldCheck,
      title: 'Premium Materials',
      desc: 'Virgin cast acrylic, PVDF coated ACP, and IP67 weather-sealed LED modules for long-lasting quality.'
    },
    {
      icon: Clock,
      title: 'Fast Installation',
      desc: 'Rapid turnaround with 24-hour design mockups and guaranteed on-time delivery & mounting.'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      desc: 'Direct factory pricing with zero middlemen, offering maximum value for your branding investment.'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      desc: 'Over 10+ years of dedicated signage fabrication and commercial interior engineering experts.'
    },
    {
      icon: Headphones,
      title: 'After Sales Support',
      desc: 'Full warranty coverage, on-demand maintenance visits, and prompt technical assistance.'
    }
  ];

  return (
    <section
      id="about"
      style={{
        padding: '90px 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 50px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={13} color="var(--gold-primary)" />
              WHY CHOOSE CREDIBLE LIGHT
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '16px'
            }}
          >
            Trusted by <span className="text-gold-gradient">{businessesServed}</span> Businesses
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            We combine architectural precision, top-grade luminescent engineering, and turnkey installation to make your business unmistakable on the street.
          </p>
        </div>

        {/* Benefits Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {benefits.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div
                key={idx}
                className="card-glass"
                style={{
                  padding: '28px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '18px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: 'rgba(229, 169, 60, 0.1)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)',
                    flexShrink: 0
                  }}
                >
                  <IconComp size={24} />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '6px'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
