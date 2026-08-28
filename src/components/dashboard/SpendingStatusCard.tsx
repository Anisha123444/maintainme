import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateSpendingStatus } from '../../utils/insights';

interface SpendingStatusCardProps {
  totalSpent: number;
}

export const SpendingStatusCard: React.FC<SpendingStatusCardProps> = ({ totalSpent }) => {
  const { profile } = useApp();
  const statusInfo = calculateSpendingStatus(totalSpent, profile.spendingLimits);

  const strokeDashoffset = 283 - (283 * Math.min(100, statusInfo.percentage)) / 100;

  return (
    <div className="stationery-card p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif font-bold text-theme-text">Your spending</h3>
        <span className="px-3 py-1 text-xs font-bold rounded-full border border-theme-border bg-theme-primary/40 text-theme-text">
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
              className="stroke-theme-border"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={statusInfo.status === 'HIGH' ? 'var(--color-terracotta)' : 'var(--color-accent)'}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-theme-text">
              {statusInfo.percentage}%
            </span>
            <span className="text-[10px] text-theme-muted font-bold uppercase tracking-widest font-sans">Used</span>
          </div>
        </div>

        {/* Friendly Message & Zone Legend */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <p className="text-base font-serif font-bold text-theme-text leading-snug">
            {statusInfo.message}
          </p>
          <p className="text-xs text-theme-muted font-medium italic font-serif">
            {statusInfo.subtext}
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3 text-[11px] font-semibold text-theme-muted">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-accent inline-block" />
              <span>Safe</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600/70 inline-block" />
              <span>Watch</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-terracotta inline-block" />
              <span>High</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
