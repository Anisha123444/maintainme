import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getFinancialMonthRangeByOffset, formatCurrency, formatDateDisplay, toISODate, getTodayISO } from '../../utils/dateUtils';
import { CategoryBadge } from '../expense/CategoryBadge';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Edit2, Trash2 } from 'lucide-react';
import { Expense } from '../../types';

export const CalendarView: React.FC = () => {
  const { profile, expenses, setIsAddExpenseOpen, setEditingExpense, deleteExpense } = useApp();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(getTodayISO());

  const monthRange = getFinancialMonthRangeByOffset(monthOffset, profile.financialMonthStart);

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

  const expensesByDate: Record<string, Expense[]> = {};
  datesInPeriod.forEach((d) => {
    expensesByDate[d] = [];
  });

  expenses.forEach((e) => {
    if (expensesByDate[e.date]) {
      expensesByDate[e.date].push(e);
    }
  });

  const selectedDateExpenses = selectedDate ? expensesByDate[selectedDate] || [] : [];
  const selectedDateTotal = selectedDateExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpenseForDate = (dateStr: string) => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="stationery-card p-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary/60 border border-theme-border rounded-2xl text-theme-text">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-theme-text">Planner Calendar</h2>
            <p className="text-xs text-theme-muted font-serif italic">
              Financial Month Cycle: <span className="font-bold font-sans text-theme-text">{monthRange.label}</span>
            </p>
          </div>
        </div>

        {/* Cycle Switcher */}
        <div className="flex items-center space-x-2 bg-theme-bg p-1.5 border border-theme-border rounded-2xl">
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            className="p-1.5 text-theme-muted hover:text-theme-text hover:bg-theme-highlight rounded-xl transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMonthOffset(0)}
            className="px-3 py-1 text-xs font-bold text-theme-text hover:bg-theme-highlight rounded-xl"
          >
            Current Month
          </button>
          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            className="p-1.5 text-theme-muted hover:text-theme-text hover:bg-theme-highlight rounded-xl transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial Month Calendar Grid */}
      <div className="stationery-card p-6">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-[11px] font-bold text-theme-muted uppercase tracking-widest py-1 font-sans">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {datesInPeriod.map((dateStr) => {
            const dayNum = parseInt(dateStr.split('-')[2], 10);
            const dateExps = expensesByDate[dateStr] || [];
            const dayTotal = dateExps.reduce((sum, e) => sum + e.amount, 0);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === getTodayISO();

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[64px] sm:min-h-[76px] p-2 rounded-2xl border flex flex-col justify-between items-start transition-all ${
                  isSelected
                    ? 'bg-theme-primary/80 border-theme-accent shadow-xs'
                    : 'bg-theme-card border-theme-border hover:bg-theme-highlight'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isToday ? 'w-5 h-5 bg-theme-text text-theme-card rounded-full flex items-center justify-center' : 'text-theme-text'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayTotal > 0 && (
                    <span className="text-[10px] font-bold text-theme-terracotta hidden sm:inline">
                      {formatCurrency(dayTotal, profile.currency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 mt-1 flex-wrap">
                  {dateExps.slice(0, 3).map((_, idx) => (
                    <span
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full bg-theme-accent inline-block"
                    />
                  ))}
                  {dateExps.length > 3 && (
                    <span className="text-[9px] font-bold text-theme-muted">+{dateExps.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details Drawer */}
      {selectedDate && (
        <div className="stationery-card p-6 border-2 border-theme-border">
          <div className="flex items-center justify-between mb-4 border-b border-theme-border pb-3">
            <div>
              <h3 className="text-xl font-serif font-bold text-theme-text">
                {formatDateDisplay(selectedDate)}
              </h3>
              <p className="text-xs text-theme-muted font-serif italic">
                Total spending on this day:{' '}
                <span className="font-bold font-sans text-theme-terracotta">
                  {formatCurrency(selectedDateTotal, profile.currency)}
                </span>
              </p>
            </div>

            <button
              onClick={() => handleAddExpenseForDate(selectedDate)}
              className="px-3.5 py-2 bg-theme-primary hover:bg-theme-accent text-theme-text text-xs font-bold rounded-xl border border-theme-border flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Expense</span>
            </button>
          </div>

          {selectedDateExpenses.length === 0 ? (
            <div className="py-8 text-center text-theme-muted">
              <p className="text-sm font-serif italic">Your day is still fresh.</p>
              <p className="text-xs mt-1 font-serif">No expenses recorded for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3.5 bg-theme-bg border border-theme-border rounded-2xl"
                >
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={exp.category} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-theme-text">{exp.title}</h4>
                      <p className="text-[11px] text-theme-muted font-medium">
                        {exp.paymentMethod} {exp.note ? `• ${exp.note}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-base font-extrabold text-theme-terracotta">
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
                      className="p-1 text-theme-muted hover:text-theme-terracotta"
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
