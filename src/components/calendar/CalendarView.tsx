import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getFinancialMonthRangeByOffset, formatCurrency, formatDateDisplay, toISODate, getTodayISO } from '../../utils/dateUtils';
import { CategoryBadge } from '../expense/CategoryBadge';
import { StickerOverlay } from '../common/StickerOverlay';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Edit2, Trash2, X } from 'lucide-react';
import { Expense } from '../../types';

export const CalendarView: React.FC = () => {
  const { profile, expenses, setIsAddExpenseOpen, setEditingExpense, deleteExpense } = useApp();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayISO());

  // Get date range respecting customized financial month start (e.g. 15th to 14th)
  const monthRange = getFinancialMonthRangeByOffset(monthOffset, profile.financialMonthStart);

  // Generate all calendar dates within this financial month period
  const getDatesInRange = (): string[] => {
    const dates: string[] = [];
    const cur = new Date(monthRange.startDate);
    const end = new Date(monthRange.endDate);

    while (cur <= end) {
      dates.push(toISODate(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const datesInPeriod = getDatesInRange();

  // Map expenses by date string
  const expensesByDate: Record<string, Expense[]> = {};
  datesInPeriod.forEach((d) => {
    expensesByDate[d] = [];
  });

  expenses.forEach((e) => {
    if (expensesByDate[e.date]) {
      expensesByDate[e.date].push(e);
    }
  });

  // Selected date's expenses
  const selectedDateExpenses = selectedDate ? expensesByDate[selectedDate] || [] : [];
  const selectedDateTotal = selectedDateExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpenseForDate = (dateStr: string) => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Header with Custom Financial Month Navigation */}
      <div className="stationery-card p-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <StickerOverlay position="top-right" sticker="calendar" size="md" />

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-strawberry-100 border border-strawberry-200 rounded-2xl text-strawberry-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-sans text-theme-text">Calendar</h2>
            <p className="text-xs text-theme-muted font-serif">
              Financial Month Cycle: <span className="font-bold text-strawberry-600">{monthRange.label}</span>
            </p>
          </div>
        </div>

        {/* Cycle Switcher */}
        <div className="flex items-center space-x-2 bg-theme-bg p-1.5 border border-theme-border rounded-2xl">
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-highlight rounded-xl transition-colors"
            title="Previous Financial Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="px-3 py-1.5 text-xs font-bold text-theme-text hover:bg-theme-highlight rounded-xl"
          >
            Current Month
          </button>
          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-highlight rounded-xl transition-colors"
            title="Next Financial Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Financial Month Calendar Grid */}
      <div className="stationery-card p-6">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-xs font-bold text-theme-muted uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {datesInPeriod.map((dateStr) => {
            const dayNum = parseInt(dateStr.split('-')[2], 10);
            const dateExps = expensesByDate[dateStr] || [];
            const dayTotal = dateExps.reduce((sum, e) => sum + e.amount, 0);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === getTodayISO();

            // Intensity heatmap bg logic
            let heatBg = 'bg-theme-bg border-theme-border text-theme-text';
            if (dayTotal > 0) {
              if (dayTotal < 500) heatBg = 'bg-emerald-50 border-emerald-200 text-emerald-900';
              else if (dayTotal < 1500) heatBg = 'bg-amber-50 border-amber-200 text-amber-900';
              else heatBg = 'bg-rose-50 border-rose-200 text-rose-900';
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[64px] sm:min-h-[80px] p-2 rounded-2xl border flex flex-col justify-between items-start transition-all relative ${heatBg} ${
                  isSelected ? 'ring-2 ring-strawberry-500 scale-102 shadow-md' : 'hover:border-strawberry-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      isToday ? 'w-6 h-6 bg-strawberry-600 text-white rounded-full flex items-center justify-center' : ''
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayTotal > 0 && (
                    <span className="text-[10px] font-bold text-strawberry-700 hidden sm:inline">
                      {formatCurrency(dayTotal, profile.currency)}
                    </span>
                  )}
                </div>

                {/* Pastel Dots Indicator */}
                <div className="flex items-center space-x-1 mt-1 flex-wrap">
                  {dateExps.slice(0, 4).map((_, idx) => (
                    <span
                      key={idx}
                      className="w-2 h-2 rounded-full bg-strawberry-500 shadow-2xs"
                      title="Expense item"
                    />
                  ))}
                  {dateExps.length > 4 && (
                    <span className="text-[9px] font-bold text-strawberry-700">+{dateExps.length - 4}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details Drawer / Panel */}
      {selectedDate && (
        <div className="stationery-card p-6 bg-gradient-to-br from-theme-card to-theme-highlight border-2 border-strawberry-200 relative">
          <div className="flex items-center justify-between mb-4 border-b border-theme-border pb-3">
            <div>
              <h3 className="text-xl font-bold font-sans text-theme-text">
                {formatDateDisplay(selectedDate)}
              </h3>
              <p className="text-xs text-theme-muted">
                Total spending on this day:{' '}
                <span className="font-extrabold text-strawberry-600">
                  {formatCurrency(selectedDateTotal, profile.currency)}
                </span>
              </p>
            </div>

            <button
              onClick={() => handleAddExpenseForDate(selectedDate)}
              className="px-4 py-2 bg-theme-accent text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 flex items-center space-x-1"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Expense</span>
            </button>
          </div>

          {/* List of items */}
          {selectedDateExpenses.length === 0 ? (
            <div className="py-8 text-center text-theme-muted">
              <p className="text-sm font-serif italic">Your day is still fresh.</p>
              <p className="text-xs mt-1">No expenses recorded for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3.5 bg-theme-card border border-theme-border rounded-2xl hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={exp.category} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-theme-text">{exp.title}</h4>
                      <p className="text-[11px] text-theme-muted">
                        {exp.paymentMethod} {exp.note ? `• ${exp.note}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-base font-extrabold text-strawberry-600">
                      -{formatCurrency(exp.amount, profile.currency)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingExpense(exp);
                        setIsAddExpenseOpen(true);
                      }}
                      className="p-1 text-theme-muted hover:text-theme-text"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1 text-theme-muted hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
