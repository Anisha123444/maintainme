import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryBadge } from '../expense/CategoryBadge';
import { formatCurrency, formatDateDisplay } from '../../utils/dateUtils';
import { StickerOverlay } from '../common/StickerOverlay';
import { Search, Filter, Edit2, Trash2, X, Plus } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';

export const ActivityView: React.FC = () => {
  const {
    profile,
    expenses,
    searchQuery,
    setSearchQuery,
    setIsAddExpenseOpen,
    setEditingExpense,
    deleteExpense,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPayment, setSelectedPayment] = useState<string>('ALL');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  // Filter expenses
  const filteredExpenses = expenses.filter((e) => {
    // Search query match title, note, category
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchCategory = e.category.toLowerCase().includes(q);
      const matchNote = e.note ? e.note.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchCategory && !matchNote) return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;

    // Payment method filter
    if (selectedPayment !== 'ALL' && e.paymentMethod !== selectedPayment) return false;

    // Amount range filter
    if (minAmount && e.amount < parseFloat(minAmount)) return false;
    if (maxAmount && e.amount > parseFloat(maxAmount)) return false;

    return true;
  });

  // Group by date
  const groupedByDate: Record<string, Expense[]> = {};
  filteredExpenses.forEach((e) => {
    if (!groupedByDate[e.date]) {
      groupedByDate[e.date] = [];
    }
    groupedByDate[e.date].push(e);
  });

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Top Header & Search Bar */}
      <div className="stationery-card p-6 relative overflow-hidden space-y-4">
        <StickerOverlay position="top-right" sticker="notebook" size="md" />

        <div>
          <h2 className="text-2xl font-bold font-sans text-theme-text">Activity</h2>
          <p className="text-xs text-theme-muted font-serif">Complete financial timeline & ledger</p>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-theme-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions, notes, or categories..."
            className="w-full pl-12 pr-10 py-3 bg-theme-bg border border-theme-border focus:border-theme-accent rounded-2xl text-sm font-medium text-theme-text outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-theme-border text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-theme-bg border border-theme-border rounded-xl font-semibold text-theme-text outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Food">Food</option>
            <option value="Groceries">Groceries</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Education">Education</option>
            <option value="Rent">Rent</option>
            <option value="Bills">Bills</option>
            <option value="Electricity">Electricity</option>
            <option value="Recharge">Recharge</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Personal">Personal</option>
            <option value="Travel">Travel</option>
            <option value="Subscription">Subscription</option>
            <option value="Other">Other</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-3 py-1.5 bg-theme-bg border border-theme-border rounded-xl font-semibold text-theme-text outline-none"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="NetBanking">NetBanking</option>
            <option value="Wallet">Wallet</option>
          </select>

          {/* Min & Max Amount */}
          <input
            type="number"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            placeholder="Min ₹"
            className="w-20 px-2.5 py-1.5 bg-theme-bg border border-theme-border rounded-xl font-semibold text-theme-text outline-none"
          />
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            placeholder="Max ₹"
            className="w-20 px-2.5 py-1.5 bg-theme-bg border border-theme-border rounded-xl font-semibold text-theme-text outline-none"
          />

          {(selectedCategory !== 'ALL' || selectedPayment !== 'ALL' || minAmount || maxAmount) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedPayment('ALL');
                setMinAmount('');
                setMaxAmount('');
              }}
              className="px-2.5 py-1.5 text-strawberry-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Timeline List */}
      {sortedDates.length === 0 ? (
        <div className="stationery-card p-12 text-center">
          <div className="text-4xl mb-3">🍃</div>
          <h3 className="text-lg font-bold text-theme-text">No expenses found</h3>
          <p className="text-xs text-theme-muted font-serif mt-1">
            Try adjusting your search query or filters.
          </p>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="mt-4 px-4 py-2 bg-theme-accent text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90"
          >
            + Add New Expense
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => {
            const dateExps = groupedByDate[dateStr];
            const dateTotal = dateExps.reduce((sum, e) => sum + e.amount, 0);

            return (
              <div key={dateStr} className="space-y-2">
                {/* Date Group Header */}
                <div className="flex items-center justify-between px-2 text-xs font-bold text-theme-muted uppercase tracking-wider">
                  <span>{formatDateDisplay(dateStr)}</span>
                  <span>Total: {formatCurrency(dateTotal, profile.currency)}</span>
                </div>

                {/* Expenses in date */}
                <div className="space-y-2">
                  {dateExps.map((exp) => (
                    <div
                      key={exp.id}
                      className="stationery-card p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center space-x-3">
                        <CategoryBadge category={exp.category} size="md" />
                        <div>
                          <h4 className="text-sm font-bold text-theme-text leading-tight">{exp.title}</h4>
                          <p className="text-[11px] text-theme-muted font-medium mt-0.5">
                            {exp.paymentMethod} {exp.note ? `• ${exp.note}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-base font-extrabold text-strawberry-600">
                          -{formatCurrency(exp.amount, profile.currency)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
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
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
