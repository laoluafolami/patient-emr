import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = true }) => {
  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-elevation-2 transition-all duration-fast ${
        hoverable ? 'hover:shadow-elevation-3 hover:scale-101' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Patient Record Card
interface PatientRecordCardProps {
  patientName: string;
  patientId: string;
  lastVisit: string;
  status: 'active' | 'inactive' | 'pending';
  className?: string;
}

export const PatientRecordCard: React.FC<PatientRecordCardProps> = ({
  patientName,
  patientId,
  lastVisit,
  status,
  className = '',
}) => {
  const statusColors = {
    active: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200',
    inactive: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
    pending: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-200',
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-md p-5 shadow-elevation-1 border-l-4 border-primary-500 transition-all duration-fast hover:shadow-elevation-2 ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-h4 font-headline font-semibold text-neutral-900 dark:text-neutral-50">
            {patientName}
          </h4>
          <p className="text-body-sm text-neutral-600 dark:text-neutral-400">ID: {patientId}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-label font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <p className="text-body-sm text-neutral-600 dark:text-neutral-400">Last visit: {lastVisit}</p>
    </div>
  );
};

// Vital Signs Card
interface VitalSignsCardProps {
  vitalName: string;
  value: string | number;
  unit: string;
  timestamp: string;
  status?: 'normal' | 'warning' | 'critical';
  className?: string;
}

export const VitalSignsCard: React.FC<VitalSignsCardProps> = ({
  vitalName,
  value,
  unit,
  timestamp,
  status = 'normal',
  className = '',
}) => {
  const statusColors = {
    normal: 'text-success-600 dark:text-success-400',
    warning: 'text-accent-600 dark:text-accent-400',
    critical: 'text-error-600 dark:text-error-400',
  };

  const statusIndicators = {
    normal: 'bg-success-500',
    warning: 'bg-accent-500',
    critical: 'bg-error-500',
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-md p-4 shadow-elevation-1 transition-all duration-fast hover:shadow-elevation-2 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-body-regular font-medium text-neutral-900 dark:text-neutral-50">{vitalName}</h4>
        <div className={`w-3 h-3 rounded-full ${statusIndicators[status]}`} />
      </div>
      <div className="mb-2">
        <p className={`text-2xl font-mono font-bold ${statusColors[status]}`}>
          {value} <span className="text-body-sm">{unit}</span>
        </p>
      </div>
      <p className="text-body-sm text-neutral-600 dark:text-neutral-400">{timestamp}</p>
    </div>
  );
};

// Lab Result Card
interface LabResultCardProps {
  testName: string;
  date: string;
  status: 'pending' | 'completed' | 'reviewed';
  details?: string;
  className?: string;
}

export const LabResultCard: React.FC<LabResultCardProps> = ({
  testName,
  date,
  status,
  details,
  className = '',
}) => {
  const statusColors = {
    pending: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-200',
    completed: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200',
    reviewed: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  };

  return (
    <div
      className={`bg-white dark:bg-neutral-800 rounded-md p-5 shadow-elevation-1 transition-all duration-fast hover:shadow-elevation-2 ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-body-regular font-medium text-neutral-900 dark:text-neutral-50">{testName}</h4>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-label font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <p className="text-body-sm text-neutral-600 dark:text-neutral-400 mb-2">{date}</p>
      {details && <p className="text-body-sm text-neutral-700 dark:text-neutral-300">{details}</p>}
    </div>
  );
};
