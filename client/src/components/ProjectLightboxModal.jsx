import React, { useState } from 'react';
import { X, MapPin, Calendar, MessageCircle, ArrowRight, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function ProjectLightboxModal({ project, onClose, onQuote, settings = {} }) {
  if (!project) return null;

  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [project.cover_image];

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const waNumber = (settings.whatsapp_number || '+91 87896 40490').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Credible Light, I saw your project '${project.title}' (${project.category_name}). I would like to get a similar design and quotation for my business.`
  )}`;

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

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
          maxWidth: '840px',
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
            zIndex: 20,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.65)',
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

        {/* High-res project photo with Gallery Navigation */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', overflow: 'hidden' }}>
          <img
            src={images[activeImgIdx] || project.cover_image}
            alt={`${project.title} - View ${activeImgIdx + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
          />

          {/* Navigation Arrows for Multi-Images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '16px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '16px',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <ChevronRight size={22} />
              </button>

              {/* Counter Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  zIndex: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(229, 169, 60, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={14} color="var(--gold-primary)" />
                <span>{activeImgIdx + 1} / {images.length} Photos</span>
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Strip if Multiple Images */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              padding: '12px 32px 0',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          >
            {images.map((imgUrl, thumbIdx) => (
              <button
                key={thumbIdx}
                onClick={() => setActiveImgIdx(thumbIdx)}
                style={{
                  width: '64px',
                  height: '48px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  padding: 0,
                  flexShrink: 0,
                  border: thumbIdx === activeImgIdx ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.2)',
                  opacity: thumbIdx === activeImgIdx ? 1 : 0.6,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#111'
                }}
              >
                <img src={imgUrl} alt={`Thumbnail ${thumbIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}

        {/* Content Details */}
        <div style={{ padding: '24px 32px 32px' }}>
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
              style={{ flex: 1, minWidth: '220px' }}
            >
              <MessageCircle size={18} />
              <span>Get Similar Design via WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onQuote && onQuote({ name: `${project.title} (${project.category_name})` });
              }}
              className="btn-primary"
              style={{ flex: 1, minWidth: '200px' }}
            >
              <span>Get Free Quotation</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
