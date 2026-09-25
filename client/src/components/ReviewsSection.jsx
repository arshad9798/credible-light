import React from 'react';
import { Star, Quote, Sparkles, ArrowRight } from 'lucide-react';

export default function ReviewsSection({ testimonials = [], onQuoteClick }) {
  return (
    <section
      id="reviews"
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '46px'
          }}
        >
          <div>
            <div style={{ marginBottom: '10px' }}>
              <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
                <Sparkles size={13} color="var(--gold-primary)" />
                CUSTOMER REVIEWS
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
              What Our <span className="text-gold-gradient">Clients</span> Say
            </h2>
          </div>

          <button onClick={onQuoteClick} className="btn-outline-gold" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
            <span>Join 500+ Happy Clients</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '26px'
          }}
        >
          {testimonials.map((item, idx) => (
            <div
              key={item.id || idx}
              className="card-glass"
              style={{
                padding: '28px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Header: Avatar, Name, Role, Quote icon */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={item.avatar_image || '/uploads/client_rohit.jpg'}
                      alt={item.client_name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--gold-primary)'
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          lineHeight: 1.2
                        }}
                      >
                        {item.client_name}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--gold-primary)',
                          fontWeight: 600
                        }}
                      >
                        {item.client_role} {item.company_name ? `• ${item.company_name}` : ''}
                      </p>
                    </div>
                  </div>

                  <Quote size={28} color="rgba(229, 169, 60, 0.4)" />
                </div>

                {/* Star Rating */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} fill="#E5A93C" color="#E5A93C" />
                  ))}
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: '0.94rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    fontStyle: 'italic'
                  }}
                >
                  "{item.review_text}"
                </p>
              </div>

              {/* Project Image Thumbnail */}
              {item.project_image && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={item.project_image}
                    alt="Installed Signage"
                    style={{
                      width: '64px',
                      height: '44px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      border: '1px solid var(--border-gold)'
                    }}
                  />
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                      Installed Project
                    </span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.company_name || 'Commercial Signage'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
