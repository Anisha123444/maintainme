import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/dateUtils';
import { StickerOverlay } from '../common/StickerOverlay';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';

interface MainBalanceCardProps {
  totalSpent: number;
}

export const MainBalanceCard: React.FC<MainBalanceCardProps> = ({ totalSpent }) => {
  const { profile } = useApp();
  const income = profile.income || 0;
  const remaining = income - totalSpent;
  const saved = Math.max(0, remaining);

  return (
    <div className="stationery-card p-6 relative overflow-hidden bg-gradient-to-br from-white via-warm-green-50 to-warm-green-100 border-2 border-warm-green-300">
      {/* Decorative Sticker */}
      <StickerOverlay position="top-right" sticker="coin" size="md" />

      {/* Main Remaining Header */}
      <div className="flex flex-col mb-6">
        <span className="text-xs font-extrabold uppercase tracking-wider text-pop-pink mb-1 flex items-center space-x-1.5">
          <Wallet className="w-4 h-4 text-pop-pink" />
          <span>Remaining Balance</span>
        </span>
        <div className="text-4xl sm:text-5xl font-black font-sans text-stone-900 tracking-tight">
          {formatCurrency(remaining, profile.currency)}
        </div>
      </div>

      {/* 3 Metrics Grid: Income, Spent, Saved */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-warm-green-200">
        {/* Income */}
        <div className="bg-white/90 border border-warm-green-300 rounded-xl p-3 flex flex-col shadow-2xs">
          <span className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider">Income</span>
          <span className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
            {formatCurrency(income, profile.currency)}
          </span>
        </div>

        {/* Spent */}
        <div className="bg-pop-pink-50/90 border border-pop-pink-200 rounded-xl p-3 flex flex-col shadow-2xs">
          <span className="text-[11px] font-extrabold text-pop-pink uppercase tracking-wider flex items-center justify-between">
            <span>Spent</span>
            <TrendingDown className="w-3.5 h-3.5 text-pop-pink" />
          </span>
          <span className="text-base sm:text-lg font-black text-pop-pink mt-0.5">
            {formatCurrency(totalSpent, profile.currency)}
          </span>
        </div>

        {/* Saved */}
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 flex flex-col shadow-2xs">
          <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>Saved</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-900 mt-0.5">
            {formatCurrency(saved, profile.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
