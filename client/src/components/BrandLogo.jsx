import React from 'react';

export default function BrandLogo({ size = 'normal', light = false, iconOnly = false, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  // Heights for standard navbar, mobile, and hero/modal
  const emblemHeight = isLarge ? 54 : isSmall ? 34 : 44;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '8px' : '12px',
        textDecoration: 'none',
        userSelect: 'none',
        flexShrink: 0
      }}
      className={`brand-logo-container ${className}`}
    >
      {/* Official 3D Brushed Gold CL Emblem */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <img
          src="/uploads/cl_emblem_clean.png"
          alt="CL Logo"
          style={{
            height: `${emblemHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
            filter: light
              ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.18)) drop-shadow(0 1px 2px rgba(180,83,9,0.25))'
              : 'drop-shadow(0 0 10px rgba(229,169,60,0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
            transition: 'transform 0.25s ease'
          }}
        />
      </div>

      {/* Brand Typography: Credible Light | SIGNAGE & INTERIORS */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Main Title Row: Credible Light */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: isSmall ? '4px' : '6px',
              lineHeight: 1.05
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: isLarge ? '1.6rem' : isSmall ? '1.15rem' : '1.38rem',
                letterSpacing: '-0.02em',
                color: light ? '#111827' : 'var(--text-primary)',
                transition: 'color 0.2s ease'
              }}
            >
              Credible
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: isLarge ? '1.6rem' : isSmall ? '1.15rem' : '1.38rem',
                letterSpacing: '-0.02em',
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: light ? 'none' : '0 2px 10px rgba(229, 169, 60, 0.25)'
              }}
            >
              Light
            </span>
          </div>

          {/* Subtitle Row: — SIGNAGE & INTERIORS — */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: isSmall ? '3px' : '4px',
              lineHeight: 1
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: isSmall ? '8px' : '12px',
                height: '1.5px',
                backgroundColor: 'var(--gold-primary)',
                opacity: 0.8
              }}
            />
            <span
              style={{
                fontSize: isLarge ? '0.72rem' : isSmall ? '0.58rem' : '0.66rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: light ? '#374151' : 'var(--text-secondary)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              SIGNAGE &amp; INTERIORS
            </span>
            <span
              style={{
                display: 'inline-block',
                width: isSmall ? '8px' : '12px',
                height: '1.5px',
                backgroundColor: 'var(--gold-primary)',
                opacity: 0.8
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
