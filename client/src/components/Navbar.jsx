import React, { useState, useEffect } from 'react';
import { Phone, Moon, Sun, Menu, X, ArrowRight, ShieldCheck, Sparkles, MessageCircle, Settings } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Navbar({ theme, toggleTheme, onOpenAdmin, onQuoteClick, settings = {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gifts & Neon', href: '#gifts' },
    { name: 'Our Work', href: '#work' },
    { name: 'Process', href: '#process' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const phoneNumber = settings.phone_number || '+91 87896 40490';
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'var(--bg-glass)' : 'rgba(5, 5, 5, 0.65)',
          backdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          boxShadow: isScrolled ? 'var(--shadow-md)' : 'none'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
            maxWidth: '1400px',
            gap: '16px'
          }}
        >
          {/* Logo */}
          <a href="#home" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <BrandLogo size="normal" light={theme === 'light'} />
          </a>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexShrink: 0
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                style={{
                  color: link.name === 'Home' ? 'var(--gold-primary)' : 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = link.name === 'Home' ? 'var(--gold-primary)' : 'var(--text-secondary)')}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}
            className="desktop-actions"
          >
            {/* Phone Button */}
            <a
              href={`tel:${cleanPhone}`}
              className="phone-pill-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--gold-gradient)',
                color: '#050505',
                padding: '9px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                fontFamily: 'var(--font-display)',
                boxShadow: 'var(--gold-glow)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Phone size={16} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>{phoneNumber}</span>
            </a>

            {/* Quote CTA */}
            <button
              onClick={onQuoteClick}
              className="btn-outline-gold"
              style={{ fontSize: '0.88rem', padding: '9px 18px', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Get Free Quote
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--gold-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              {theme === 'dark' ? <Sun size={17} color="#E5A93C" /> : <Moon size={17} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="mobile-toggle-wrap">
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={17} color="#E5A93C" /> : <Moon size={17} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '76px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{link.name}</span>
                <ArrowRight size={18} color="var(--gold-primary)" />
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            <a
              href={`tel:${cleanPhone}`}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <Phone size={18} />
              <span>Call {phoneNumber}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onQuoteClick();
              }}
              className="btn-secondary"
              style={{ width: '100%', borderColor: 'var(--border-gold)', color: 'var(--gold-primary)' }}
            >
              Get Free Quotation
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                background: 'none',
                border: 'none',
                padding: '10px',
                cursor: 'pointer'
              }}
            >
              <Settings size={15} /> Admin Portal
            </button>
          </div>
        </div>
      )}

      {/* Media Query Styles for Navbar */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle-wrap {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
