import React from 'react';

interface SealStampProps {
  text?: string;
  subtext?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SealStamp: React.FC<SealStampProps> = ({
  text = 'MM',
  subtext = '済',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-11 h-11 text-xs',
    lg: 'w-14 h-14 text-sm',
  };

  return (
    <div
      className={`inline-flex flex-col items-center justify-center border-2 border-theme-seal text-theme-seal font-serif font-bold rounded-lg p-1 select-none transform -rotate-6 opacity-85 hover:rotate-0 transition-transform shadow-stamp ${sizeClasses[size]} ${className}`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at center, rgba(224, 30, 71, 0.05) 0%, transparent 70%)',
      }}
      title="MM Verified Seal"
    >
      <div className="leading-none tracking-wider font-extrabold">{text}</div>
      {subtext && <div className="text-[9px] leading-none opacity-80 mt-0.5">{subtext}</div>}
    </div>
  );
};
