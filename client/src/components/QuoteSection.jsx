import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, ArrowRight, MessageCircle, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export default function QuoteSection({ services = [], settings = {}, preselectedService = null, onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    location: '',
    service_id: preselectedService ? preselectedService.id : '',
    service_name: preselectedService ? preselectedService.name : '3D Acrylic Letters',
    approx_size: '',
    requirement_details: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const fileInputRef = useRef(null);

  const bannerImage = settings.quote_banner_image || '/uploads/quote_banner_reception.jpg';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        onShowToast && onShowToast('File size must be under 15MB', 'error');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      onShowToast && onShowToast('Please enter your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('whatsapp', formData.whatsapp || formData.phone);
      data.append('location', formData.location);
      data.append('service_name', formData.service_name);
      data.append('approx_size', formData.approx_size);
      data.append('requirement_details', formData.requirement_details);

      if (formData.service_id) {
        data.append('service_id', formData.service_id);
      }
      if (selectedFile) {
        data.append('photo', selectedFile);
      }

      const res = await api.submitEnquiry(data);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }

      setSubmittedData({
        name: formData.name,
        phone: formData.phone,
        service: formData.service_name,
        whatsappLink: res.whatsappLink
      });

      onShowToast && onShowToast('Quotation request submitted successfully!', 'success');

      // Reset form fields
      setFormData({
        name: '',
        phone: '',
        whatsapp: '',
        location: '',
        service_id: '',
        service_name: '3D Acrylic Letters',
        approx_size: '',
        requirement_details: ''
      });
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error('Submission failed:', error);
      onShowToast && onShowToast(error.message || 'Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="quote"
      style={{
        padding: '90px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Main Grid: Left Form Card + Right Visual Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '30px',
            alignItems: 'stretch'
          }}
        >
          {/* Left Form Card */}
          <div
            className="card-glass"
            style={{
              padding: '36px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ marginBottom: '22px' }}>
              <span className="gold-badge" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                <Sparkles size={13} color="var(--gold-primary)" />
                GET A FREE QUOTE
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: '6px'
                }}
              >
                Tell Us About Your <span className="text-gold-gradient">Requirement</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Upload your shop / office photo and get a custom design mockup & price estimate.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Photo Upload Box */}
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{
                  border: '2px dashed var(--border-gold)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(229, 169, 60, 0.04)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 169, 60, 0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(229, 169, 60, 0.04)')}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                {filePreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                    <img
                      src={filePreview}
                      alt="Upload Preview"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid var(--border-gold)'
                      }}
                    />
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {selectedFile.name}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--gold-primary)' }}>
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB - Click to change
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      style={{
                        marginLeft: 'auto',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: 'none',
                        color: '#EF4444',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(229, 169, 60, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px',
                        color: 'var(--gold-primary)'
                      }}
                    >
                      <UploadCloud size={24} />
                    </div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '2px' }}>
                      Upload Shop / Office Photo
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      (JPG, PNG, WEBP - Max 15MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Service & Dimensions Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Select Board Type
                  </label>
                  <select
                    value={formData.service_name}
                    onChange={(e) => {
                      const selected = services.find((s) => s.name === e.target.value);
                      setFormData({
                        ...formData,
                        service_name: e.target.value,
                        service_id: selected ? selected.id : ''
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  >
                    {services.map((s) => (
                      <option key={s.id || s.slug} value={s.name} style={{ backgroundColor: '#151515', color: '#fff' }}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Custom Signage Solution" style={{ backgroundColor: '#151515', color: '#fff' }}>
                      Custom Signage Solution
                    </option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Approx. Size (in feet)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 x 3 ft"
                    value={formData.approx_size}
                    onChange={(e) => setFormData({ ...formData, approx_size: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Name & Phone Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    WhatsApp/Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 87896 40490"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Location / City Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bistupur, Jamshedpur"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1.05rem',
                  marginTop: '8px',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <span>{isSubmitting ? 'Submitting Details...' : 'Get Free Estimate'}</span>
                <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* Right Visual Trust Card */}
          <div
            className="card-glass"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '36px',
              border: '1px solid var(--border-subtle)',
              minHeight: '440px'
            }}
          >
            {/* Background Image of Reception Wall */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.7) 45%, rgba(5,5,5,0.4) 100%),
                  url(${bannerImage})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1
              }}
            />

            {/* Content overlay */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ marginBottom: '28px' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: 'var(--gold-primary)',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '8px'
                  }}
                >
                  GUARANTEED EXCELLENCE
                </span>
                <h3
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1.25,
                    marginBottom: '8px'
                  }}
                >
                  Your Brand Deserves the Spotlight
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Join over 500+ top brands, retail showrooms, restaurants, and medical centers who trust Credible Light.
                </p>
              </div>

              {/* Trust checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  'Free 3D Photorealistic Design Mockup',
                  'Instant Transparent Price Estimate',
                  'Precision Laser Manufacturing & IP67 LEDs',
                  'Pan-City Delivery & Master Installation'
                ].map((text, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(229, 169, 60, 0.15)',
                        border: '1px solid var(--gold-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--gold-primary)" />
                    </div>
                    <span style={{ fontSize: '0.96rem', fontWeight: 600, color: '#fff' }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal with WhatsApp Action */}
      {submittedData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="card-glass"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '36px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--gold-glow-lg)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSubmittedData(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(37, 211, 102, 0.15)',
                border: '2px solid #25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: '#25D366'
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Enquiry Received!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Thank you <strong style={{ color: 'var(--gold-primary)' }}>{submittedData.name}</strong>. Our design engineering team is reviewing your requirements for <strong style={{ color: 'var(--text-primary)' }}>{submittedData.service}</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={submittedData.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', fontSize: '1rem', padding: '14px' }}
              >
                <MessageCircle size={20} />
                <span>Chat Directly on WhatsApp</span>
              </a>

              <button
                onClick={() => setSubmittedData(null)}
                className="btn-secondary"
                style={{ width: '100%', padding: '12px' }}
              >
                Close & Return to Website
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
