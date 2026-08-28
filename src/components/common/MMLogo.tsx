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
  const logoSizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-xl',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Unique SVG Badge Logo with interlocking MM geometry */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-butter-300 via-butter-400 to-butter-500 border-2 border-stone-800 shadow-butter transform hover:rotate-3 transition-transform ${logoSizes[size]}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 text-stone-900 fill-current drop-shadow-xs"
        >
          {/* Unique Stylized Custom MM Lettermark */}
          <path d="M 12 78 L 12 25 L 32 60 L 50 25 L 68 60 L 88 25 L 88 78 L 76 78 L 76 44 L 62 70 L 50 48 L 38 70 L 24 44 L 24 78 Z" />
          <circle cx="50" cy="18" r="6" className="text-strawberry-600 fill-current" />
        </svg>
      </div>

      {/* Unique Typography Branding */}
      <div>
        <div className={`font-black font-sans tracking-tight text-pop-pink flex items-center ${textSizes[size]}`}>
          <span className="text-pop-pink font-extrabold tracking-tighter drop-shadow-2xs">MM</span>
          <span className="text-xs text-stone-800 font-serif italic ml-2 opacity-80">Maintain Me</span>
        </div>
        {showTagline && (
          <p className="text-[10px] text-stone-600 font-bold uppercase tracking-widest font-sans">
            Personal Finance Journal
          </p>
        )}
      </div>
    </div>
  );
};
