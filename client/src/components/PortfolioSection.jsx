import React, { useState } from 'react';
import { Sparkles, MapPin, ArrowRight, Eye, ExternalLink } from 'lucide-react';

export default function PortfolioSection({
  projects = [],
  categories = [],
  onSelectProject,
  onQuoteClick
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => {
        const catSlug = (p.category_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return catSlug.includes(activeCategory) || (p.category_slug && p.category_slug === activeCategory);
      });

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
                OUR WORK
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
          </div>

          <button
            onClick={onQuoteClick}
            className="btn-outline-gold"
            style={{
              padding: '10px 22px',
              fontSize: '0.9rem'
            }}
          >
            <span>Request Custom Design</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Filter Pills */}
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
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#050505' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? 'var(--gold-glow)' : 'none'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id || project.slug}
              className="card-glass"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: 'var(--bg-card)'
              }}
              onClick={() => onSelectProject(project)}
            >
              {/* Cover Image Container */}
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
                  src={project.cover_image}
                  alt={project.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.2) 60%, rgba(0,0,0,0) 100%)'
                  }}
                />

                {/* Category Pill Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 2
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(5, 5, 5, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--gold-primary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-gold)'
                    }}
                  >
                    {project.category_name}
                  </span>
                </div>

                {/* Location Badge */}
                {project.location && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      backgroundColor: 'rgba(5, 5, 5, 0.75)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <MapPin size={11} color="var(--gold-primary)" />
                    <span>{project.location}</span>
                  </div>
                )}
              </div>

              {/* Card Meta Footer */}
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '2px'
                    }}
                  >
                    {project.title}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {project.category_name}
                  </span>
                </div>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Eye size={15} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
