import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

const sizes = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'text-neutral-900 dark:text-white',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="MediCore EMR Logo"
        className={`${sizes[size]} object-contain rounded-xl`}
      />
      {showText && (
        <span className={`font-headline font-bold ${textSizes[size]} ${textColor}`}>
          MediCore <span className="text-primary-500">EMR</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
