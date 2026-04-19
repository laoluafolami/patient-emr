import React, { useState } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';

const patients = [
  { id: 1, name: 'John Doe', patientId: 'P-001' },
  { id: 2, name: 'Mary Johnson', patientId: 'P-002' },
  { id: 3, name: 'Robert Chen', patientId: 'P-003' },
  { id: 4, name: 'Sarah Williams', patientId: 'P-004' },
];

const initialMessages = [
  { id: 1, from: 'John Doe', fromId: 1, subject: 'Question about medication', content: 'Dr. Smith, I have been experiencing some side effects from the Metformin. Should I reduce the dosage?', time: '2h ago', date: 'Dec 15, 2024', unread: true, fromPatient: true },
  { id: 2, from: 'Mary Johnson', fromId: 2, subject: 'Follow-up appointment', content: 'Hello Doctor, I wanted to confirm my appointment for next week. Also, my blood sugar readings have been improving.', time: '1d ago', date: 'Dec 14, 2024', unread: true, fromPatient: true },
  { id: 3, from: 'Robert Chen', fromId: 3, subject: 'ECG results concern', content: 'I received my ECG report and I am a bit worried about the results. Can we discuss this at our next appointment?', time: '2d ago', date: 'Dec 13, 2024', unread: false, fromPatient: true },
];

export const DoctorMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<typeof initialMessages[0] | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [reply, setReply] = useState('');
  const [composePatient, setComposePatient] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSelect = (msg: typeof initialMessages[0]) => {
    setSelected(msg);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, unread: false } : m));
    setReply('');
  };

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    setSending(false);
    setReply('');
    alert(`Reply sent to ${selected.from}`);
  };

  const handleCompose = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
    setTimeout(() => { setSent(false); setShowCompose(false); setComposePatient(''); setComposeSubject(''); setComposeContent(''); }, 2000);
  };

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Messages</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Patient communications
            {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">{unreadCount} unread</span>}
          </p>
        </div>
        <button onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500 shadow-elevation-2 transition-all hover:scale-[1.03]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Message
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-280px)] min-h-[400px]">
        {/* Message list */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Inbox ({messages.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-800">
            {messages.map(msg => {
              const isSelected = selected?.id === msg.id;
              return (
                <button key={msg.id} onClick={() => handleSelect(msg)}
                  className={`w-full flex items-start gap-3 p-4 text-left transition-all ${isSelected ? 'bg-purple-50 dark:bg-purple-950/20' : msg.unread ? 'bg-purple-50/50 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}>
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 text-xs flex-shrink-0">
                    {msg.from.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm truncate ${msg.unread ? 'font-bold text-neutral-900 dark:text-white' : 'font-semibold text-neutral-700 dark:text-neutral-300'}`}>{msg.from}</p>
                      <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">{msg.time}</span>
                    </div>
                    <p className={`text-xs truncate ${msg.unread ? 'font-semibold text-neutral-700 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-400'}`}>{msg.subject}</p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{msg.content}</p>
                  </div>
                  {msg.unread && <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">
                    {selected.from.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{selected.subject}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">From: {selected.from}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{selected.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{selected.content}</p>
              </div>
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex gap-2">
                  <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2} placeholder="Type your reply..."
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all resize-none" />
                  <button onClick={handleReply} disabled={!reply.trim() || sending}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 disabled:opacity-50 transition-all self-end">
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState icon="💬" title="Select a message" description="Choose a message from the list to read it." />
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCompose(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-elevation-4 w-full max-w-md border border-neutral-100 dark:border-neutral-800 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 dark:text-white">New Message</h3>
              <button onClick={() => setShowCompose(false)} className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {sent ? (
              <div className="p-8 text-center animate-scale-in">
                <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-100">Message Sent!</p>
              </div>
            ) : (
              <form onSubmit={handleCompose} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">To (Patient) *</label>
                  <select required value={composePatient} onChange={e => setComposePatient(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all">
                    <option value="">Select patient...</option>
                    {patients.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Subject *</label>
                  <input required value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Message subject"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Message *</label>
                  <textarea required value={composeContent} onChange={e => setComposeContent(e.target.value)} rows={5} placeholder="Write your message..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 transition-all resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowCompose(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all">Cancel</button>
                  <button type="submit" disabled={sending} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-400 disabled:opacity-60 transition-all">
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
