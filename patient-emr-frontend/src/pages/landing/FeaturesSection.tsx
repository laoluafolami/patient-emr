import React, { useEffect, useRef, useState } from 'react';

const roles = [
  {
    role: 'Patient',
    emoji: '🏥',
    gradient: 'from-blue-500 to-cyan-400',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800/50',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    description: 'Take control of your health journey with a personal dashboard designed around you.',
    features: [
      { icon: '📅', title: 'Book Appointments', desc: 'Schedule consultations with your doctor in seconds' },
      { icon: '🧪', title: 'View Lab Results', desc: 'Access all your test results with detailed explanations' },
      { icon: '💊', title: 'Track Prescriptions', desc: 'Monitor active medications, dosages, and schedules' },
      { icon: '💬', title: 'Doctor Messages', desc: 'Receive direct communications from your care team' },
      { icon: '📊', title: 'Health Summary', desc: 'See your vitals history and health trends at a glance' },
    ],
  },
  {
    role: 'Doctor',
    emoji: '👨‍⚕️',
    gradient: 'from-purple-500 to-indigo-400',
    lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800/50',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'A clinical workspace built for efficiency — everything you need, exactly when you need it.',
    features: [
      { icon: '📋', title: 'Patient History', desc: 'Complete medical history at your fingertips' },
      { icon: '🩺', title: 'Consultations', desc: 'Conduct and document consultations with auto-save' },
      { icon: '📝', title: 'Clinical Reports', desc: 'Write and store detailed patient reports' },
      { icon: '🔬', title: 'Lab Management', desc: 'Upload and review lab results with patient notifications' },
      { icon: '💊', title: 'Prescriptions', desc: 'Issue and manage medication prescriptions digitally' },
    ],
  },
  {
    role: 'Nurse',
    emoji: '👩‍⚕️',
    gradient: 'from-emerald-500 to-teal-400',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    description: 'Streamlined tools to support clinical workflows and keep patient data accurate.',
    features: [
      { icon: '❤️', title: 'Vital Signs', desc: 'Record temperature, BP, heart rate, and more' },
      { icon: '📝', title: 'Patient Records', desc: 'Enter and update patient information efficiently' },
      { icon: '⚡', title: 'Quick Entry', desc: 'Fast-access forms designed for clinical speed' },
      { icon: '🔗', title: 'Doctor Handoff', desc: 'Seamlessly pass records to assigned physicians' },
      { icon: '📊', title: 'Entry History', desc: 'Review all recent entries with timestamps' },
    ],
  },
  {
    role: 'Admin',
    emoji: '⚙️',
    gradient: 'from-orange-500 to-amber-400',
    lightBg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/50',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    iconColor: 'text-orange-600 dark:text-orange-400',
    description: 'Full control over the platform — users, settings, and real-time system monitoring.',
    features: [
      { icon: '👤', title: 'User Management', desc: 'Create accounts, assign roles, reset passwords' },
      { icon: '📈', title: 'Activity Logs', desc: 'Real-time feed of every action in the system' },
      { icon: '🔧', title: 'System Settings', desc: 'Configure appointments, retention, and notifications' },
      { icon: '📡', title: 'Live Monitoring', desc: 'Track active sessions and system health' },
      { icon: '🛡️', title: 'Security Control', desc: 'Deactivate accounts and manage access instantly' },
    ],
  },
];

export const FeaturesSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const role = roles[activeRole];

  return (
    <section id="features" ref={ref} className="py-24 bg-white dark:bg-neutral-900 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-50 dark:bg-primary-950/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-secondary-50 dark:bg-secondary-950/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 mb-4">
            <span className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wide">Built for Every Role</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-headline text-neutral-900 dark:text-white mb-4">
            One Platform,{' '}
            <span className="gradient-text">Four Experiences</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Each role gets a tailored interface with exactly the tools they need — nothing more, nothing less.
          </p>
        </div>

        {/* Role selector tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {roles.map((r, i) => (
            <button
              key={r.role}
              onClick={() => setActiveRole(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                activeRole === i
                  ? `bg-gradient-to-r ${r.gradient} text-white shadow-elevation-3 scale-105`
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="text-base">{r.emoji}</span>
              {r.role}
            </button>
          ))}
        </div>

        {/* Feature content */}
        <div className={`grid lg:grid-cols-2 gap-10 items-center transition-all duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Left: description + feature list */}
          <div key={activeRole} className="animate-slide-left">
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl ${role.lightBg} border ${role.border} mb-6`}>
              <span className="text-2xl">{role.emoji}</span>
              <span className={`font-bold text-sm ${role.iconColor}`}>{role.role} Portal</span>
            </div>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              {role.description}
            </p>

            <div className="space-y-4">
              {role.features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-200 group cursor-default"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${role.iconBg} flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual card */}
          <div key={`card-${activeRole}`} className="animate-slide-right">
            <div className={`relative rounded-3xl overflow-hidden shadow-elevation-4 border ${role.border}`}>
              {/* Card header */}
              <div className={`bg-gradient-to-r ${role.gradient} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                      {role.emoji}
                    </div>
                    <div>
                      <p className="text-white font-bold">{role.role} Dashboard</p>
                      <p className="text-white/70 text-xs">MediCore EMR System</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                  </div>
                </div>
                {/* Mini stat row */}
                <div className="grid grid-cols-3 gap-2">
                  {role.features.slice(0, 3).map((f) => (
                    <div key={f.title} className="bg-white/15 rounded-xl p-2.5 text-center">
                      <div className="text-lg mb-1">{f.icon}</div>
                      <p className="text-white text-[10px] font-medium leading-tight">{f.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card body */}
              <div className={`${role.lightBg} p-6 space-y-3`}>
                {role.features.map((f, i) => (
                  <div key={f.title} className="flex items-center gap-3 bg-white/60 dark:bg-neutral-800/60 rounded-xl px-4 py-3">
                    <span className="text-base">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">{f.title}</span>
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                      </div>
                      <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${role.gradient} rounded-full transition-all duration-1000`}
                          style={{ width: `${85 - i * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
