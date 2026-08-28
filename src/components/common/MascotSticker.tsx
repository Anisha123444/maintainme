import React, { useState } from 'react';

interface MascotStickerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  reaction?: 'normal' | 'happy' | 'celebrate';
}

export const MascotSticker: React.FC<MascotStickerProps> = ({
  size = 'md',
  className = '',
  reaction = 'normal',
}) => {
  const [isWinking, setIsWinking] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-11 h-11 text-2xl',
    lg: 'w-14 h-14 text-3xl',
  };

  const handleMascotClick = () => {
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 1200);
  };

  return (
    <div
      onClick={handleMascotClick}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-115 active:scale-90 ${sizeClasses[size]} ${className}`}
      title="Meet MM Mascot! Click to say hi!"
    >
      <div className="relative animate-mascot-wave">
        {/* Mascot Body */}
        <span className="inline-block transform drop-shadow-sm">
          {reaction === 'celebrate' ? '🥳' : isWinking ? '😜' : '👛'}
        </span>

        {/* Small Sparkle Accent */}
        <span className="absolute -top-1 -right-1 text-[10px] animate-ping opacity-75">
          ✨
        </span>
      </div>
    </div>
  );
};
