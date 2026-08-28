import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/dateUtils';
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
    <div className="stationery-card p-6 relative overflow-hidden bg-gradient-to-br from-theme-card via-theme-bg to-theme-highlight">
      {/* Remaining Header */}
      <div className="flex flex-col mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-theme-muted mb-1 flex items-center space-x-1.5 font-sans">
          <Wallet className="w-3.5 h-3.5 text-theme-muted" />
          <span>Remaining Balance</span>
        </span>
        <div className="text-4xl sm:text-5xl font-serif font-bold text-theme-text tracking-tight">
          {formatCurrency(remaining, profile.currency)}
        </div>
      </div>

      {/* 3 Metrics Grid: Income, Spent, Saved */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-theme-border">
        {/* Income */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans">Income</span>
          <span className="text-base sm:text-lg font-serif font-bold text-theme-text mt-0.5">
            {formatCurrency(income, profile.currency)}
          </span>
        </div>

        {/* Spent */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-bold text-theme-terracotta uppercase tracking-widest font-sans flex items-center justify-between">
            <span>Spent</span>
            <TrendingDown className="w-3.5 h-3.5 text-theme-terracotta" />
          </span>
          <span className="text-base sm:text-lg font-serif font-bold text-theme-terracotta mt-0.5">
            {formatCurrency(totalSpent, profile.currency)}
          </span>
        </div>

        {/* Saved */}
        <div className="bg-theme-card border border-theme-border rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans flex items-center justify-between">
            <span>Saved</span>
            <TrendingUp className="w-3.5 h-3.5 text-theme-muted" />
          </span>
          <span className="text-base sm:text-lg font-serif font-bold text-theme-text mt-0.5">
            {formatCurrency(saved, profile.currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
