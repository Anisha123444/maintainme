import React from 'react';

interface MMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const MMLogo: React.FC<MMLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const mmTextSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.2em]',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-[11px] tracking-[0.3em]',
    xl: 'text-[13px] tracking-[0.35em]',
  };

  return (
    <div className={`flex flex-col items-center select-none text-center ${className}`}>
      {/* Editorial Serif Display MM */}
      <h1 className={`font-serif font-bold text-theme-text tracking-tighter leading-none ${mmTextSizes[size]}`}>
        MM
      </h1>

      {/* Spaced Uppercase Subtitle */}
      <p className={`font-sans font-bold text-theme-muted uppercase mt-1 ${subtitleSizes[size]}`}>
        MAINTAIN ME
      </p>

      {showTagline && (
        <p className="text-[11px] text-theme-muted font-serif italic mt-1 opacity-80">
          Personal Finance Journal
        </p>
      )}
    </div>
  );
};
