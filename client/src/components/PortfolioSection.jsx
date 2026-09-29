import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, ArrowRight, Eye, Layers } from 'lucide-react';

// Single project card with automatic 1-second slideshow for multiple images
function ProjectCard({ project, onSelectProject }) {
  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [project.cover_image];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Automatic scroll/slideshow every 1 second (1000ms) as requested
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div
      className="card-glass project-card"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: 'var(--bg-card)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
      onClick={() => onSelectProject(project)}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(229, 169, 60, 0.2)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Cover Image / Multi-Image Slideshow Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a'
        }}
      >
        {/* Images Layer with Crossfade */}
        {images.map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt={`${project.title} - view ${idx + 1}`}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: idx === currentIdx ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out, transform 0.6s ease',
              transform: isHovered && idx === currentIdx ? 'scale(1.08)' : 'scale(1)',
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.2) 60%, rgba(0,0,0,0) 100%)',
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

        {/* Multi-Photo Count Badge (Only shown if card has >1 images) */}
        {images.length > 1 && (
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
              fontWeight: 700,
              color: '#fff',
              backgroundColor: 'rgba(5, 5, 5, 0.8)',
              backdropFilter: 'blur(8px)',
              padding: '4px 9px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(229, 169, 60, 0.5)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            <Layers size={12} color="var(--gold-primary)" />
            <span>{currentIdx + 1}/{images.length}</span>
            <span style={{ fontSize: '0.62rem', color: '#10B981', marginLeft: '2px', fontWeight: 800 }}>● 1s</span>
          </div>
        )}

        {/* Slideshow Dot Indicators */}
        {images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 4,
              display: 'flex',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(6px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(dotIdx);
                }}
                style={{
                  width: dotIdx === currentIdx ? '14px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: dotIdx === currentIdx ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                title={`View Photo ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Location Badge (If 1 photo only) */}
        {images.length === 1 && project.location && (
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
            {project.location ? `📍 ${project.location}` : project.category_name}
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
            color: 'var(--gold-primary)'
          }}
        >
          <Eye size={15} />
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

  // Filter projects by category dynamically
  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => {
        const catSlug = (p.category_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          catSlug === activeCategory ||
          catSlug.includes(activeCategory) ||
          (p.category_slug && p.category_slug === activeCategory) ||
          (p.category_id && categories.some(c => c.slug === activeCategory && c.id === p.category_id))
        );
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

        {/* Projects Grid: Each Project is a Single Card with 1s Multi-Image Auto-Slideshow */}
        {filteredProjects.length === 0 ? (
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
              No projects found in this category yet.
            </p>
            <button onClick={() => setActiveCategory('all')} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.86rem' }}>
              View All Projects
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
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id || project.slug}
                project={project}
                onSelectProject={onSelectProject}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
