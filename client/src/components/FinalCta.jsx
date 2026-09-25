import React from 'react';
import { Phone, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function FinalCta({ settings = {}, onQuoteClick }) {
  const phone = settings.phone_number || '+91 87896 40490';
  const wa = settings.whatsapp_number || '+91 87896 40490';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = wa.replace(/[^0-9]/g, '');

  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Hi Credible Light, I am interested in getting a quotation for my business sign board. Please assist me.'
  )}`;

  return (
    <section
      style={{
        position: 'relative',
        padding: '100px 0',
        backgroundColor: '#050505',
        overflow: 'hidden',
        textAlign: 'center'
      }}
    >
      {/* Background Graphic & Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.85) 50%, rgba(5,5,5,0.95) 100%),
            url(/uploads/quote_banner_reception.jpg)
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(229, 169, 60, 0.22) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="gold-badge">
              <Sparkles size={14} color="var(--gold-primary)" />
              START YOUR PROJECT TODAY
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '18px',
              lineHeight: 1.15
            }}
          >
            Ready to <span className="text-gold-gradient">Transform</span> Your Business?
          </h2>

          <p
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              color: '#D1D5DB',
              marginBottom: '40px',
              lineHeight: 1.6
            }}
          >
            Get a free design mockup and exact price estimate for your next signage or interior branding project.
          </p>

          {/* Prominent Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            {/* Call Now Button */}
            <a
              href={`tel:${cleanPhone}`}
              className="btn-primary"
              style={{
                fontSize: '1.05rem',
                padding: '16px 36px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <Phone size={20} strokeWidth={2.5} />
              <span>Call Now {phone}</span>
            </a>

            {/* WhatsApp Us Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{
                fontSize: '1.05rem',
                padding: '16px 36px',
                borderRadius: 'var(--radius-full)',
                background: '#0D0D0D',
                border: '1px solid rgba(37, 211, 102, 0.5)'
              }}
            >
              <MessageCircle size={22} color="#25D366" />
              <span>WhatsApp Us {wa}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
