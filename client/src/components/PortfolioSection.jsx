import React, { useState, useMemo } from 'react';
import { Sparkles, MapPin, ArrowRight, Eye, Layers } from 'lucide-react';

// Individual showcase card for every single uploaded image under its category
function PortfolioItemCard({ item, onSelectProject }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card-glass project-card"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: 'var(--bg-card)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        border: isHovered ? '1px solid var(--border-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered ? '0 14px 34px rgba(0, 0, 0, 0.6), 0 0 24px rgba(229, 169, 60, 0.22)' : 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onClick={() => onSelectProject({
        ...item,
        cover_image: item.displayImage,
        images: item.allImages && item.allImages.length > 0 ? item.allImages : [item.displayImage],
        initialImageIndex: item.initialImageIndex || 0
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* High-res Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a'
        }}
      >
        <img
          src={item.displayImage}
          alt={item.title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
        />

        {/* Gradient Overlay for luxury feel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.2) 60%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Category Pill Tag */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 3
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: 'rgba(5, 5, 5, 0.82)',
              backdropFilter: 'blur(8px)',
              color: 'var(--gold-primary)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            {item.category_name}
          </span>
        </div>

        {/* Multi-Photo Number Badge if part of a set */}
        {item.totalPhotos > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#fff',
              backgroundColor: 'rgba(5, 5, 5, 0.82)',
              backdropFilter: 'blur(8px)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(229, 169, 60, 0.4)'
            }}
          >
            <Layers size={11} color="var(--gold-primary)" />
            <span>Image {item.photoNumber}/{item.totalPhotos}</span>
          </div>
        )}

        {/* Location Badge (if single image) */}
        {item.totalPhotos <= 1 && item.location && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              backgroundColor: 'rgba(5, 5, 5, 0.8)',
              backdropFilter: 'blur(8px)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <MapPin size={11} color="var(--gold-primary)" />
            <span>{item.location}</span>
          </div>
        )}
      </div>

      {/* Card Meta Footer */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '3px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.title}
          </h4>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {item.location ? `📍 ${item.location}` : item.category_name}
            {item.totalPhotos > 1 && (
              <span style={{ color: 'var(--gold-primary)', marginLeft: '4px', fontSize: '0.75rem' }}>
                • View {item.photoNumber}
              </span>
            )}
          </span>
        </div>

        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: isHovered ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
            border: isHovered ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isHovered ? '#000' : 'var(--gold-primary)',
            transition: 'all 0.25s ease',
            flexShrink: 0
          }}
          title="Click to view full photo"
        >
          <Eye size={16} />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection({
  projects = [],
  categories = [],
  onSelectProject,
  onQuoteClick
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Decompose and flatten all projects into individual image showcase cards
  // This guarantees that all uploaded images appear separately under their respective category
  const allImageItems = useMemo(() => {
    const items = [];
    (projects || []).forEach((proj) => {
      let imgList = [];
      try {
        if (proj.images) {
          imgList = typeof proj.images === 'string' ? JSON.parse(proj.images) : proj.images;
        }
      } catch (e) {
        imgList = [];
      }

      if (!Array.isArray(imgList) || imgList.length === 0) {
        imgList = proj.cover_image ? [proj.cover_image] : ['/uploads/portfolio_spice_hub.jpg'];
      }

      if (imgList.length <= 1) {
        items.push({
          ...proj,
          displayImage: imgList[0] || proj.cover_image,
          allImages: imgList,
          initialImageIndex: 0,
          totalPhotos: 1,
          photoNumber: 1,
          itemKey: `proj-${proj.id || proj.slug}`
        });
      } else {
        // If multiple images are uploaded, show each image separately under the category
        imgList.forEach((imgUrl, idx) => {
          items.push({
            ...proj,
            displayImage: imgUrl,
            allImages: imgList,
            initialImageIndex: idx,
            totalPhotos: imgList.length,
            photoNumber: idx + 1,
            itemKey: `proj-${proj.id || proj.slug}-photo-${idx}`
          });
        });
      }
    });
    return items;
  }, [projects]);

  // Robust, dynamic category matching ensuring newly added categories map correctly
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return allImageItems;
    }

    const activeCatObj = categories.find((c) => c.slug === activeCategory);

    return allImageItems.filter((item) => {
      // 1. Direct numeric category_id match
      if (activeCatObj && Number(item.category_id) === Number(activeCatObj.id)) {
        return true;
      }
      // 2. Project category_id matches any category with this slug
      if (item.category_id && categories.some(c => c.slug === activeCategory && Number(c.id) === Number(item.category_id))) {
        return true;
      }
      // 3. Direct category_slug match
      if (item.category_slug && item.category_slug === activeCategory) {
        return true;
      }
      // 4. Normalized slugified category_name match
      const normSlug = (item.category_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (normSlug === activeCategory) {
        return true;
      }
      // 5. Exact category name match
      if (activeCatObj && item.category_name && item.category_name.toLowerCase().trim() === activeCatObj.name.toLowerCase().trim()) {
        return true;
      }
      return false;
    });
  }, [allImageItems, activeCategory, categories]);

  // Real-time photo counts per category for the filter pills
  const categoryCounts = useMemo(() => {
    const counts = { all: allImageItems.length };
    categories.forEach((cat) => {
      if (cat.slug === 'all') return;
      const count = allImageItems.filter((item) => {
        if (Number(item.category_id) === Number(cat.id)) return true;
        if (item.category_slug === cat.slug) return true;
        const normSlug = (item.category_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return normSlug === cat.slug || (item.category_name && item.category_name.toLowerCase().trim() === cat.name.toLowerCase().trim());
      }).length;
      counts[cat.slug] = count;
    });
    return counts;
  }, [allImageItems, categories]);

  return (
    <section
      id="work"
      style={{
        padding: '90px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '38px'
          }}
        >
          <div>
            <div style={{ marginBottom: '10px' }}>
              <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
                <Sparkles size={13} color="var(--gold-primary)" />
                OUR WORK GALLERY
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              Our <span className="text-gold-gradient">Recent</span> Projects
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '6px' }}>
              Browse real client sign board installations, acrylic lettering, and commercial interior branding
            </p>
          </div>

          <button
            onClick={onQuoteClick}
            className="btn-outline-gold"
            style={{
              padding: '10px 22px',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Request Custom Design</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '36px',
            scrollbarWidth: 'none'
          }}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            const count = categoryCounts[cat.slug] ?? 0;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#050505' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? 'var(--gold-glow)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid: Each uploaded image appears separately */}
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '16px' }}>
              No images uploaded under this category yet.
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            >
              View All Photos ({allImageItems.length})
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
              gap: '24px'
            }}
          >
            {filteredItems.map((item) => (
              <PortfolioItemCard
                key={item.itemKey}
                item={item}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
