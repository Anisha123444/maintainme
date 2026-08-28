import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSpendingStatus } from '../../utils/insights';
import { StickerOverlay } from '../common/StickerOverlay';

interface SpendingStatusCardProps {
  totalSpent: number;
}

export const SpendingStatusCard: React.FC<SpendingStatusCardProps> = ({ totalSpent }) => {
  const { profile } = useApp();
  const statusInfo = calculateSpendingStatus(totalSpent, profile.spendingLimits);

  const strokeDashoffset = 283 - (283 * Math.min(100, statusInfo.percentage)) / 100;

  return (
    <div className="stationery-card p-6 relative overflow-hidden">
      <StickerOverlay position="top-right" sticker="sparkle" size="sm" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold font-sans text-stone-900">Your spending</h3>
        <span className={`px-3.5 py-1 text-xs font-black rounded-full border ${statusInfo.badgeBg}`}>
          {statusInfo.badgeText}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
        {/* Radar/Circular Gauge Progress Ring */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              className="stroke-warm-green-200"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={statusInfo.gaugeColor}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-sans text-stone-900">
              {statusInfo.percentage}%
            </span>
            <span className="text-[10px] text-pop-pink font-extrabold uppercase tracking-wider">Used</span>
          </div>
        </div>

        {/* Friendly Message & Zone Legend */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <p className="text-base font-black text-stone-900 leading-snug">
            {statusInfo.message}
          </p>
          <p className="text-xs text-stone-600 font-medium">
            {statusInfo.subtext}
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3 text-[11px] font-extrabold text-stone-600">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Safe</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Watch</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-pop-pink inline-block" />
              <span>High</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
