import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

const sizes = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
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
