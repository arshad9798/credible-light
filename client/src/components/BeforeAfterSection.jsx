import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal, ArrowRight } from 'lucide-react';

export default function BeforeAfterSection({ beforeAfter = [], onQuoteClick }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const activeItem = beforeAfter[0] || {
    title: 'Commercial Storefront Renovation',
    category: 'Restaurant & Retail Facade',
    description: 'Complete transformation from an aged faded flex board to high-brightness 3D illuminated channel letters and sleek black matte ACP architectural cladding.',
    before_image: '/uploads/before_storefront.jpg',
    after_image: '/uploads/after_storefront.jpg'
  };

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section
      id="transformations"
      style={{
        padding: '90px 0',
        backgroundColor: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 46px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={13} color="var(--gold-primary)" />
              BEFORE & AFTER
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
            Real <span className="text-gold-gradient">Before → After</span> Transformations
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6
            }}
          >
            Drag the comparison slider below to see how our engineering and high-intensity LED fabrication completely elevates business presence and customer footfall.
          </p>
        </div>

        {/* Comparison Box */}
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(229, 169, 60, 0.15)',
            backgroundColor: '#050505'
          }}
        >
          {/* Slider Canvas */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              overflow: 'hidden',
              cursor: 'ew-resize',
              userSelect: 'none'
            }}
          >
            {/* AFTER Image (Full background) */}
            <img
              src={activeItem.after_image}
              alt="After Transformation"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* BEFORE Image (Clipped) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: `${sliderPosition}%`,
                overflow: 'hidden',
                zIndex: 2,
                borderRight: '2px solid var(--gold-primary)',
                boxShadow: '4px 0 16px rgba(0,0,0,0.6)'
              }}
            >
              <img
                src={activeItem.before_image}
                alt="Before Renovation"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '1000px',
                  height: '100%',
                  objectFit: 'cover',
                  maxWidth: 'none'
                }}
              />
            </div>

            {/* Before Badge Tag */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 3,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.05em'
              }}
            >
              BEFORE
            </div>

            {/* After Badge Tag */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 3,
                backgroundColor: 'rgba(229, 169, 60, 0.9)',
                color: '#050505',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 800,
                border: '1px solid #E5A93C',
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--gold-glow)',
                letterSpacing: '0.05em'
              }}
            >
              AFTER CREDIBLE LIGHT
            </div>

            {/* Central Draggable Handle */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)',
                zIndex: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#E5A93C',
                  boxShadow: '0 0 25px rgba(229, 169, 60, 0.7), 0 2px 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#050505'
                }}
              >
                <MoveHorizontal size={22} strokeWidth={2.6} />
              </div>
            </div>
          </div>

          {/* Transformation Meta Footer */}
          <div
            style={{
              padding: '24px 30px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {activeItem.title}
                </h4>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--gold-primary)',
                    background: 'rgba(229, 169, 60, 0.1)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {activeItem.category}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
                {activeItem.description}
              </p>
            </div>

            <button onClick={onQuoteClick} className="btn-primary" style={{ padding: '12px 26px', fontSize: '0.92rem' }}>
              <span>Transform My Shop</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
