import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { MMLogo } from './MMLogo';
import { ArrowRight } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { setHasEnteredLanding, profile } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCoinClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEnter = () => {
    setIsFlipped(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setHasEnteredLanding(true);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 bg-theme-bg paper-texture flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Editorial Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm bg-theme-card border border-theme-border rounded-3xl p-8 sm:p-10 shadow-paper text-center relative flex flex-col items-center justify-between min-h-[460px]"
      >
        {/* Editorial Logo */}
        <div className="pt-2">
          <MMLogo size="xl" showTagline={false} />
        </div>

        {/* Minimal Tactile Coin */}
        <div
          onClick={handleCoinClick}
          className="perspective-1000 cursor-pointer group my-6"
          title="Tap to flip the MM coin"
        >
          <div
            className={`w-28 h-28 relative transform-style-3d transition-transform duration-700 ease-out shadow-coin rounded-full border-2 border-theme-border bg-gradient-to-br from-cream-100 via-beige-100 to-beige-200 flex items-center justify-center group-hover:scale-105 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT SIDE (MM Engraved) */}
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center backface-hidden p-2">
              <div className="w-20 h-20 rounded-full border border-dashed border-theme-border flex flex-col items-center justify-center bg-cream-100/50">
                <span className="text-2xl font-serif font-bold text-theme-text tracking-tighter">MM</span>
              </div>
            </div>

            {/* BACK SIDE (Minimal ₹) */}
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center backface-hidden rotate-y-180 p-2">
              <div className="w-20 h-20 rounded-full border border-dashed border-theme-border flex flex-col items-center justify-center bg-cream-100/50">
                <span className="text-3xl font-serif font-bold text-theme-text">{profile.currency || '₹'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA: Tap to track */}
        <div className="w-full pb-2">
          <button
            onClick={handleEnter}
            disabled={isTransitioning}
            className="w-full py-3.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-sm rounded-2xl border border-theme-border shadow-2xs active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>Tap to track</span>
            <ArrowRight className="w-4 h-4 text-theme-muted" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
