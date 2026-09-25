import React from 'react';
import { X, MapPin, Calendar, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function ProjectLightboxModal({ project, onClose, onQuote, settings = {} }) {
  if (!project) return null;

  const waNumber = (settings.whatsapp_number || '+91 87896 40490').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Credible Light, I saw your project '${project.title}' (${project.category_name}). I would like to get a similar design and quotation for my business.`
  )}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
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
          maxWidth: '820px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-lg), 0 0 40px rgba(229, 169, 60, 0.25)',
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
            width: '38px',
            height: '38px',
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

        {/* High-res project photo */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000' }}>
          <img
            src={project.cover_image}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Content Details */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.74rem' }}>
              {project.category_name}
            </span>

            {project.location && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <MapPin size={14} color="var(--gold-primary)" />
                {project.location}
              </span>
            )}

            {project.project_date && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <Calendar size={14} color="var(--gold-primary)" />
                {project.project_date}
              </span>
            )}
          </div>

          <h2
            style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '14px',
              letterSpacing: '-0.02em'
            }}
          >
            {project.title}
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '28px' }}>
            {project.full_description || project.short_description}
          </p>

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)'
            }}
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ flex: 1, minWidth: '220px', padding: '14px' }}
            >
              <MessageCircle size={20} />
              <span>Get Similar Design on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onQuote();
              }}
              className="btn-primary"
              style={{ flex: 1, minWidth: '220px', padding: '14px' }}
            >
              <span>Request Free Estimate</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
