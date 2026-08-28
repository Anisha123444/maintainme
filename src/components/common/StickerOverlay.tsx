import React from 'react';
import { useApp } from '../../context/AppContext';

interface StickerOverlayProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  sticker?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const STICKER_EMOJIS: Record<string, string> = {
  strawberry: '🍓',
  flower: '🌸',
  wallet: '👛',
  coin: '🪙',
  calculator: '🧮',
  calendar: '📅',
  money_plant: '🪴',
  coffee: '☕',
  envelope: '✉️',
  star: '⭐',
  sparkle: '✨',
  bow: '🎀',
  leaf: '🍃',
  notebook: '📓',
  piggy_bank: '🐖',
};

export const StickerOverlay: React.FC<StickerOverlayProps> = ({
  position = 'top-right',
  sticker = 'strawberry',
  size = 'md',
  className = '',
}) => {
  const { settings } = useApp();

  if (!settings.stickerEnabled) return null;

  // Respect density setting
  if (settings.stickerDensity === 'minimal' && position !== 'top-right') {
    return null;
  }

  const positionClasses = {
    'top-right': '-top-3 -right-3 rotate-12',
    'top-left': '-top-3 -left-3 -rotate-12',
    'bottom-right': '-bottom-3 -right-3 rotate-6',
    'bottom-left': '-bottom-3 -left-3 -rotate-6',
  };

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const emoji = STICKER_EMOJIS[sticker] || '🍓';

  return (
    <div
      className={`absolute pointer-events-none select-none z-10 transition-transform duration-300 hover:scale-125 ${positionClasses[position]} ${sizeClasses[size]} ${className}`}
      style={{
        filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.12))',
      }}
    >
      <span className="inline-block animate-bounce-subtle">{emoji}</span>
    </div>
  );
};
