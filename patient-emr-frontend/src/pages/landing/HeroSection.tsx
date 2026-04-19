import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ── Mini dashboard mockup cards ─────────────────────────── */
const dashboards = [
  {
    role: 'Patient',
    color: 'from-blue-500 to-cyan-400',
    icon: '🏥',
    badge: 'bg-blue-100 text-blue-700',
    stats: [
      { label: 'Next Appointment', value: 'Today 2:30 PM', icon: '📅' },
      { label: 'Active Prescriptions', value: '3 medications', icon: '💊' },
      { label: 'Lab Results', value: '2 new results', icon: '🧪' },
    ],
    vitals: [
      { name: 'Heart Rate', val: '72', unit: 'bpm', ok: true },
      { name: 'Blood Pressure', val: '120/80', unit: 'mmHg', ok: true },
      { name: 'Temperature', val: '36.6', unit: '°C', ok: true },
    ],
  },
  {
    role: 'Doctor',
    color: 'from-purple-500 to-indigo-400',
    icon: '👨‍⚕️',
    badge: 'bg-purple-100 text-purple-700',
    stats: [
      { label: "Today's Patients", value: '12 scheduled', icon: '👥' },
      { label: 'Pending Reports', value: '4 to review', icon: '📋' },
      { label: 'Lab Results', value: '7 uploaded', icon: '🔬' },
    ],
    vitals: [
      { name: 'Consultations', val: '8', unit: 'done', ok: true },
      { name: 'Prescriptions', val: '14', unit: 'issued', ok: true },
      { name: 'Reports', val: '6', unit: 'written', ok: true },
    ],
  },
  {
    role: 'Nurse',
    color: 'from-emerald-500 to-teal-400',
    icon: '👩‍⚕️',
    badge: 'bg-emerald-100 text-emerald-700',
    stats: [
      { label: 'Vitals Recorded', value: '18 patients', icon: '📊' },
      { label: 'Records Entered', value: '9 today', icon: '📝' },
      { label: 'Pending Tasks', value: '3 remaining', icon: '✅' },
    ],
    vitals: [
      { name: 'Temp Checks', val: '18', unit: 'done', ok: true },
      { name: 'BP Readings', val: '18', unit: 'done', ok: true },
      { name: 'Alerts', val: '0', unit: 'critical', ok: true },
    ],
  },
  {
    role: 'Admin',
    color: 'from-orange-500 to-amber-400',
    icon: '⚙️',
    badge: 'bg-orange-100 text-orange-700',
    stats: [
      { label: 'Active Users', value: '47 online', icon: '👤' },
      { label: 'System Health', value: '99.9% uptime', icon: '💚' },
      { label: 'Activity Logs', value: '1,284 events', icon: '📈' },
    ],
    vitals: [
      { name: 'Doctors', val: '12', unit: 'active', ok: true },
      { name: 'Nurses', val: '18', unit: 'active', ok: true },
      { name: 'Patients', val: '247', unit: 'total', ok: true },
    ],
  },
];

const DashboardMockup: React.FC<{ data: typeof dashboards[0]; isActive: boolean }> = ({ data, isActive }) => (
  <div
    className={`absolute inset-0 transition-all duration-700 ${
      isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
    }`}
  >
    <div className="clay rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Mockup header */}
      <div className={`bg-gradient-to-r ${data.color} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg">
            {data.icon}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{data.role} Dashboard</p>
            <p className="text-white/70 text-xs">MediCore EMR</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {data.stats.map((stat, i) => (
          <div key={i} className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-2.5 text-center">
            <div className="text-lg mb-1">{stat.icon}</div>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100 leading-tight">{stat.value}</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Vitals / metrics */}
      <div className="px-3 pb-3 space-y-2 flex-1">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Live Metrics</p>
        {data.vitals.map((v, i) => (
          <div key={i} className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/60 rounded-xl px-3 py-2">
            <span className="text-xs text-neutral-600 dark:text-neutral-300">{v.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-neutral-800 dark:text-neutral-100">{v.val}</span>
              <span className="text-[10px] text-neutral-400">{v.unit}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${v.ok ? 'bg-secondary-500' : 'bg-accent-500'} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-3 pb-3">
        <div className={`h-1 rounded-full bg-gradient-to-r ${data.color} opacity-60`} />
      </div>
    </div>
  </div>
);

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % dashboards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-400/20 dark:bg-primary-600/10 blur-3xl animate-drift" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary-400/20 dark:bg-secondary-600/10 blur-3xl animate-drift-slow" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-purple-400/10 blur-3xl animate-drift" style={{ animationDelay: '4s' }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(74,144,226,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,144,226,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left: Copy ─────────────────────────────────── */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 mb-6">
              <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 tracking-wide uppercase">
                Healthcare Management Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-headline font-bold leading-tight mb-6">
              <span className="block text-4xl sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white">
                Modern EMR
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl gradient-text mt-1">
                Reimagined
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl text-neutral-900 dark:text-white mt-1">
                for Everyone
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8 max-w-lg">
              One platform. Four roles. Seamless care delivery. MediCore EMR connects patients, nurses, doctors, and administrators in a beautifully unified experience.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-elevation-3 hover:shadow-elevation-4 transition-all duration-300 hover:scale-[1.03] animate-glow text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Dashboard
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-neutral-700 dark:text-neutral-200 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 hover:scale-[1.02] text-base"
              >
                Explore Features
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4">
              {[
                { icon: '🔒', label: 'HIPAA Compliant' },
                { icon: '🛡️', label: '256-bit Encrypted' },
                { icon: '✅', label: 'SOC 2 Type II' },
                { icon: '⚡', label: '99.9% Uptime' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/80 dark:border-neutral-700/80 shadow-elevation-1"
                >
                  <span className="text-sm">{badge.icon}</span>
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Dashboard mockup ─────────────────────── */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Role tabs */}
            <div className="flex gap-2 mb-4 justify-center lg:justify-start">
              {dashboards.map((d, i) => (
                <button
                  key={d.role}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    activeTab === i
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-elevation-2 scale-105'
                      : 'bg-white/70 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700'
                  }`}
                >
                  <span>{d.icon}</span>
                  <span className="hidden sm:inline">{d.role}</span>
                </button>
              ))}
            </div>

            {/* Mockup container */}
            <div className="relative h-[420px] lg:h-[480px] animate-float">
              {/* Glow behind card */}
              <div className={`absolute inset-4 rounded-3xl blur-2xl opacity-30 bg-gradient-to-br ${dashboards[activeTab].color} transition-all duration-700`} />

              {/* Card */}
              <div className="relative h-full rounded-2xl overflow-hidden shadow-elevation-4 border border-white/50 dark:border-neutral-700/50">
                {dashboards.map((d, i) => (
                  <DashboardMockup key={d.role} data={d} isActive={i === activeTab} />
                ))}
              </div>

              {/* Floating accent cards */}
              <div className="absolute -top-4 -right-4 clay rounded-2xl p-3 shadow-elevation-3 animate-float-delay hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary-600 dark:text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">All Systems</p>
                    <p className="text-[10px] text-secondary-600 dark:text-secondary-400">Operational ✓</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 clay rounded-2xl p-3 shadow-elevation-3 animate-float hidden lg:block" style={{ animationDelay: '3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-600 dark:text-primary-400 animate-heartbeat" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100">247 Patients</p>
                    <p className="text-[10px] text-primary-600 dark:text-primary-400">Under active care</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {dashboards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`transition-all duration-300 rounded-full ${
                    activeTab === i ? 'w-6 h-2 bg-primary-500' : 'w-2 h-2 bg-neutral-300 dark:bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">Scroll to explore</span>
          <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
};
