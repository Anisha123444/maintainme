import React from 'react';
import { useApp } from '../../context/AppContext';
import { getFinancialMonthRange, formatCurrency, formatDateDisplay } from '../../utils/dateUtils';
import { MainBalanceCard } from './MainBalanceCard';
import { SpendingStatusCard } from './SpendingStatusCard';
import { CategoryBadge } from '../expense/CategoryBadge';
import { StickerOverlay } from '../common/StickerOverlay';
import { SealStamp } from '../common/SealStamp';
import { MascotSticker } from '../common/MascotSticker';
import { MMLogo } from '../common/MMLogo';
import {
  Calendar as CalendarIcon,
  Search,
  Settings as SettingsIcon,
  Plus,
  ArrowRight,
  Repeat,
  Target,
  Sparkles,
  Edit2,
  Trash2,
} from 'lucide-react';
import { CategoryBreakdown, getCategoryBreakdown } from '../../utils/insights';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    expenses,
    recurring,
    goals,
    setActiveTab,
    setIsAddExpenseOpen,
    setEditingExpense,
    deleteExpense,
  } = useApp();

  const monthRange = getFinancialMonthRange(new Date(), profile.financialMonthStart);

  const currentMonthExpenses = expenses.filter(
    (e) => e.date >= monthRange.startDate && e.date <= monthRange.endDate
  );

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryBreakdown: CategoryBreakdown[] = getCategoryBreakdown(currentMonthExpenses);
  const recentExpenses = expenses.slice(0, 5);
  const upcomingRecurring = recurring.slice(0, 3);
  const activeGoals = goals.slice(0, 2);

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-warm-green-300 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <MMLogo size="md" />
          <MascotSticker size="sm" />
        </div>

        {/* Month Badge & Top Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Financial Month Badge */}
          <button
            onClick={() => setActiveTab('calendar')}
            className="flex items-center space-x-2 px-3.5 py-2 bg-warm-green-100 border border-warm-green-300 rounded-2xl text-xs font-extrabold text-pop-pink hover:bg-warm-green-200 transition-colors shadow-2xs"
            title="View Financial Month Calendar"
          >
            <CalendarIcon className="w-4 h-4 text-pop-pink" />
            <span>{monthRange.label}</span>
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => setActiveTab('activity')}
            className="p-2.5 bg-theme-bg border border-warm-green-300 rounded-2xl text-stone-700 hover:text-pop-pink hover:bg-warm-green-100 transition-colors"
            title="Search expenses"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2.5 bg-theme-bg border border-warm-green-300 rounded-2xl text-stone-700 hover:text-pop-pink hover:bg-warm-green-100 transition-colors"
            title="Open Settings"
          >
            <SettingsIcon className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <MainBalanceCard totalSpent={totalSpent} />

      {/* Spending Status Card */}
      <SpendingStatusCard totalSpent={totalSpent} />

      {/* Categories Bar */}
      {categoryBreakdown.length > 0 && (
        <div className="stationery-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold font-sans text-stone-900">Top spending categories</h3>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-extrabold text-pop-pink hover:underline flex items-center space-x-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryBreakdown.slice(0, 6).map((cat) => (
              <div
                key={cat.category}
                className="flex items-center space-x-2 px-3 py-1.5 bg-warm-green-50 border border-warm-green-300 rounded-xl text-xs font-semibold"
              >
                <CategoryBadge category={cat.category} size="sm" />
                <span className="font-bold text-stone-900">
                  {formatCurrency(cat.amount, profile.currency)}
                </span>
                <span className="text-[10px] text-stone-600">({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Section: Recent Activity + Goals/Recurring Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 stationery-card p-6 relative">
          <StickerOverlay position="top-right" sticker="notebook" size="sm" />

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold font-sans text-stone-900">Recent expenses</h3>
              <p className="text-xs text-stone-600 font-serif">Your personal money journal</p>
            </div>
            {recentExpenses.length > 0 && (
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-extrabold text-pop-pink hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentExpenses.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-warm-green-200 border border-warm-green-300 rounded-full flex items-center justify-center text-3xl shadow-xs">
                🌱
              </div>
              <h4 className="text-xl font-black text-pop-pink font-sans">
                Your month is still fresh.
              </h4>
              <p className="text-xs text-stone-600 font-serif max-w-xs mx-auto leading-relaxed">
                Add your first expense and let's maintain it together.
              </p>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="mt-2 px-5 py-3 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold text-xs rounded-2xl shadow-butter border-2 border-stone-900 active:scale-95 transition-all inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add expense</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3.5 bg-warm-green-50/50 hover:bg-warm-green-100/50 border border-warm-green-200 rounded-2xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={exp.category} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 leading-tight">{exp.title}</h4>
                      <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                        {formatDateDisplay(exp.date)} {exp.paymentMethod ? `• ${exp.paymentMethod}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-base font-black text-pop-pink">
                      -{formatCurrency(exp.amount, profile.currency)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingExpense(exp);
                          setIsAddExpenseOpen(true);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-900"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 text-stone-500 hover:text-rose-600"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Widgets: Upcoming Recurring & Goals */}
        <div className="space-y-6">
          {/* Upcoming Recurring */}
          <div className="stationery-card p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-pop-pink uppercase tracking-wider flex items-center space-x-1.5">
                <Repeat className="w-4 h-4 text-pop-pink" />
                <span>Upcoming Bills</span>
              </span>
              <button
                onClick={() => setActiveTab('recurring')}
                className="text-xs font-extrabold text-pop-pink hover:underline"
              >
                Manage
              </button>
            </div>

            {upcomingRecurring.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-xs text-stone-600 font-serif">No recurring payments set yet.</p>
                <button
                  onClick={() => setActiveTab('recurring')}
                  className="mt-2 text-xs font-extrabold text-pop-pink hover:underline"
                >
                  + Add Bill / Sub
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingRecurring.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-warm-green-50 border border-warm-green-200 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">{item.title}</h5>
                      <span className="text-[10px] text-pop-pink font-extrabold">
                        Due: {item.nextDate}
                      </span>
                    </div>
                    <span className="text-xs font-black text-stone-900">
                      {formatCurrency(item.amount, profile.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goals Preview */}
          <div className="stationery-card p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-pop-pink uppercase tracking-wider flex items-center space-x-1.5">
                <Target className="w-4 h-4 text-pop-pink" />
                <span>Savings Goals</span>
              </span>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-extrabold text-pop-pink hover:underline"
              >
                View All
              </button>
            </div>

            {activeGoals.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-xs text-stone-600 font-serif">Give your money something to look forward to.</p>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="mt-2 text-xs font-extrabold text-pop-pink hover:underline"
                >
                  + Add Goal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeGoals.map((g) => {
                  const pct = Math.min(100, Math.round((g.current / (g.target || 1)) * 100));
                  return (
                    <div key={g.id} className="p-3 bg-warm-green-50 border border-warm-green-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-stone-900">{g.name}</span>
                        <span className="text-pop-pink font-black">{pct}%</span>
                      </div>
                      <div className="h-2 bg-warm-green-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-butter-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-stone-600 flex justify-between">
                        <span>{formatCurrency(g.current, profile.currency)}</span>
                        <span>Target: {formatCurrency(g.target, profile.currency)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
