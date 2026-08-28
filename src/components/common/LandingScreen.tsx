import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { MMLogo } from './MMLogo';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SealStamp } from './SealStamp';

export const LandingScreen: React.FC = () => {
  const { setHasEnteredLanding, profile } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCoinClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEnter = () => {
    setHasEnteredLanding(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-theme-bg paper-texture flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Decorative Stamps & Leaves */}
      <div className="absolute top-6 left-6 pointer-events-none opacity-80">
        <SealStamp text="MM" subtext="2026" size="md" />
      </div>
      <div className="absolute top-6 right-6 pointer-events-none text-3xl animate-float-leaf opacity-70">
        🍃
      </div>

      {/* Ultra Clean Front Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm bg-white/95 border-2 border-warm-green-300 rounded-3xl p-8 shadow-stationery text-center relative backdrop-blur-md flex flex-col items-center justify-center space-y-8"
      >
        {/* Unique MM Logo */}
        <div className="flex justify-center w-full pt-2">
          <MMLogo size="xl" showTagline={true} />
        </div>

        {/* Interactive 3D MM Coin */}
        <div
          onClick={handleCoinClick}
          className="perspective-1000 cursor-pointer group my-2"
          title="Tap to flip the MM coin!"
        >
          <div
            className={`w-28 h-28 relative transform-style-3d transition-transform duration-700 ease-out shadow-butter rounded-full border-4 border-stone-900 bg-gradient-to-br from-butter-200 via-butter-300 to-butter-500 flex items-center justify-center group-hover:scale-105 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT SIDE */}
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center backface-hidden p-2">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-stone-900/40 flex flex-col items-center justify-center bg-butter-300/40">
                <span className="text-2xl font-black text-pop-pink font-sans tracking-tighter">MM</span>
              </div>
            </div>

            {/* BACK SIDE */}
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center backface-hidden rotate-y-180 p-2">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-stone-900/40 flex flex-col items-center justify-center bg-butter-300/40">
                <span className="text-3xl font-black text-stone-900 font-sans">{profile.currency || '₹'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA: Tap to Track */}
        <button
          onClick={handleEnter}
          className="w-full py-4 bg-butter-400 hover:bg-butter-300 text-stone-900 font-black text-lg rounded-2xl shadow-butter border-2 border-stone-900 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <span>Tap to Track</span>
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      </motion.div>
    </div>
  );
};
