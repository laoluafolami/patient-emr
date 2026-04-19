import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
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
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 animate-gradient" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-drift" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-drift-slow" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 animate-float">
            <svg className="w-10 h-10 text-white animate-heartbeat" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-headline text-white mb-6 leading-tight">
            Ready to Transform
            <br />
            Your Healthcare Delivery?
          </h2>

          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the future of healthcare management. Contact your system administrator to get your account set up and start delivering better care today.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-primary-600 bg-white hover:bg-neutral-50 shadow-elevation-4 hover:shadow-elevation-4 transition-all duration-300 hover:scale-[1.03] text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In Now
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] text-lg"
            >
              Learn More
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            {[
              { icon: '🔒', text: 'No credit card required' },
              { icon: '⚡', text: 'Instant access after setup' },
              { icon: '🛡️', text: 'HIPAA compliant' },
              { icon: '💚', text: '99.9% uptime guarantee' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
