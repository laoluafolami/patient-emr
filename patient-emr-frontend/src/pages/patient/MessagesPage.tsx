import React, { useState } from 'react';
import { EmptyState } from '../../components/dashboard/EmptyState';

const messages = [
  { id: 1, from: 'Dr. James Smith', avatar: '👨‍⚕️', subject: 'Blood Work Results', preview: 'Your recent blood work results look good. Please continue your current medications and schedule a follow-up in 3 months.', content: 'Dear Patient,\n\nYour recent blood work results look good. All values are within normal range. Please continue your current medications as prescribed.\n\nI recommend scheduling a follow-up appointment in 3 months to monitor your progress. In the meantime, maintain a healthy diet and regular exercise.\n\nBest regards,\nDr. James Smith', time: '2h ago', date: 'Dec 15, 2024', unread: true },
  { id: 2, from: 'Dr. Sarah Lee', avatar: '👩‍⚕️', subject: 'Medication Reminder', preview: 'Reminder: Please take your Atorvastatin medication at bedtime as prescribed. Avoid grapefruit juice.', content: 'Dear Patient,\n\nThis is a reminder to take your Atorvastatin 20mg medication at bedtime as prescribed.\n\nImportant: Please avoid grapefruit juice as it can interfere with this medication. If you experience any muscle pain or weakness, contact us immediately.\n\nBest regards,\nDr. Sarah Lee', time: '1d ago', date: 'Dec 14, 2024', unread: false },
  { id: 3, from: 'Dr. James Smith', avatar: '👨‍⚕️', subject: 'Appointment Confirmation', preview: 'Your appointment for December 17th at 2:30 PM has been confirmed. Please arrive 10 minutes early.', content: 'Dear Patient,\n\nYour appointment for December 17th at 2:30 PM has been confirmed.\n\nPlease arrive 10 minutes early to complete any necessary paperwork. Bring your current medication list and insurance card.\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nBest regards,\nDr. James Smith', time: '2d ago', date: 'Dec 13, 2024', unread: false },
];

export const MessagesPage: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set([2, 3]));

  const handleSelect = (msg: typeof messages[0]) => {
    setSelectedMessage(msg);
    setReadIds(prev => new Set([...prev, msg.id]));
  };

  const unreadCount = messages.filter(m => !readIds.has(m.id)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-headline text-neutral-900 dark:text-white">Messages</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          Communications from your care team
          {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{unreadCount} unread</span>}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-280px)] min-h-[400px]">
        {/* Message list */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Inbox ({messages.length})</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-800">
            {messages.length === 0 ? (
              <div className="p-8"><EmptyState icon="💬" title="No messages" description="You have no messages from your care team." /></div>
            ) : (
              messages.map(msg => {
                const isUnread = !readIds.has(msg.id);
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <button key={msg.id} onClick={() => handleSelect(msg)}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-all duration-200 ${isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : isUnread ? 'bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/20' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}>
                    <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-lg flex-shrink-0">{msg.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm truncate ${isUnread ? 'font-bold text-neutral-900 dark:text-white' : 'font-semibold text-neutral-700 dark:text-neutral-300'}`}>{msg.from}</p>
                        <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">{msg.time}</span>
                      </div>
                      <p className={`text-xs truncate ${isUnread ? 'font-semibold text-neutral-700 dark:text-neutral-200' : 'text-neutral-600 dark:text-neutral-400'}`}>{msg.subject}</p>
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{msg.preview}</p>
                    </div>
                    {isUnread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-elevation-1 overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xl flex-shrink-0">{selectedMessage.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 dark:text-white">{selectedMessage.subject}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">From: {selectedMessage.from}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{selectedMessage.date}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {selectedMessage.content.split('\n').map((line, i) => (
                    <p key={i} className={`text-sm text-neutral-700 dark:text-neutral-300 ${line === '' ? 'mb-3' : 'mb-1'}`}>{line || '\u00A0'}</p>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <p className="text-xs text-neutral-400 text-center">This is a one-way message from your care team. For urgent matters, please call the clinic directly.</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState icon="💬" title="Select a message" description="Choose a message from the list to read it." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
