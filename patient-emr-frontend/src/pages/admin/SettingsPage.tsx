import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Settings {
  appointmentDuration: number;
  maxPerDay: number;
  advanceBookingDays: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiryDays: number;
  require2FA: boolean;
  emailNotifications: boolean;
  appointmentReminders: boolean;
  labResultAlerts: boolean;
  systemAlerts: boolean;
  labResultsRetention: number;
  activityLogsRetention: number;
  backupFrequency: string;
}

const DEFAULT_SETTINGS: Settings = {
  appointmentDuration: 30,
  maxPerDay: 20,
  advanceBookingDays: 30,
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  passwordExpiryDays: 90,
  require2FA: false,
  emailNotifications: true,
  appointmentReminders: true,
  labResultAlerts: true,
  systemAlerts: true,
  labResultsRetention: 7,
  activityLogsRetention: 90,
  backupFrequency: 'daily',
};

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({
  checked,
  onChange,
  disabled,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
      checked ? 'bg-orange-500' : 'bg-neutral-300 dark:bg-neutral-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const SectionCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}> = ({ title, description, icon, children }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-elevation-1">
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-lg flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const FieldRow: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label,
  hint,
  children,
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
      {hint && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{hint}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Divider = () => <div className="border-t border-neutral-100 dark:border-neutral-800" />;

const selCls =
  'px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all';

const numCls =
  'w-24 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 transition-all text-right';
export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState<Settings>(DEFAULT_SETTINGS);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const isDirty = JSON.stringify(settings) !== JSON.stringify(saved);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaveState('saving');
    await new Promise((r) => setTimeout(r, 1400));
    setSaved(settings);
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 2500);
  };

  const handleDiscard = () => setSettings(saved);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-6 text-white shadow-elevation-3">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Admin Portal ⚙️</p>
            <h1 className="text-2xl font-bold font-headline">System Settings</h1>
            <p className="text-orange-100 text-sm mt-1">Configure platform-wide behaviour and policies</p>
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                  Unsaved changes
                </span>
                <button
                  onClick={handleDiscard}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
                >
                  Discard
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              disabled={saveState === 'saving' || !isDirty}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-orange-600 bg-white hover:bg-orange-50 shadow-elevation-2 transition-all hover:scale-[1.03] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveState === 'saving' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : saveState === 'saved' ? (
                <>
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Appointment Settings */}
      <SectionCard title="Appointment Settings" description="Control scheduling rules and booking windows" icon="📅">
        <FieldRow label="Default Duration" hint="Duration applied to new appointments">
          <select value={settings.appointmentDuration} onChange={(e) => set('appointmentDuration', Number(e.target.value))} className={selCls}>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </FieldRow>
        <Divider />
        <FieldRow label="Max Appointments Per Day" hint="Per doctor, per calendar day">
          <input
            type="number"
            min={1}
            max={100}
            value={settings.maxPerDay}
            onChange={(e) => set('maxPerDay', Number(e.target.value))}
            className={numCls}
          />
        </FieldRow>
        <Divider />
        <FieldRow label="Advance Booking Window" hint="How many days ahead patients can book">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={365}
              value={settings.advanceBookingDays}
              onChange={(e) => set('advanceBookingDays', Number(e.target.value))}
              className={numCls}
            />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
          </div>
        </FieldRow>
      </SectionCard>

      {/* Security Settings */}
      <SectionCard title="Security Settings" description="Authentication and access control policies" icon="🔐">
        <FieldRow label="Session Timeout" hint="Idle time before automatic logout">
          <select value={settings.sessionTimeout} onChange={(e) => set('sessionTimeout', Number(e.target.value))} className={selCls}>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={120}>2 hours</option>
            <option value={480}>8 hours</option>
          </select>
        </FieldRow>
        <Divider />
        <FieldRow label="Max Login Attempts" hint="Account locks after this many failures">
          <input
            type="number"
            min={1}
            max={20}
            value={settings.maxLoginAttempts}
            onChange={(e) => set('maxLoginAttempts', Number(e.target.value))}
            className={numCls}
          />
        </FieldRow>
        <Divider />
        <FieldRow label="Password Expiry" hint="Days before users must change password">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={365}
              value={settings.passwordExpiryDays}
              onChange={(e) => set('passwordExpiryDays', Number(e.target.value))}
              className={numCls}
            />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
          </div>
        </FieldRow>
        <Divider />
        <FieldRow label="Require Two-Factor Authentication" hint="Enforce 2FA for all staff accounts">
          <Toggle checked={settings.require2FA} onChange={(v) => set('require2FA', v)} />
        </FieldRow>
      </SectionCard>
      {/* Notification Settings */}
      <SectionCard title="Notification Settings" description="Control which alerts and emails are sent" icon="��">
        <FieldRow label="Email Notifications" hint="Send transactional emails to users">
          <Toggle checked={settings.emailNotifications} onChange={(v) => set('emailNotifications', v)} />
        </FieldRow>
        <Divider />
        <FieldRow label="Appointment Reminders" hint="Remind patients 24h before appointments">
          <Toggle
            checked={settings.appointmentReminders}
            onChange={(v) => set('appointmentReminders', v)}
            disabled={!settings.emailNotifications}
          />
        </FieldRow>
        <Divider />
        <FieldRow label="Lab Result Alerts" hint="Notify patients when results are ready">
          <Toggle
            checked={settings.labResultAlerts}
            onChange={(v) => set('labResultAlerts', v)}
            disabled={!settings.emailNotifications}
          />
        </FieldRow>
        <Divider />
        <FieldRow label="System Alerts" hint="Critical system events sent to admins">
          <Toggle checked={settings.systemAlerts} onChange={(v) => set('systemAlerts', v)} />
        </FieldRow>
      </SectionCard>

      {/* Data Retention */}
      <SectionCard title="Data Retention" description="How long records are kept before archiving" icon="🗂️">
        <FieldRow label="Lab Results Retention" hint="Years to retain lab result records">
          <select value={settings.labResultsRetention} onChange={(e) => set('labResultsRetention', Number(e.target.value))} className={selCls}>
            <option value={3}>3 years</option>
            <option value={5}>5 years</option>
            <option value={7}>7 years</option>
            <option value={10}>10 years</option>
          </select>
        </FieldRow>
        <Divider />
        <FieldRow label="Activity Logs Retention" hint="Days to keep audit log entries">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={30}
              max={365}
              value={settings.activityLogsRetention}
              onChange={(e) => set('activityLogsRetention', Number(e.target.value))}
              className={numCls}
            />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">days</span>
          </div>
        </FieldRow>
        <Divider />
        <FieldRow label="Backup Frequency" hint="How often automated backups run">
          <select value={settings.backupFrequency} onChange={(e) => set('backupFrequency', e.target.value)} className={selCls}>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </FieldRow>
      </SectionCard>
      {/* System Information */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-elevation-1">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-400 to-neutral-500 flex items-center justify-center text-white text-lg flex-shrink-0">
            ℹ️
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">System Information</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Read-only environment details</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'App Version',  value: 'v1.0.0' },
            { label: 'Environment', value: 'Production' },
            { label: 'Database',    value: 'PostgreSQL 15.4' },
            { label: 'Last Backup', value: 'Dec 15, 2024 03:00 AM' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700"
            >
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{item.label}</span>
              <span className="text-sm font-semibold font-mono text-neutral-700 dark:text-neutral-300">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky save bar */}
      {isDirty && (
        <div className="sticky bottom-4 flex items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 dark:bg-neutral-800 text-white shadow-elevation-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saveState === 'saving'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-neutral-900 bg-white hover:bg-orange-50 shadow-elevation-2 transition-all disabled:opacity-60"
            >
              {saveState === 'saving' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
