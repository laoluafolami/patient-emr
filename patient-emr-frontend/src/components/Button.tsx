import React, { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className = '',
      ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-fast cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-elevation-2 hover:shadow-elevation-3 dark:bg-primary-600 dark:hover:bg-primary-500',
      secondary:
        'bg-neutral-100 text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white dark:bg-neutral-800 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-600',
      danger:
        'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-elevation-2 hover:shadow-elevation-3 dark:bg-error-600 dark:hover:bg-error-500',
      icon: 'bg-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-body-sm rounded-md',
      md: 'px-6 py-3 text-body-regular rounded-md',
      lg: 'px-8 py-4 text-body-lg rounded-lg',
    };

    const iconSizeStyles = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    const isIconButton = variant === 'icon';
    const buttonSizeClass = isIconButton ? iconSizeStyles[size] : sizeStyles[size];

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${buttonSizeClass} ${className}`}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
