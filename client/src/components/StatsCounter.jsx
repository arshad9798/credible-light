import React from 'react';
import { Building2, Award, Calendar, HeartHandshake } from 'lucide-react';

export default function StatsCounter({ stats = [] }) {
  const defaultStats = [
    { stat_value: '500+', stat_label: 'Businesses Served', icon: 'Building2' },
    { stat_value: '1000+', stat_label: 'Projects Completed', icon: 'Award' },
    { stat_value: '10+', stat_label: 'Years Experience', icon: 'Calendar' },
    { stat_value: '100%', stat_label: 'Customer Satisfaction', icon: 'HeartHandshake' }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const iconMap = {
    Building2,
    Award,
    Calendar,
    HeartHandshake
  };

  return (
    <section
      style={{
        padding: '50px 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px'
          }}
        >
          {displayStats.map((item, idx) => {
            const IconComp = iconMap[item.icon] || Award;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: 'rgba(229, 169, 60, 0.1)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-primary)',
                    flexShrink: 0
                  }}
                >
                  <IconComp size={26} />
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '2.1rem',
                      fontWeight: 900,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--gold-primary)',
                      lineHeight: 1
                    }}
                  >
                    {item.stat_value}
                  </div>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginTop: '4px'
                    }}
                  >
                    {item.stat_label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
