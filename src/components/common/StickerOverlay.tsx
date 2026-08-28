import React from 'react';

interface StickerOverlayProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  sticker?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StickerOverlay: React.FC<StickerOverlayProps> = () => {
  // Quiet, clean editorial paper cards without floating stickers
  return null;
};
