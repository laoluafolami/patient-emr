import React, { useEffect, useRef, useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Admin Creates Accounts',
    description: 'The system administrator creates user accounts and assigns roles — Patient, Nurse, Doctor, or Admin. Credentials are automatically emailed to each user.',
    icon: '👤',
    color: 'from-orange-500 to-amber-400',
    detail: 'Secure admin-only provisioning ensures no unauthorized access. Every account is tracked with creation timestamps and audit logs.',
    tags: ['Admin Portal', 'Role Assignment', 'Email Credentials'],
  },
  {
    number: '02',
    title: 'Users Sign In Securely',
    description: 'Users log in with their email and password through a single, unified URL. The system automatically routes each user to their role-specific dashboard.',
    icon: '🔐',
    color: 'from-primary-500 to-blue-400',
    detail: 'JWT-based authentication with 8-hour sessions, single-session enforcement, and automatic expiry protection.',
    tags: ['Single URL', 'JWT Auth', 'Role Routing'],
  },
  {
    number: '03',
    title: 'Nurses Prepare Patient Data',
    description: 'Nurses record vital signs and enter patient information before consultations, giving doctors a complete picture before they even enter the room.',
    icon: '📋',
    color: 'from-emerald-500 to-teal-400',
    detail: 'Structured forms for vitals (temperature, BP, heart rate, respiratory rate) with validation and instant doctor visibility.',
    tags: ['Vital Signs', 'Patient Records', 'Doctor Handoff'],
  },
  {
    number: '04',
    title: 'Doctors Conduct Consultations',
    description: 'Doctors review patient history, conduct consultations with auto-saving notes, write clinical reports, issue prescriptions, and upload lab results.',
    icon: '🩺',
    color: 'from-purple-500 to-indigo-400',
    detail: 'Auto-save every 30 seconds prevents data loss. Complete patient history visible during every consultation.',
    tags: ['Auto-Save', 'Lab Results', 'Prescriptions'],
  },
  {
    number: '05',
    title: 'Patients Stay Informed',
    description: 'Patients receive real-time updates — new lab results, prescriptions, and messages from their doctors — all in their personal health dashboard.',
    icon: '💚',
    color: 'from-secondary-500 to-green-400',
    detail: 'Patients can book appointments, track their health history, and communicate with their care team from any device.',
    tags: ['Real-time Updates', 'Appointment Booking', 'Health Tracking'],
  },
];

export const HowItWorksSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(74,144,226,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,144,226,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-secondary-100 dark:bg-secondary-900/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800/50 mb-4">
            <span className="text-xs font-semibold text-secondary-700 dark:text-secondary-300 uppercase tracking-wide">Seamless Workflow</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold font-headline text-neutral-900 dark:text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            From account creation to patient care — a smooth, connected workflow that keeps everyone in sync.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 mb-12">
          {steps.map((step, i) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(i)}
              className={`relative p-4 rounded-2xl text-left transition-all duration-300 ${
                activeStep === i
                  ? 'bg-white dark:bg-neutral-800 shadow-elevation-3 scale-105'
                  : 'bg-white/50 dark:bg-neutral-800/30 hover:bg-white/80 dark:hover:bg-neutral-800/60'
              } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Active indicator */}
              {activeStep === i && (
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${step.color}`} />
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-lg mb-3 ${activeStep === i ? 'scale-110' : ''} transition-transform duration-300`}>
                {step.icon}
              </div>
              <p className="text-xs font-bold text-neutral-400 dark:text-neutral-500 mb-1">{step.number}</p>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-tight">{step.title}</p>
            </button>
          ))}
        </div>

        {/* Active step detail */}
        <div
          key={activeStep}
          className={`clay rounded-3xl p-8 lg:p-10 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-left">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r ${steps[activeStep].color} text-white mb-6`}>
                <span className="text-xl">{steps[activeStep].icon}</span>
                <span className="font-bold text-sm">Step {steps[activeStep].number}</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold font-headline text-neutral-900 dark:text-white mb-4">
                {steps[activeStep].title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                {steps[activeStep].description}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed mb-6 italic">
                {steps[activeStep].detail}
              </p>
              <div className="flex flex-wrap gap-2">
                {steps[activeStep].tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual flow */}
            <div className="animate-slide-right">
              <div className="relative">
                {/* Connection line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700 to-transparent" />

                {steps.map((s, i) => (
                  <div
                    key={s.number}
                    className={`relative flex items-center gap-4 mb-4 last:mb-0 transition-all duration-300 ${
                      i === activeStep ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-all duration-300 ${
                      i === activeStep
                        ? `bg-gradient-to-br ${s.color} shadow-elevation-2 scale-110`
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}>
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${
                        i === activeStep ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-500'
                      }`}>
                        {s.title}
                      </p>
                      {i === activeStep && (
                        <div className={`h-1 rounded-full bg-gradient-to-r ${s.color} mt-1.5 animate-shimmer`} />
                      )}
                    </div>
                    {i === activeStep && (
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${s.color} animate-pulse flex-shrink-0`} />
                    )}
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
