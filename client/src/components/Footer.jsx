import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import BrandLogo from './BrandLogo';

// Clean bespoke SVG social icons
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
  );
}

export default function Footer({ settings = {}, services = [], onNavigate }) {
  const phone = settings.phone_number || '+91 87896 40490';
  const email = settings.email || 'info@crediblelight.in';
  const address = settings.address || 'Main Road, Bistupur, Jamshedpur, Jharkhand 831001';
  const hours = settings.business_hours || 'Mon - Sat: 9:00 AM - 7:00 PM';
  const qrImage = settings.whatsapp_qr_image || '/uploads/whatsapp_qr.png';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <footer
      id="contact"
      style={{
        backgroundColor: '#050505',
        color: '#A3A3A3',
        paddingTop: '80px',
        paddingBottom: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="container">
        {/* Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}
        >
          {/* Column 1: Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ marginBottom: '18px' }}>
              <BrandLogo size="normal" />
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '22px', color: '#9CA3AF' }}>
              We create premium sign boards and turnkey interior branding solutions to help your business stand out, captivate foot traffic, and accelerate growth.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: FacebookIcon, href: 'https://facebook.com' },
                { icon: InstagramIcon, href: 'https://instagram.com' },
                { icon: YoutubeIcon, href: 'https://youtube.com' },
                { icon: TwitterIcon, href: 'https://twitter.com' }
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E5A93C',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5A93C';
                      e.currentTarget.style.color = '#050505';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#E5A93C';
                    }}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '20px'
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Home', href: '#home' },
                { name: 'About Us', href: '#about' },
                { name: 'Services', href: '#services' },
                { name: 'Our Work', href: '#work' },
                { name: 'Process', href: '#process' },
                { name: 'Reviews', href: '#reviews' },
                { name: 'Contact Us', href: '#contact' }
              ].map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    style={{
                      fontSize: '0.92rem',
                      color: '#9CA3AF',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                  >
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '20px'
              }}
            >
              Our Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(services.length > 0 ? services : [
                { name: '3D Acrylic Letters' },
                { name: 'LED Sign Boards' },
                { name: 'Shop & Office Signage' },
                { name: 'Interior Branding' },
                { name: 'ACP / Metal Boards' },
                { name: 'Acrylic Name Plates' }
              ]).slice(0, 6).map((s, idx) => (
                <li key={idx}>
                  <a
                    href="#services"
                    style={{
                      fontSize: '0.92rem',
                      color: '#9CA3AF',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & WhatsApp QR */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '20px'
              }}
            >
              Contact Us
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--gold-primary)" />
                <a href={`tel:${cleanPhone}`} style={{ color: '#fff', fontWeight: 600 }}>
                  {phone}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--gold-primary)" />
                <a href={`mailto:${email}`} style={{ color: '#9CA3AF' }}>
                  {email}
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="var(--gold-primary)" style={{ marginTop: '4px', flexShrink: 0 }} />
                <span>{address}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="var(--gold-primary)" />
                <span>{hours}</span>
              </li>
            </ul>

            {/* Scan to WhatsApp Card */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-gold)'
              }}
            >
              <img
                src={qrImage}
                alt="Scan to WhatsApp"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  padding: '3px'
                }}
              />
              <div>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff', display: 'block' }}>
                  Scan to WhatsApp
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)' }}>
                  Instant Estimate Chat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.86rem'
          }}
        >
          <div>
            © 2026 Credible Light. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a href="#home" style={{ color: '#9CA3AF' }}>Privacy Policy</a>
            <a href="#home" style={{ color: '#9CA3AF' }}>Terms & Conditions</a>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/admin');
                else window.location.href = '/admin';
              }}
              style={{
                color: '#6B7280',
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
