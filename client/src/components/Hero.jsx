import React from 'react';
import { ArrowRight, MessageCircle, Shield, Award, Zap, MapPin, Sparkles } from 'lucide-react';

export default function Hero({ settings = {}, onQuoteClick }) {
  const badgeText = settings.hero_badge || 'BRIGHT IDEAS FOR A BETTER TOMORROW';
  const prefix = settings.hero_heading_prefix || 'Premium ';
  const highlight1 = settings.hero_heading_highlight1 || 'Sign Board';
  const middle = settings.hero_heading_middle || ' & ';
  const highlight2 = settings.hero_heading_highlight2 || 'Interior Solutions';
  const suffix = settings.hero_heading_suffix || ' for Your Business';
  const description = settings.hero_description || 'A complete range of LED sign boards, acrylic letters, shop signage and interior branding to make your business stand out.';
  const heroImage = settings.hero_image || '/uploads/hero_storefront.jpg';
  const primaryCta = settings.hero_cta_primary || 'Get Free Quote';
  const secondaryCta = settings.hero_cta_secondary || 'WhatsApp Us';
  const waNumber = (settings.whatsapp_number || '+91 87896 40490').replace(/[^0-9]/g, '');

  const trustPoints = [
    { icon: Shield, label: 'Custom Design' },
    { icon: Award, label: 'Premium Quality' },
    { icon: Zap, label: 'Fast Installation' },
    { icon: MapPin, label: 'Pan-City Service' },
  ];

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Hi Credible Light, I am interested in getting a quotation for a sign board/interior design. Please share more details.'
  )}`;

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '110px',
        paddingBottom: '60px',
        overflow: 'hidden',
      }}
    >
      {/* Background with Dark Radial Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.82) 45%, rgba(5,5,5,0.4) 100%),
            linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.8) 100%),
            url(${heroImage})
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          zIndex: 1,
          filter: 'brightness(0.92)'
        }}
      />

      {/* Subtle Gold Ambient Glow Orb in background */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 169, 60, 0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <div style={{ maxWidth: '780px' }}>
          {/* Badge */}
          <div style={{ marginBottom: '22px' }}>
            <span
              className="gold-badge"
              style={{
                letterSpacing: '0.12em',
                fontSize: '0.82rem',
                padding: '7px 16px',
                border: '1px solid rgba(229, 169, 60, 0.4)',
                background: 'rgba(229, 169, 60, 0.12)',
                boxShadow: '0 0 15px rgba(229, 169, 60, 0.15)'
              }}
            >
              <Sparkles size={14} color="var(--gold-primary)" />
              {badgeText}
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '24px'
            }}
          >
            {prefix}
            <span className="text-gold-gradient">{highlight1}</span>
            {middle}
            <span className="text-gold-gradient">{highlight2}</span>
            {suffix}
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '38px',
              maxWidth: '680px'
            }}
          >
            {description}
          </p>

          {/* Call to Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '18px',
              marginBottom: '46px'
            }}
          >
            {/* Primary Quote CTA */}
            <button
              onClick={onQuoteClick}
              className="btn-primary"
              style={{
                fontSize: '1.08rem',
                padding: '16px 36px',
                cursor: 'pointer'
              }}
            >
              <span>{primaryCta}</span>
              <ArrowRight size={20} />
            </button>

            {/* WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{
                fontSize: '1.05rem',
                padding: '15px 30px',
                background: 'rgba(20, 20, 20, 0.85)',
                border: '1px solid rgba(37, 211, 102, 0.5)'
              }}
            >
              <MessageCircle size={20} color="#25D366" />
              <span>{secondaryCta}</span>
            </a>
          </div>

          {/* Trust Points */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              maxWidth: '720px'
            }}
          >
            {trustPoints.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(229, 169, 60, 0.12)',
                      border: '1px solid rgba(229, 169, 60, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={16} color="var(--gold-primary)" />
                  </div>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
