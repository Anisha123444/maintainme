import React from 'react';
import { useApp } from '../../context/AppContext';
import { getFinancialMonthRange, formatCurrency, formatDateDisplay } from '../../utils/dateUtils';
import { MainBalanceCard } from './MainBalanceCard';
import { SpendingStatusCard } from './SpendingStatusCard';
import { CategoryBadge } from '../expense/CategoryBadge';
import { MMLogo } from '../common/MMLogo';
import {
  Calendar as CalendarIcon,
  Search,
  Settings as SettingsIcon,
  Plus,
  ArrowRight,
  Repeat,
  Target,
  Edit2,
  Trash2,
  Receipt,
  Leaf,
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
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-theme-card p-4 sm:p-5 border border-theme-border rounded-3xl shadow-paper">
        <div className="flex items-center space-x-3">
          <MMLogo size="sm" showTagline={false} />
        </div>

        {/* Month Badge & Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className="flex items-center space-x-2 px-3.5 py-2 bg-theme-primary/60 border border-theme-border rounded-2xl text-xs font-bold text-theme-text hover:bg-theme-primary transition-colors shadow-2xs"
            title="View Financial Month Calendar"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-theme-muted" />
            <span>{monthRange.label}</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className="p-2 bg-theme-card border border-theme-border rounded-2xl text-theme-muted hover:text-theme-text hover:bg-theme-highlight transition-colors"
            title="Search expenses"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 bg-theme-card border border-theme-border rounded-2xl text-theme-muted hover:text-theme-text hover:bg-theme-highlight transition-colors"
            title="Open Settings"
          >
            <SettingsIcon className="w-4 h-4" />
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
            <h3 className="text-sm font-serif font-bold text-theme-text">Top spending categories</h3>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-bold text-theme-muted hover:text-theme-text hover:underline flex items-center space-x-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryBreakdown.slice(0, 6).map((cat) => (
              <div
                key={cat.category}
                className="flex items-center space-x-2 px-3 py-1.5 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold"
              >
                <CategoryBadge category={cat.category} size="sm" />
                <span className="font-bold text-theme-text">
                  {formatCurrency(cat.amount, profile.currency)}
                </span>
                <span className="text-[10px] text-theme-muted">({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Section: Recent Activity + Goals/Recurring Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 stationery-card p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-serif font-bold text-theme-text">Recent expenses</h3>
              <p className="text-xs text-theme-muted font-serif italic">Your month so far.</p>
            </div>
            {recentExpenses.length > 0 && (
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-bold text-theme-muted hover:text-theme-text hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {recentExpenses.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-theme-primary/50 border border-theme-border rounded-full flex items-center justify-center text-theme-muted">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-serif font-bold text-theme-text">
                Your month is still empty.
              </h4>
              <p className="text-xs text-theme-muted font-serif italic max-w-xs mx-auto">
                Start tracking your first expense.
              </p>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="mt-2 px-5 py-2.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-2xl border border-theme-border shadow-2xs active:scale-95 transition-all inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add expense</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3.5 bg-theme-bg hover:bg-theme-highlight border border-theme-border rounded-2xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={exp.category} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-theme-text leading-tight">{exp.title}</h4>
                      <p className="text-[11px] text-theme-muted font-medium mt-0.5">
                        {formatDateDisplay(exp.date)} {exp.paymentMethod ? `• ${exp.paymentMethod}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-base font-extrabold text-theme-terracotta">
                      -{formatCurrency(exp.amount, profile.currency)}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingExpense(exp);
                          setIsAddExpenseOpen(true);
                        }}
                        className="p-1 text-theme-muted hover:text-theme-text"
                        title="Edit expense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-1 text-theme-muted hover:text-theme-terracotta"
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
              <span className="text-xs font-bold text-theme-muted uppercase tracking-widest flex items-center space-x-1.5 font-sans">
                <Repeat className="w-3.5 h-3.5 text-theme-muted" />
                <span>Upcoming Bills</span>
              </span>
              <button
                onClick={() => setActiveTab('recurring')}
                className="text-xs font-bold text-theme-muted hover:text-theme-text hover:underline"
              >
                Manage
              </button>
            </div>

            {upcomingRecurring.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-xs text-theme-muted font-serif italic">No recurring bills set yet.</p>
                <button
                  onClick={() => setActiveTab('recurring')}
                  className="mt-2 text-xs font-bold text-theme-text hover:underline"
                >
                  + Add Bill
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingRecurring.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-theme-bg border border-theme-border rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-theme-text">{item.title}</h5>
                      <span className="text-[10px] text-theme-terracotta font-bold">
                        Due: {item.nextDate}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-theme-text">
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
              <span className="text-xs font-bold text-theme-muted uppercase tracking-widest flex items-center space-x-1.5 font-sans">
                <Target className="w-3.5 h-3.5 text-theme-muted" />
                <span>Savings Goals</span>
              </span>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-bold text-theme-muted hover:text-theme-text hover:underline"
              >
                View All
              </button>
            </div>

            {activeGoals.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-xs text-theme-muted font-serif italic">Give your money something to look forward to.</p>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="mt-2 text-xs font-bold text-theme-text hover:underline"
                >
                  + Add Goal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeGoals.map((g) => {
                  const pct = Math.min(100, Math.round((g.current / (g.target || 1)) * 100));
                  return (
                    <div key={g.id} className="p-3 bg-theme-bg border border-theme-border rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-theme-text font-serif">{g.name}</span>
                        <span className="text-theme-text font-mono">{pct}%</span>
                      </div>
                      <div className="h-2 bg-theme-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-theme-accent transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-theme-muted flex justify-between">
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
