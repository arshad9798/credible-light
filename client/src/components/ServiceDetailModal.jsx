import React from 'react';
import { X, Check, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';

export default function ServiceDetailModal({ service, onClose, onQuote, settings = {} }) {
  if (!service) return null;

  const waNumber = (settings.whatsapp_number || '+91 87896 40490').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Credible Light, I am interested in ${service.name}. I would like to get a quotation and design mockup.`
  )}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="card-glass"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-lg), 0 0 35px rgba(229, 169, 60, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Hero image banner */}
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
          <img
            src={service.cover_image}
            alt={service.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,15,15,0.95) 0%, rgba(0,0,0,0) 60%)'
            }}
          />
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <span className="gold-badge" style={{ marginBottom: '8px', fontSize: '0.72rem' }}>
              SIGNAGE & FABRICATION
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {service.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '26px 28px' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {service.full_description || service.short_description}
          </p>

          {/* Key Features */}
          {Array.isArray(service.features) && service.features.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
                Key Engineering & Material Specs:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {service.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(229, 169, 60, 0.15)',
                        border: '1px solid var(--gold-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Check size={12} color="var(--gold-primary)" />
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => {
                onClose();
                onQuote(service);
              }}
              className="btn-primary"
              style={{ flex: 1, minWidth: '200px' }}
            >
              <span>Get Free Quotation</span>
              <ArrowRight size={18} />
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ flex: 1, minWidth: '200px' }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Us for this</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
