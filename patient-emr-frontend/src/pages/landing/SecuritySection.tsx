import React, { useEffect, useRef, useState } from 'react';

const securityFeatures = [
  {
    icon: '🔐',
    title: 'End-to-End Encryption',
    description: '256-bit AES encryption for all data in transit and at rest. Your patient data is always protected.',
    color: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800/50',
  },
  {
    icon: '🛡️',
    title: 'Role-Based Access Control',
    description: 'Granular permissions ensure users only see what they need. Admin-managed provisioning with zero self-signup.',
    color: 'from-purple-500 to-indigo-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800/50',
  },
  {
    icon: '📋',
    title: 'Complete Audit Trail',
    description: 'Every action is logged with timestamp, user ID, and resource. 90-day retention for full accountability.',
    color: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  {
    icon: '⏱️',
    title: 'Session Management',
    description: 'Automatic session expiry, single-session enforcement, and instant logout across all devices.',
    color: 'from-orange-500 to-amber-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/50',
  },
  {
    icon: '🔑',
    title: 'Secure Authentication',
    description: 'bcrypt password hashing (12 rounds), JWT tokens, and brute-force protection built in.',
    color: 'from-rose-500 to-pink-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800/50',
  },
  {
    icon: '🌐',
    title: 'HIPAA Compliant',
    description: 'Built from the ground up with healthcare compliance in mind. Patient data handled with the highest standards.',
    color: 'from-secondary-500 to-green-400',
    bg: 'bg-secondary-50 dark:bg-secondary-950/30',
    border: 'border-secondary-200 dark:border-secondary-800/50',
  },
];

export const SecuritySection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="security" ref={ref} className="py-24 bg-white dark:bg-neutral-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-50 dark:bg-primary-950/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary-50 dark:bg-secondary-950/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800/50 mb-4">
            <span className="text-xs font-semibold text-error-700 dark:text-error-300 uppercase tracking-wide">Enterprise Security</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-headline text-neutral-900 dark:text-white mb-4">
            Security You Can{' '}
            <span className="gradient-text">Trust</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Patient data is sacred. Every layer of MediCore EMR is built with security-first principles.
          </p>
        </div>

        {/* Security grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-2xl ${feature.bg} border ${feature.border} hover:shadow-elevation-3 transition-all duration-300 hover:-translate-y-1 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-elevation-2 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Compliance badges */}
        <div className={`clay rounded-3xl p-8 text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-6">Compliance & Standards</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'HIPAA', desc: 'Health Insurance Portability', icon: '🏥' },
              { label: 'SOC 2', desc: 'Type II Certified', icon: '✅' },
              { label: 'GDPR', desc: 'Data Protection Ready', icon: '🇪🇺' },
              { label: 'AES-256', desc: 'Military-grade Encryption', icon: '🔒' },
              { label: 'JWT', desc: 'Secure Token Auth', icon: '🎫' },
              { label: 'bcrypt', desc: 'Password Hashing', icon: '🔑' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover:scale-105"
              >
                <span className="text-xl">{badge.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">{badge.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
