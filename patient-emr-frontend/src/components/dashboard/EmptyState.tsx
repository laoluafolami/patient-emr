import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">{title}</h3>
    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed mb-4">{description}</p>
    {action}
  </div>
);
