import React, { useState, useRef, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Gift,
  Flame,
  MessageCircle,
  UploadCloud,
  Check,
  RotateCcw,
  Sliders,
  Type,
  Maximize2,
  Palette,
  Eye,
  ArrowRight,
  ShieldCheck,
  Star,
  Music,
  Heart,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export default function GiftsAndNeonSection({
  giftProducts = [],
  settings = {},
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('neon'); // 'neon' | 'lamps' | 'catalog'

  // ==========================================
  // NEON SIGN CUSTOMIZER STATES
  // ==========================================
  const [neonText, setNeonText] = useState('Better Together');
  const [selectedFont, setSelectedFont] = useState({
    id: 'script',
    name: 'Signature Script',
    family: "'Great Vibes', cursive",
    weight: '400',
    transform: 'none'
  });
  const [selectedColor, setSelectedColor] = useState({
    id: 'gold',
    name: 'Warm Golden Glow',
    hex: '#E5A93C',
    core: '#FFF4D6',
    glow: 'rgba(229, 169, 60, 0.9)'
  });
  const [wallBg, setWallBg] = useState('brick'); // 'brick' | 'living' | 'wood' | 'dark'
  const [neonSize, setNeonSize] = useState({
    id: 'medium',
    label: 'Medium (24" / 2 ft)',
    basePrice: 2499,
    inches: 24
  });
  const [backingStyle, setBackingStyle] = useState('cut_to_shape'); // 'cut_to_shape' | 'full_acrylic' | 'stand'
  const [includeDimmer, setIncludeDimmer] = useState(false);
  const [isWaterproof, setIsWaterproof] = useState(false);

  // Customer Contact info for Neon Order
  const [neonCustomer, setNeonCustomer] = useState({
    name: '',
    phone: '',
    city: ''
  });
  const [isOrderingNeon, setIsOrderingNeon] = useState(false);

  // ==========================================
  // ACRYLIC LAMP & SPOTIFY PLAQUE STATES
  // ==========================================
  const [lampType, setLampType] = useState('spotify'); // 'spotify' | 'couple_infinity' | 'photo_portrait' | 'nameplate'
  const [lampNames, setLampNames] = useState('Rahul & Sneha');
  const [lampSecondary, setLampSecondary] = useState('Kesariya - Arijit Singh');
  const [lampDate, setLampDate] = useState('14.02.2024');
  const [lampBase, setLampBase] = useState('wood'); // 'wood' | 'rgb_remote'
  const [lampSize, setLampSize] = useState('6x8'); // '6x8' | '8x10'
  const [lampPhoto, setLampPhoto] = useState(null);
  const [lampPhotoPreview, setLampPhotoPreview] = useState(null);
  const lampFileInputRef = useRef(null);

  const [lampCustomer, setLampCustomer] = useState({
    name: '',
    phone: '',
    city: ''
  });
  const [isOrderingLamp, setIsOrderingLamp] = useState(false);

  // Success Modal
  const [orderModalData, setOrderModalData] = useState(null);

  // Fonts list for Neon Customizer
  const neonFonts = [
    { id: 'script', name: 'Signature Script', family: "'Great Vibes', cursive", weight: '400', transform: 'none' },
    { id: 'pacifico', name: 'Retro Casual', family: "'Pacifico', cursive", weight: '400', transform: 'none' },
    { id: 'modern', name: 'Modern Bold', family: "'Montserrat', sans-serif", weight: '900', transform: 'uppercase' },
    { id: 'serif', name: 'Luxury Serif', family: "'Playfair Display', serif", weight: '700', transform: 'none' },
    { id: 'club', name: 'Futuristic Club', family: "'Orbitron', sans-serif", weight: '900', transform: 'uppercase' },
  ];

  // Colors list for Neon Customizer
  const neonColors = [
    { id: 'gold', name: 'Warm Gold', hex: '#E5A93C', core: '#FFF5D6', glow: 'rgba(229, 169, 60, 0.95)' },
    { id: 'pink', name: 'Electric Pink', hex: '#FF2A85', core: '#FFE5F1', glow: 'rgba(255, 42, 133, 0.95)' },
    { id: 'blue', name: 'Ice Blue', hex: '#00F0FF', core: '#E0FDFF', glow: 'rgba(0, 240, 255, 0.95)' },
    { id: 'white', name: 'Cozy Warm White', hex: '#FFF6E5', core: '#FFFFFF', glow: 'rgba(255, 246, 229, 0.95)' },
    { id: 'orange', name: 'Sunset Orange', hex: '#FF6B00', core: '#FFEBD9', glow: 'rgba(255, 107, 0, 0.95)' },
    { id: 'green', name: 'Emerald Green', hex: '#00FF85', core: '#E6FFF2', glow: 'rgba(0, 255, 133, 0.95)' },
    { id: 'purple', name: 'Royal Violet', hex: '#B026FF', core: '#F4E2FF', glow: 'rgba(176, 38, 255, 0.95)' },
    { id: 'red', name: 'Fiery Red', hex: '#FF2020', core: '#FFE6E6', glow: 'rgba(255, 32, 32, 0.95)' },
  ];

  // Neon Dynamic Price Calculation
  const neonCalculatedPrice = useMemo(() => {
    let total = neonSize.basePrice;
    // Extra character charge if long
    const charCount = neonText.trim().length;
    if (charCount > 15) {
      total += (charCount - 15) * 80;
    }
    if (includeDimmer) total += 299;
    if (isWaterproof) total += 399;
    return total;
  }, [neonSize, neonText, includeDimmer, isWaterproof]);

  // Lamp Dynamic Price Calculation
  const lampCalculatedPrice = useMemo(() => {
    let total = lampSize === '6x8' ? 1299 : 1699;
    if (lampBase === 'rgb_remote') total += 250;
    return total;
  }, [lampSize, lampBase]);

  // Wall Background Styles
  const getWallBackground = () => {
    if (wallBg === 'brick') {
      return 'linear-gradient(rgba(10,10,12,0.85), rgba(10,10,12,0.85)), repeating-linear-gradient(0deg, #18181c, #18181c 2px, #0e0e12 2px, #0e0e12 36px)';
    }
    if (wallBg === 'living') {
      return 'radial-gradient(circle at 50% 40%, #1f1f28 0%, #0d0d12 100%)';
    }
    if (wallBg === 'wood') {
      return 'repeating-linear-gradient(90deg, #1a140f, #1a140f 16px, #100b08 16px, #100b08 24px)';
    }
    return '#080808';
  };

  // Handle Photo Upload for Lamps
  const handleLampPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        onShowToast && onShowToast('File size must be under 15MB', 'error');
        return;
      }
      setLampPhoto(file);
      setLampPhotoPreview(URL.createObjectURL(file));
      onShowToast && onShowToast('Photo uploaded to 3D acrylic plaque preview!', 'success');
    }
  };

  // Submit Neon Order
  const handleOrderNeon = async (e) => {
    e.preventDefault();
    if (!neonCustomer.name.trim() || !neonCustomer.phone.trim()) {
      onShowToast && onShowToast('Please enter your Name and WhatsApp phone number', 'error');
      return;
    }

    setIsOrderingNeon(true);

    try {
      const formData = new FormData();
      formData.append('order_type', 'neon_sign');
      formData.append('product_name', `Custom Neon Sign (${neonText})`);
      formData.append('custom_text', neonText);
      formData.append('font_family', selectedFont.name);
      formData.append('glow_color', `${selectedColor.name} (${selectedColor.hex})`);
      formData.append('size', neonSize.label);
      formData.append('backing_style', backingStyle === 'cut_to_shape' ? 'Cut to Shape' : backingStyle === 'full_acrylic' ? 'Full Rectangle' : 'Stand Mount');
      formData.append('power_accessory', `${includeDimmer ? 'With Dimmer Controller, ' : ''}${isWaterproof ? 'Waterproof IP67' : 'Standard Indoor'}`);
      formData.append('estimated_price', neonCalculatedPrice);
      formData.append('customer_name', neonCustomer.name);
      formData.append('phone', neonCustomer.phone);
      formData.append('whatsapp', neonCustomer.phone);
      formData.append('delivery_city', neonCustomer.city || 'Pan-India');

      const res = await api.submitCustomOrder(formData);

      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (err) {}

      setOrderModalData({
        title: 'Custom Neon Sign Order Ready!',
        summary: `"${neonText}" in ${selectedColor.name} (${selectedFont.name})`,
        price: neonCalculatedPrice,
        whatsappLink: res.whatsappLink
      });

      onShowToast && onShowToast('Custom Neon Order created! Opening WhatsApp...', 'success');
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast(err.message || 'Failed to submit order', 'error');
    } finally {
      setIsOrderingNeon(false);
    }
  };

  // Submit Lamp Order
  const handleOrderLamp = async (e) => {
    e.preventDefault();
    if (!lampCustomer.name.trim() || !lampCustomer.phone.trim()) {
      onShowToast && onShowToast('Please enter your Name and WhatsApp phone number', 'error');
      return;
    }

    setIsOrderingLamp(true);

    try {
      const formData = new FormData();
      formData.append('order_type', 'acrylic_lamp');
      formData.append('product_name', lampType === 'spotify' ? 'Custom Spotify Song & Photo Plaque' : lampType === 'couple_infinity' ? 'Couple Infinity Heart 3D Lamp' : 'Custom Photo Acrylic Lamp');
      formData.append('custom_text', lampNames);
      formData.append('secondary_text', lampSecondary ? `${lampSecondary} (Date: ${lampDate})` : lampDate);
      formData.append('base_type', lampBase === 'wood' ? 'Solid Beech Wood Warm LED Base' : '16-Color RGB Base with Remote');
      formData.append('size', lampSize === '6x8' ? 'Desktop 6x8 inches' : 'Tabletop 8x10 inches');
      formData.append('glow_color', lampBase === 'wood' ? 'Warm Golden Glow' : 'Multi-Color RGB');
      formData.append('estimated_price', lampCalculatedPrice);
      formData.append('customer_name', lampCustomer.name);
      formData.append('phone', lampCustomer.phone);
      formData.append('whatsapp', lampCustomer.phone);
      formData.append('delivery_city', lampCustomer.city || 'Pan-India');

      if (lampPhoto) {
        formData.append('photo', lampPhoto);
      }

      const res = await api.submitCustomOrder(formData);

      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch (err) {}

      setOrderModalData({
        title: 'Custom Acrylic Lamp Order Created!',
        summary: `${lampNames} - ${lampSecondary || lampDate}`,
        price: lampCalculatedPrice,
        whatsappLink: res.whatsappLink
      });

      onShowToast && onShowToast('Gift Order created! Connect on WhatsApp to confirm.', 'success');
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast(err.message || 'Failed to submit lamp order', 'error');
    } finally {
      setIsOrderingLamp(false);
    }
  };

  return (
    <section
      id="gifts"
      style={{
        padding: '90px 0',
        backgroundColor: '#070707',
        position: 'relative',
        borderTop: '1px solid rgba(229, 169, 60, 0.25)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 46px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.8rem', padding: '7px 18px' }}>
              <Gift size={14} color="var(--gold-primary)" />
              PERSONALIZED GIFTS & CUSTOM NEON STUDIO
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '16px'
            }}
          >
            Custom <span className="text-gold-gradient">Neon Signs & 3D Acrylic</span> Gifts
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Design your luminous art piece with live real-time simulation! Custom LED neon signs for bedrooms, cafes & weddings, plus custom engraved 3D illusion acrylic lamps & Spotify song plaques.
          </p>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'inline-flex',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              marginTop: '28px',
              gap: '6px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={() => setActiveTab('neon')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'neon' ? 'var(--gold-primary)' : 'transparent',
                color: activeTab === 'neon' ? '#050505' : '#FFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'neon' ? 'var(--gold-glow)' : 'none'
              }}
            >
              <Zap size={16} />
              <span>Live Neon Sign Customizer</span>
            </button>

            <button
              onClick={() => setActiveTab('lamps')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'lamps' ? 'var(--gold-primary)' : 'transparent',
                color: activeTab === 'lamps' ? '#050505' : '#FFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'lamps' ? 'var(--gold-glow)' : 'none'
              }}
            >
              <Gift size={16} />
              <span>3D Acrylic Lamps & Spotify Plaques</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'catalog' ? 'var(--gold-primary)' : 'transparent',
                color: activeTab === 'catalog' ? '#050505' : '#FFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'catalog' ? 'var(--gold-glow)' : 'none'
              }}
            >
              <Sparkles size={16} />
              <span>Trending Ready Gifts ({giftProducts.length || 6})</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: LIVE NEON SIGN CUSTOMIZER (NeonAttack Style)
           ======================================================== */}
        {activeTab === 'neon' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '32px',
              alignItems: 'start'
            }}
          >
            {/* Visualizer Studio Canvas (Left) */}
            <div
              className="card-glass"
              style={{
                backgroundColor: '#0F0F12',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-gold)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg), 0 0 30px rgba(229, 169, 60, 0.15)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Canvas Header / Wall Selectors */}
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={16} color="var(--gold-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#DDD', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Live Neon Wall Simulation
                  </span>
                </div>

                {/* Wall Background Switcher */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'brick', label: 'Brick Loft' },
                    { id: 'living', label: 'Living Room' },
                    { id: 'wood', label: 'Wood Slats' },
                    { id: 'dark', label: 'Dark Studio' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setWallBg(w.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: wallBg === w.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: wallBg === w.id ? 'rgba(229, 169, 60, 0.2)' : 'rgba(255,255,255,0.04)',
                        color: wallBg === w.id ? 'var(--gold-primary)' : '#888',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Live Interactive Glowing Wall Canvas */}
              <div
                style={{
                  height: '420px',
                  background: getWallBackground(),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '30px',
                  overflow: 'hidden'
                }}
              >
                {/* Backing Acrylic Outline Simulation */}
                <div
                  style={{
                    padding: '24px 38px',
                    borderRadius: backingStyle === 'cut_to_shape' ? '28px' : backingStyle === 'stand' ? '12px' : '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(2px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(255, 255, 255, 0.05)',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '92%',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Neon Glow Lettering */}
                  <span
                    style={{
                      fontFamily: selectedFont.family,
                      fontWeight: selectedFont.weight,
                      textTransform: selectedFont.transform,
                      fontSize: neonText.length > 20 ? 'clamp(1.6rem, 3.5vw, 2.5rem)' : 'clamp(2rem, 5vw, 3.8rem)',
                      color: selectedColor.core,
                      textAlign: 'center',
                      lineHeight: 1.25,
                      textShadow: `
                        0 0 4px ${selectedColor.core},
                        0 0 10px ${selectedColor.hex},
                        0 0 22px ${selectedColor.hex},
                        0 0 45px ${selectedColor.glow},
                        0 0 75px ${selectedColor.glow}
                      `,
                      letterSpacing: selectedFont.id === 'club' ? '0.12em' : 'normal',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {neonText || 'Your Text Here'}
                  </span>

                  {/* Acrylic Stand Mount Foot */}
                  {backingStyle === 'stand' && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-14px',
                        width: '140px',
                        height: '14px',
                        backgroundColor: '#1E1E22',
                        borderRadius: '4px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.8)'
                      }}
                    />
                  )}
                </div>

                {/* Ambient Wall Light Bloom */}
                <div
                  style={{
                    position: 'absolute',
                    width: '350px',
                    height: '250px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${selectedColor.glow} 0%, rgba(0,0,0,0) 70%)`,
                    opacity: 0.3,
                    filter: 'blur(50px)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Size dimension marker */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.72rem',
                    color: '#AAA'
                  }}
                >
                  Est. Length: {neonSize.inches}" (~{Math.round(neonSize.inches * 2.54)} cm)
                </div>
              </div>

              {/* Price Calculation Ribbon */}
              <div
                style={{
                  padding: '18px 24px',
                  backgroundColor: 'rgba(20, 20, 24, 0.9)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#888', display: 'block' }}>
                    Calculated Estimate (Free Adapter & Mounting Included)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold-primary)' }}>
                      ₹{neonCalculatedPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'line-through' }}>
                      ₹{Math.round(neonCalculatedPrice * 1.5).toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>
                      33% OFF
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, display: 'block' }}>
                    ✓ 2-Year Replacement Warranty
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>
                    ✓ Free Pan-India Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Neon Options & Controls Panel (Right) */}
            <div
              className="card-glass"
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '30px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {/* 1. Text Input */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '8px' }}>
                  <span>1. Enter Your Custom Text *</span>
                  <span style={{ color: '#888', fontSize: '0.78rem' }}>{neonText.length} chars</span>
                </label>
                <input
                  type="text"
                  value={neonText}
                  onChange={(e) => setNeonText(e.target.value)}
                  placeholder="e.g. Better Together, Good Vibes, Coffee"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-gold)',
                    color: '#FFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              {/* 2. Font Style Picker */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '8px' }}>
                  2. Choose Typography Font Style
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {neonFonts.map((f) => {
                    const isSelected = selectedFont.id === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFont(f)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.08)',
                          backgroundColor: isSelected ? 'rgba(229, 169, 60, 0.15)' : 'rgba(255,255,255,0.03)',
                          color: isSelected ? 'var(--gold-primary)' : '#AAA',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontFamily: f.family, fontSize: '1.05rem', display: 'block', marginBottom: '2px', color: '#FFF' }}>
                          Aa Bb
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{f.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Glowing Neon Color Swatches */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '8px' }}>
                  <span>3. Select Glowing Neon Color</span>
                  <span style={{ color: selectedColor.hex, fontWeight: 700 }}>{selectedColor.name}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {neonColors.map((c) => {
                    const isSelected = selectedColor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          border: isSelected ? '3px solid #FFF' : '2px solid rgba(255,255,255,0.2)',
                          boxShadow: isSelected ? `0 0 16px ${c.glow}` : 'none',
                          cursor: 'pointer',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 4. Size & Backing Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '6px' }}>
                    4. Size
                  </label>
                  <select
                    value={neonSize.id}
                    onChange={(e) => {
                      const sizes = [
                        { id: 'small', label: 'Small (18" / 1.5 ft)', basePrice: 1799, inches: 18 },
                        { id: 'medium', label: 'Medium (24" / 2 ft)', basePrice: 2499, inches: 24 },
                        { id: 'large', label: 'Large (36" / 3 ft)', basePrice: 3699, inches: 36 },
                        { id: 'xl', label: 'XL (48" / 4 ft)', basePrice: 4999, inches: 48 },
                      ];
                      setNeonSize(sizes.find(s => s.id === e.target.value) || sizes[1]);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFF',
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="small">Small (18" / 1.5 ft) - ₹1,799</option>
                    <option value="medium">Medium (24" / 2 ft) - ₹2,499</option>
                    <option value="large">Large (36" / 3 ft) - ₹3,699</option>
                    <option value="xl">XL (48" / 4 ft) - ₹4,999</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '6px' }}>
                    Acrylic Backing
                  </label>
                  <select
                    value={backingStyle}
                    onChange={(e) => setBackingStyle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFF',
                      borderRadius: '6px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="cut_to_shape">Cut to Shape (Contoured)</option>
                    <option value="full_acrylic">Full Rectangle Backing</option>
                    <option value="stand">Tabletop Stand Base</option>
                  </select>
                </div>
              </div>

              {/* Addons Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#CCC', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeDimmer}
                    onChange={(e) => setIncludeDimmer(e.target.checked)}
                    style={{ accentColor: 'var(--gold-primary)' }}
                  />
                  <span>Add Touch Dimmer & Remote Controller (+₹299)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#CCC', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isWaterproof}
                    onChange={(e) => setIsWaterproof(e.target.checked)}
                    style={{ accentColor: 'var(--gold-primary)' }}
                  />
                  <span>Add Waterproof IP67 Outdoor Seal (+₹399)</span>
                </label>
              </div>

              {/* Customer Contact Inputs */}
              <form onSubmit={handleOrderNeon}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={neonCustomer.name}
                      onChange={(e) => setNeonCustomer({ ...neonCustomer, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 87896 40490"
                      value={neonCustomer.phone}
                      onChange={(e) => setNeonCustomer({ ...neonCustomer, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Delivery City / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Jamshedpur / Pan-India Delivery"
                    value={neonCustomer.city}
                    onChange={(e) => setNeonCustomer({ ...neonCustomer, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px', fontSize: '0.88rem' }}
                  />
                </div>

                {/* Order Submit Button */}
                <button
                  type="submit"
                  disabled={isOrderingNeon}
                  className="btn-whatsapp"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.05rem',
                    boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)'
                  }}
                >
                  <MessageCircle size={22} />
                  <span>{isOrderingNeon ? 'Preparing Order Details...' : `Order Custom Neon on WhatsApp (₹${neonCalculatedPrice})`}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: 3D ACRYLIC LAMPS & SPOTIFY PLAQUE STUDIO
           ======================================================== */}
        {activeTab === 'lamps' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '32px',
              alignItems: 'start'
            }}
          >
            {/* Visualizer Canvas (Left) */}
            <div
              className="card-glass"
              style={{
                backgroundColor: '#0E0E12',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-gold)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg), 0 0 30px rgba(229, 169, 60, 0.15)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gift size={16} color="var(--gold-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#DDD', textTransform: 'uppercase' }}>
                    3D Acrylic Optical Illusion Preview
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                  Laser Engraved Cast Acrylic
                </span>
              </div>

              {/* Lamp 3D Canvas */}
              <div
                style={{
                  height: '460px',
                  background: 'radial-gradient(circle at 50% 65%, #2a2016 0%, #0a0a0c 70%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '20px',
                  overflow: 'hidden'
                }}
              >
                {/* Acrylic Plaque Body */}
                <div
                  style={{
                    width: lampSize === '6x8' ? '250px' : '280px',
                    height: lampSize === '6x8' ? '300px' : '340px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(3px)',
                    border: '2px solid rgba(255, 220, 140, 0.45)',
                    borderRadius: '12px 12px 0 0',
                    boxShadow: '0 0 25px rgba(229, 169, 60, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {/* Photo or Album Art Container */}
                  <div
                    style={{
                      width: '180px',
                      height: '180px',
                      borderRadius: lampType === 'couple_infinity' ? '50%' : '8px',
                      backgroundColor: '#1C1C22',
                      border: '1px solid rgba(255,255,255,0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                      position: 'relative'
                    }}
                  >
                    {lampPhotoPreview ? (
                      <img
                        src={lampPhotoPreview}
                        alt="Custom Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '12px' }}>
                        {lampType === 'spotify' ? (
                          <Music size={36} color="var(--gold-primary)" style={{ margin: '0 auto 6px' }} />
                        ) : (
                          <Heart size={36} color="#FF6B8B" style={{ margin: '0 auto 6px' }} />
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#AAA', display: 'block' }}>
                          Upload photo to preview on plaque
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Custom Names Text */}
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#FFF9E6',
                        textShadow: '0 0 8px rgba(229, 169, 60, 0.8)',
                        lineHeight: 1.2
                      }}
                    >
                      {lampNames || 'Rahul & Sneha'}
                    </div>

                    {lampSecondary && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', fontWeight: 600, marginTop: '2px' }}>
                        {lampSecondary}
                      </div>
                    )}

                    {lampDate && (
                      <div style={{ fontSize: '0.72rem', color: '#AAA', marginTop: '2px' }}>
                        {lampDate}
                      </div>
                    )}

                    {/* Spotify Plaque Barcode Simulation */}
                    {lampType === 'spotify' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '8px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'var(--gold-primary)' }} />
                        {[12, 18, 8, 22, 14, 26, 10, 18, 14, 22, 8, 16].map((h, i) => (
                          <div key={i} style={{ width: '3px', height: `${h}px`, backgroundColor: '#FFF' }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3D Wooden Base */}
                <div
                  style={{
                    width: '310px',
                    height: '42px',
                    backgroundColor: lampBase === 'wood' ? '#8B5A2B' : '#141416',
                    backgroundImage: lampBase === 'wood'
                      ? 'linear-gradient(to bottom, #A06535 0%, #7A4920 100%)'
                      : 'linear-gradient(to bottom, #252528 0%, #101012 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.9), 0 0 25px rgba(229, 169, 60, 0.4)',
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Glowing LED slot */}
                  <div
                    style={{
                      width: '240px',
                      height: '5px',
                      backgroundColor: lampBase === 'wood' ? '#FFE494' : '#00F0FF',
                      borderRadius: '3px',
                      boxShadow: `0 0 15px ${lampBase === 'wood' ? '#E5A93C' : '#00F0FF'}`
                    }}
                  />
                </div>
              </div>

              {/* Price Ribbon */}
              <div
                style={{
                  padding: '18px 24px',
                  backgroundColor: 'rgba(20, 20, 24, 0.9)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#888' }}>
                    Turnkey Price (Gift Box Packaging Included)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold-primary)' }}>
                      ₹{lampCalculatedPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#666', textDecoration: 'line-through' }}>
                      ₹{Math.round(lampCalculatedPrice * 1.6).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700 }}>
                  ⚡ Dispatches in 24 Hours
                </span>
              </div>
            </div>

            {/* Lamp Options Form (Right) */}
            <div
              className="card-glass"
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '30px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {/* Template Picker */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '8px' }}>
                  1. Choose Acrylic Gift Design
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'spotify', label: 'Spotify Song Plaque', desc: 'Song title + barcode' },
                    { id: 'couple_infinity', label: 'Couple Infinity Heart', desc: 'Two names + date' },
                    { id: 'photo_portrait', label: 'Laser Photo Lamp', desc: 'Custom portrait etching' },
                    { id: 'nameplate', label: 'Executive Desk Lamp', desc: 'Name & designation' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setLampType(t.id);
                        if (t.id === 'spotify') {
                          setLampSecondary('Kesariya - Arijit Singh');
                        } else if (t.id === 'couple_infinity') {
                          setLampSecondary('Happy Anniversary');
                        } else if (t.id === 'nameplate') {
                          setLampSecondary('Managing Director');
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: lampType === t.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: lampType === t.id ? 'rgba(229, 169, 60, 0.15)' : 'rgba(255,255,255,0.03)',
                        color: lampType === t.id ? 'var(--gold-primary)' : '#AAA',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#FFF' }}>{t.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload for Lamp */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#DDD', marginBottom: '8px' }}>
                  2. Upload Couple / Family Photo (Optional)
                </label>
                <div
                  onClick={() => lampFileInputRef.current && lampFileInputRef.current.click()}
                  style={{
                    border: '2px dashed var(--border-gold)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(229, 169, 60, 0.04)'
                  }}
                >
                  <input
                    type="file"
                    ref={lampFileInputRef}
                    onChange={handleLampPhotoChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  {lampPhotoPreview ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <img src={lampPhotoPreview} alt="Uploaded" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF', display: 'block' }}>Photo Attached!</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)' }}>Click to replace photo</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud size={24} color="var(--gold-primary)" style={{ margin: '0 auto 6px' }} />
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FFF', display: 'block' }}>Upload Photo for Acrylic Print</span>
                      <span style={{ fontSize: '0.72rem', color: '#888' }}>High-definition UV printing on cast acrylic</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customization Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>
                    Main Text / Names *
                  </label>
                  <input
                    type="text"
                    required
                    value={lampNames}
                    onChange={(e) => setLampNames(e.target.value)}
                    placeholder="e.g. Rahul & Sneha"
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>
                      {lampType === 'spotify' ? 'Song Title & Artist' : 'Subtitle / Occasion'}
                    </label>
                    <input
                      type="text"
                      value={lampSecondary}
                      onChange={(e) => setLampSecondary(e.target.value)}
                      placeholder="e.g. Kesariya / Happy Anniversary"
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>
                      Date on Base
                    </label>
                    <input
                      type="text"
                      value={lampDate}
                      onChange={(e) => setLampDate(e.target.value)}
                      placeholder="e.g. 14.02.2024"
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Base & Size Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>
                    LED Base Type
                  </label>
                  <select
                    value={lampBase}
                    onChange={(e) => setLampBase(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                  >
                    <option value="wood">Solid Beech Wood Warm LED</option>
                    <option value="rgb_remote">16-Color RGB with Remote (+₹250)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>
                    Plaque Size
                  </label>
                  <select
                    value={lampSize}
                    onChange={(e) => setLampSize(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                  >
                    <option value="6x8">Desktop (6x8 inches)</option>
                    <option value="8x10">Tabletop Large (8x10 inches) (+₹400)</option>
                  </select>
                </div>
              </div>

              {/* Customer Contact & Order */}
              <form onSubmit={handleOrderLamp}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter name"
                      value={lampCustomer.name}
                      onChange={(e) => setLampCustomer({ ...lampCustomer, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#AAA', marginBottom: '4px' }}>WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 87896 40490"
                      value={lampCustomer.phone}
                      onChange={(e) => setLampCustomer({ ...lampCustomer, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOrderingLamp}
                  className="btn-whatsapp"
                  style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '6px' }}
                >
                  <MessageCircle size={22} />
                  <span>{isOrderingLamp ? 'Processing...' : `Order Custom Lamp on WhatsApp (₹${lampCalculatedPrice})`}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: TRENDING READY-TO-ORDER GIFTS CATALOG
           ======================================================== */}
        {activeTab === 'catalog' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '26px'
            }}
          >
            {giftProducts.map((gift) => (
              <div
                key={gift.id || gift.slug}
                className="card-glass"
                style={{
                  backgroundColor: '#121214',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#000' }}>
                    <img
                      src={gift.image_url}
                      alt={gift.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {gift.tag && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'var(--gold-primary)',
                          color: '#050505',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          boxShadow: 'var(--gold-glow)'
                        }}
                      >
                        {gift.tag}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#E5A93C" color="#E5A93C" />
                      ))}
                      <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '6px' }}>4.9 (140+ reviews)</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                      {gift.name}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#888', lineHeight: 1.5, marginBottom: '16px' }}>
                      {gift.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                        ₹{gift.price.toLocaleString('en-IN')}
                      </span>
                      {gift.original_price && (
                        <span style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'line-through' }}>
                          ₹{gift.original_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      if (gift.customization_type === 'neon') {
                        setActiveTab('neon');
                        setNeonText(gift.name.replace(/Neon Sign/i, '').trim());
                      } else {
                        setActiveTab('lamps');
                        setLampType(gift.customization_type === 'spotify' ? 'spotify' : 'couple_infinity');
                      }
                      onShowToast && onShowToast(`Loaded ${gift.name} into customizer!`, 'success');
                    }}
                    className="btn-outline-gold"
                    style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                  >
                    <span>Customize This</span>
                    <ArrowRight size={14} />
                  </button>

                  <a
                    href={`https://wa.me/918789640490?text=${encodeURIComponent(
                      `Hi Credible Light, I want to order the '${gift.name}' (₹${gift.price}). Please share customization steps!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                    style={{ padding: '10px 14px' }}
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Confirmation Modal with WhatsApp Direct Link */}
      {orderModalData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
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
              backgroundColor: '#121215',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--gold-glow-lg)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setOrderModalData(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#888',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 211, 102, 0.15)',
                border: '2px solid #25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#25D366'
              }}
            >
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              {orderModalData.title}
            </h3>

            <p style={{ color: '#AAA', fontSize: '0.9rem', marginBottom: '6px' }}>
              {orderModalData.summary}
            </p>

            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-primary)', marginBottom: '22px' }}>
              Total: ₹{orderModalData.price.toLocaleString('en-IN')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={orderModalData.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                <MessageCircle size={20} />
                <span>Confirm & Send Details on WhatsApp</span>
              </a>

              <button
                onClick={() => setOrderModalData(null)}
                className="btn-secondary"
                style={{ width: '100%', padding: '12px' }}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
