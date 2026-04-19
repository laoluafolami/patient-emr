import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: { value: number; label: string; up: boolean };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  trend,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-5 shadow-elevation-1 hover:shadow-elevation-3 transition-all duration-300 hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
  >
    {/* Background gradient blob */}
    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

    <div className="relative flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-bold text-neutral-900 dark:text-white font-headline truncate">{value}</p>
        {subtitle && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.up ? 'text-secondary-600 dark:text-secondary-400' : 'text-error-600 dark:text-error-400'}`}>
            <svg className={`w-3 h-3 ${trend.up ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {trend.value}% {trend.label}
          </div>
        )}
      </div>
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-elevation-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-white w-5 h-5 flex items-center justify-center">{icon}</span>
      </div>
    </div>
  </div>
);
