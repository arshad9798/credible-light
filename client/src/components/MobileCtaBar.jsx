import React from 'react';
import { Phone, MessageCircle, FileText } from 'lucide-react';

export default function MobileCtaBar({ settings = {}, onQuoteClick }) {
  const phone = settings.phone_number || '+91 87896 40490';
  const wa = settings.whatsapp_number || '+91 87896 40490';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWa = wa.replace(/[^0-9]/g, '');

  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    'Hi Credible Light, I am interested in a signboard/interior quotation.'
  )}`;

  return (
    <>
      <div
        className="mobile-cta-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(229, 169, 60, 0.3)',
          padding: '10px 14px',
          display: 'none',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.6)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          {/* Call Now */}
          <a
            href={`tel:${cleanPhone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              padding: '10px 4px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none'
            }}
          >
            <Phone size={16} color="var(--gold-primary)" />
            <span>Call Now</span>
          </a>

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: '#25D366',
              color: '#050505',
              padding: '10px 4px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.82rem',
              textDecoration: 'none'
            }}
          >
            <MessageCircle size={16} color="#050505" />
            <span>WhatsApp</span>
          </a>

          {/* Get Quote */}
          <button
            onClick={onQuoteClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'var(--gold-gradient)',
              color: '#050505',
              padding: '10px 4px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} color="#050505" />
            <span>Get Quote</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-cta-bar {
            display: block !important;
          }
          body {
            padding-bottom: 64px !important;
          }
        }
      `}</style>
    </>
  );
}
