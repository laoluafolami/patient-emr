import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { value: '4', suffix: ' Roles', label: 'Unified Platform', icon: '👥', color: 'from-blue-500 to-cyan-400' },
  { value: '99.9', suffix: '%', label: 'System Uptime', icon: '⚡', color: 'from-secondary-500 to-emerald-400' },
  { value: '256', suffix: '-bit', label: 'Encryption', icon: '🔒', color: 'from-purple-500 to-indigo-400' },
  { value: '24', suffix: '/7', label: 'Always Available', icon: '🌐', color: 'from-orange-500 to-amber-400' },
];

export const StatsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 animate-gradient" />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-4xl lg:text-5xl font-bold text-white font-headline mb-1">
                {stat.value}
                <span className="text-white/80">{stat.suffix}</span>
              </div>
              <p className="text-white/70 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
