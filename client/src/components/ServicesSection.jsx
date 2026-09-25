import React from 'react';
import { ArrowRight, ArrowUpRight, Sparkles, Check } from 'lucide-react';

export default function ServicesSection({ services = [], onSelectService, onQuoteWithService }) {
  return (
    <section
      id="services"
      style={{
        padding: '90px 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            marginBottom: '54px'
          }}
        >
          <div>
            <div style={{ marginBottom: '10px' }}>
              <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
                <Sparkles size={13} color="var(--gold-primary)" />
                OUR SERVICES
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              Complete <span className="text-gold-gradient">Signage & Interior</span> Solutions
            </h2>
          </div>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              maxWidth: '650px',
              lineHeight: 1.6
            }}
          >
            From outdoor shop front sign boards to comprehensive corporate interior branding, we provide turnkey solutions engineered to command attention and drive customer visits.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px'
          }}
        >
          {services.map((service) => (
            <div
              key={service.id || service.slug}
              className="card-glass"
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => onSelectService(service)}
            >
              {/* Card Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  overflow: 'hidden',
                  backgroundColor: '#0a0a0a'
                }}
              >
                <img
                  src={service.cover_image}
                  alt={service.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,15,15,0.85) 0%, rgba(0,0,0,0) 60%)'
                  }}
                />
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '10px'
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55,
                      marginBottom: '18px'
                    }}
                  >
                    {service.short_description}
                  </p>

                  {/* Highlights list if available */}
                  {Array.isArray(service.features) && service.features.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '20px'
                      }}
                    >
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuoteWithService(service);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-primary)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Get Free Estimate</span>
                    <ArrowRight size={16} />
                  </button>

                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1px solid var(--border-gold)',
                      background: 'rgba(229, 169, 60, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-primary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
