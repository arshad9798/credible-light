import React from 'react';
import { FileText, Compass, CheckSquare, Cog, Wrench, Sparkles, ArrowRight } from 'lucide-react';

export default function ProcessSection({ steps = [] }) {
  const defaultSteps = [
    { step_number: 1, title: 'Share Requirement', description: 'Upload photo or tell us your concept & dimensions', icon: FileText },
    { step_number: 2, title: 'Get Design', description: 'We create a custom 3D architectural mockup', icon: Compass },
    { step_number: 3, title: 'Approve & Pay', description: 'Confirm technical design & transparent quotation', icon: CheckSquare },
    { step_number: 4, title: 'Manufacturing', description: 'High-precision laser CNC fabrication with IP67 LEDs', icon: Cog },
    { step_number: 5, title: 'Installation', description: 'Professional on-site installation at your location', icon: Wrench }
  ];

  const processList = steps.length > 0 ? steps : defaultSteps;

  const iconMap = {
    1: FileText,
    2: Compass,
    3: CheckSquare,
    4: Cog,
    5: Wrench
  };

  return (
    <section
      id="process"
      style={{
        padding: '90px 0',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 54px' }}>
          <div style={{ marginBottom: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.78rem' }}>
              <Sparkles size={13} color="var(--gold-primary)" />
              OUR PROCESS
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
            How It <span className="text-gold-gradient">Works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A streamlined 5-step journey from initial concept to a stunning illuminated signboard installed at your storefront.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '20px',
            position: 'relative'
          }}
        >
          {processList.map((step, idx) => {
            const IconComp = iconMap[step.step_number] || FileText;
            const isLast = idx === processList.length - 1;

            return (
              <div
                key={idx}
                className="card-glass"
                style={{
                  padding: '28px 20px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative'
                }}
              >
                {/* Step Number Circle */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(229, 169, 60, 0.1)',
                    border: '2px solid var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)',
                    marginBottom: '16px',
                    boxShadow: 'var(--gold-glow)'
                  }}
                >
                  <IconComp size={24} />
                </div>

                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: 'var(--gold-primary)',
                    textTransform: 'uppercase',
                    marginBottom: '6px'
                  }}
                >
                  Step {step.step_number || idx + 1}
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
