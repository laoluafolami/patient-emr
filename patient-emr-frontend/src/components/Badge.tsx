import React, { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles = {
  success: 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-200',
  error: 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-200',
  warning: 'bg-accent-100 text-accent-700 dark:bg-accent-900 dark:text-accent-200',
  info: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200',
  secondary: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-caption',
  md: 'px-3 py-1 text-label',
  lg: 'px-4 py-2 text-body-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-all duration-fast ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

// Status Badge
export type StatusBadgeType = 'active' | 'pending' | 'inactive' | 'alert';

interface StatusBadgeProps {
  status: StatusBadgeType;
  className?: string;
}

const statusConfig = {
  active: { variant: 'success' as BadgeVariant, label: 'Active' },
  pending: { variant: 'warning' as BadgeVariant, label: 'Pending' },
  inactive: { variant: 'secondary' as BadgeVariant, label: 'Inactive' },
  alert: { variant: 'error' as BadgeVariant, label: 'Alert' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

// Role Badge
export type RoleType = 'patient' | 'nurse' | 'doctor' | 'admin';

interface RoleBadgeProps {
  role: RoleType;
  className?: string;
}

const roleConfig = {
  patient: { variant: 'primary' as BadgeVariant, label: 'Patient' },
  nurse: { variant: 'success' as BadgeVariant, label: 'Nurse' },
  doctor: { variant: 'info' as BadgeVariant, label: 'Doctor' },
  admin: { variant: 'warning' as BadgeVariant, label: 'Admin' },
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const config = roleConfig[role];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
