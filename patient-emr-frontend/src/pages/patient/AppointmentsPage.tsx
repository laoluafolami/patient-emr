import React, { useState } from 'react';
import { SectionHeader } from '../../components/dashboard/SectionHeader';
import { EmptyState } from '../../components/dashboard/EmptyState';

const doctors = [
  { id: 1, name: 'Dr. James Smith', specialty: 'General Practice', avatar: '👨‍⚕️', available: true },
  { id: 2, name: 'Dr. Sarah Lee', specialty: 'Cardiology', avatar: '👩‍⚕️', available: true },
  { id: 3, name: 'Dr. Michael Chen', specialty: 'Dermatology', avatar: '👨‍⚕️', available: true },
  { id: 4, name: 'Dr. Emily Davis', specialty: 'Neurology', avatar: '👩‍⚕️', available: false },
];

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

const existingAppointments = [
  { id: 1, doctor: 'Dr. James Smith', specialty: 'General Practice', date: 'Dec 17, 2024', time: '2:30 PM', status: 'confirmed', reason: 'Annual checkup', avatar: '👨‍⚕️' },
  { id: 2, doctor: 'Dr. Sarah Lee', specialty: 'Cardiology', date: 'Dec 20, 2024', time: '10:00 AM', status: 'scheduled', reason: 'Follow-up consultation', avatar: '👩‍⚕️' },
  { id: 3, doctor: 'Dr. Michael Chen', specialty: 'Dermatology', date: 'Nov 30, 2024', time: '3:15 PM', status: 'completed', reason: 'Skin examination', avatar: '👨‍⚕️' },
  { id: 4, doctor: 'Dr. James Smith', specialty: 'General Practice', date: 'Nov 15, 2024', time: '9:00 AM', status: 'completed', reason: 'Blood pressure review', avatar: '👨‍⚕️' },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  confirmed: { label: 'Confirmed', color: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300', dot: 'bg-secondary-500' },
  scheduled: { label: 'Scheduled', color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300', dot: 'bg-primary-500' },
  completed: { label: 'Completed', color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400', dot: 'bg-neutral-400' },
  cancelled: { label: 'Cancelled', color: 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300', dot: 'bg-error-500' },
};

type BookingStep = 'doctor' | 'datetime' | 'reason' | 'confirm' | 'success';

export const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBooking, setShowBooking] = useState(false);
  const [step, setStep] = useState<BookingStep>('doctor');
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upcoming = existingAppointments.filter(a => a.status !== 'completed');
  const past = existingAppointments.filter(a => a.status === 'completed');

  const handleBook = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setStep('success');
  };

  const resetBooking = () => {
    setShowBooking(false);
    setStep('doctor');
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Appointments</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Manage your healthcare consultations</p>
        </div>
        <button
          onClick={() => setShowBooking(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300 hover:scale-[1.03]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-elevation-1'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            {tab} ({tab === 'upcoming' ? upcoming.length : past.length})
          </button>
        ))}
      </div>

      {/* Appointment list */}
      <div className="space-y-3">
        {(activeTab === 'upcoming' ? upcoming : past).length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-8">
            <EmptyState icon="📅" title="No appointments" description={activeTab === 'upcoming' ? 'Book your first appointment to get started.' : 'No past appointments found.'} action={activeTab === 'upcoming' ? <button onClick={() => setShowBooking(true)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400">Book Now</button> : undefined} />
          </div>
        ) : (
          (activeTab === 'upcoming' ? upcoming : past).map((apt, i) => {
            const sc = statusConfig[apt.status];
            return (
              <div key={apt.id} className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 hover:-translate-y-0.5 animate-fade-up`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl flex-shrink-0">{apt.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-bold text-neutral-900 dark:text-white">{apt.doctor}</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{apt.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {apt.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {apt.reason}
                      </div>
                    </div>
                  </div>
                  {apt.status !== 'completed' && (
                    <button className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950/20 hover:bg-error-100 dark:hover:bg-error-950/40 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={step !== 'success' ? resetBooking : undefined}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-lg border border-neutral-100 dark:border-neutral-800 animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Book Appointment</h3>
                {step !== 'success' && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {(['doctor', 'datetime', 'reason', 'confirm'] as BookingStep[]).map((s, i) => (
                      <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step === s ? 'w-6 bg-blue-500' : ['doctor', 'datetime', 'reason', 'confirm'].indexOf(step) > i ? 'w-4 bg-blue-300' : 'w-4 bg-neutral-200 dark:bg-neutral-700'}`} />
                    ))}
                  </div>
                )}
              </div>
              <button onClick={resetBooking} className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {/* Step 1: Select Doctor */}
              {step === 'doctor' && (
                <div className="animate-fade-in space-y-3">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Select a Doctor</p>
                  {doctors.map(doc => (
                    <button key={doc.id} onClick={() => { if (doc.available) { setSelectedDoctor(doc); setStep('datetime'); } }} disabled={!doc.available}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedDoctor?.id === doc.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : doc.available ? 'border-neutral-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/10' : 'border-neutral-100 dark:border-neutral-800 opacity-50 cursor-not-allowed'}`}>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl flex-shrink-0">{doc.avatar}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-800 dark:text-neutral-100">{doc.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{doc.specialty}</p>
                      </div>
                      {!doc.available && <span className="text-xs text-neutral-400">Unavailable</span>}
                      {doc.available && <svg className="w-4 h-4 text-neutral-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 'datetime' && (
                <div className="animate-fade-in space-y-4">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Select Date & Time</p>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Date</label>
                    <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all" />
                  </div>
                  {selectedDate && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(slot => (
                          <button key={slot} onClick={() => setSelectedTime(slot)}
                            className={`py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${selectedTime === slot ? 'bg-blue-500 text-white shadow-elevation-1' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep('doctor')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Back</button>
                    <button onClick={() => setStep('reason')} disabled={!selectedDate || !selectedTime} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Continue</button>
                  </div>
                </div>
              )}

              {/* Step 3: Reason */}
              {step === 'reason' && (
                <div className="animate-fade-in space-y-4">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Reason for Visit</p>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe your symptoms or reason for the appointment..." rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all resize-none" />
                  <div className="flex gap-3">
                    <button onClick={() => setStep('datetime')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Back</button>
                    <button onClick={() => setStep('confirm')} disabled={!reason.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all">Review</button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 'confirm' && (
                <div className="animate-fade-in space-y-4">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Confirm Appointment</p>
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 space-y-3 border border-blue-100 dark:border-blue-900/40">
                    {[
                      { label: 'Doctor', value: selectedDoctor?.name },
                      { label: 'Specialty', value: selectedDoctor?.specialty },
                      { label: 'Date', value: selectedDate },
                      { label: 'Time', value: selectedTime },
                      { label: 'Reason', value: reason },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between text-sm">
                        <span className="text-neutral-500 dark:text-neutral-400">{row.label}</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-right max-w-[60%]">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep('reason')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Back</button>
                    <button onClick={handleBook} disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 disabled:opacity-60 transition-all">
                      {isSubmitting ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Booking...</span> : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {step === 'success' && (
                <div className="text-center py-4 animate-scale-in">
                  <div className="w-20 h-20 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Appointment Booked!</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Your appointment with <strong>{selectedDoctor?.name}</strong></p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> is confirmed.</p>
                  <button onClick={resetBooking} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
