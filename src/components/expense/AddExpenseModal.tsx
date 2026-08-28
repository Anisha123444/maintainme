import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ExpenseCategory, PaymentMethod } from '../../types';
import { getTodayISO } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Wallet } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Groceries',
  'Restaurant',
  'Shopping',
  'Transport',
  'Education',
  'Rent',
  'Bills',
  'Electricity',
  'Recharge',
  'Entertainment',
  'Health',
  'Personal',
  'Travel',
  'Family',
  'Subscription',
  'Investment',
  'Savings',
  'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Cash', 'Card', 'NetBanking', 'Wallet', 'Other'];

export const AddExpenseModal: React.FC = () => {
  const {
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    updateExpense,
    profile,
  } = useApp();

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);

  const [date, setDate] = useState(getTodayISO());
  const [time, setTime] = useState('12:00');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [note, setNote] = useState('');
  const [showCoinDropAnimation, setShowCoinDropAnimation] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setAmount(String(editingExpense.amount));
      setTitle(editingExpense.title);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setTime(editingExpense.time || '12:00');
      setPaymentMethod(editingExpense.paymentMethod);
      setNote(editingExpense.note || '');
    } else {
      setAmount('');
      setTitle('');
      setCategory('Food');
      setDate(getTodayISO());
      const now = new Date();
      setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setPaymentMethod('UPI');
      setNote('');
    }
  }, [editingExpense, isAddExpenseOpen]);

  const handleClose = () => {
    setIsAddExpenseOpen(false);
    setEditingExpense(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    const finalCategory = isAddingCustomCategory && customCategory.trim() ? customCategory.trim() : category;

    if (editingExpense) {
      await updateExpense({
        ...editingExpense,
        amount: numericAmount,
        title: title.trim() || finalCategory,
        category: finalCategory,
        date,
        time,
        paymentMethod,
        note: note.trim(),
      });
    } else {
      await addExpense({
        amount: numericAmount,
        title: title.trim() || finalCategory,
        category: finalCategory,
        date,
        time,
        paymentMethod,
        note: note.trim(),
      });

      // Micro-confetti burst
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#FFE866', '#F0F7F4', '#FFD6E0'],
        });
      } catch (e) {}
    }

    // Playful Coin drop into wallet animation
    setShowCoinDropAnimation(true);
    setTimeout(() => {
      setShowCoinDropAnimation(false);
      handleClose();
    }, 850);
  };

  return (
    <Modal
      isOpen={isAddExpenseOpen}
      onClose={handleClose}
      title={editingExpense ? 'Edit expense' : 'Add expense'}
    >
      <form onSubmit={handleSave} className="space-y-4 relative">
        {/* Coin drop into wallet micro-animation overlay */}
        {showCoinDropAnimation && (
          <div className="absolute inset-0 z-20 bg-theme-card/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative w-20 h-20 flex items-center justify-center mb-2">
              {/* Coin */}
              <div className="absolute top-0 w-8 h-8 rounded-full bg-butter-300 border-2 border-butter-500 font-black text-xs text-stone-900 flex items-center justify-center shadow-butter animate-coin-drop">
                {profile.currency || '₹'}
              </div>
              {/* Wallet */}
              <div className="mt-6 text-4xl">👛</div>
            </div>
            <h4 className="text-xl font-extrabold text-theme-text font-sans">Money logged.</h4>
            <p className="text-xs text-theme-muted font-serif mt-0.5">Added to MM Journal 🪙</p>
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
            Amount ({profile.currency}) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-theme-muted">
              {profile.currency}
            </span>
            <input
              type="number"
              step="any"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-theme-bg border-2 border-theme-border focus:border-butter-400 rounded-2xl text-2xl font-extrabold text-theme-text outline-none transition-all"
            />
          </div>
        </div>

        {/* What was it? (Name) */}
        <div>
          <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
            What was it? (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Strawberry Café, Metro Pass..."
            className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border focus:border-butter-400 rounded-xl text-sm font-medium text-theme-text outline-none transition-all"
          />
        </div>

        {/* Category Picker */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider">
              Category
            </label>
            <button
              type="button"
              onClick={() => setIsAddingCustomCategory(!isAddingCustomCategory)}
              className="text-xs font-bold text-stone-700 hover:underline"
            >
              {isAddingCustomCategory ? 'Choose Preset' : '+ Custom Category'}
            </button>
          </div>

          {isAddingCustomCategory ? (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category name..."
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border focus:border-butter-400 rounded-xl text-sm font-medium text-theme-text outline-none"
            />
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-theme-bg border border-theme-border rounded-2xl">
              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`transition-all ${
                    category === cat ? 'scale-105 ring-2 ring-butter-500 rounded-full' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <CategoryBadge category={cat} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
            Note (Optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a small journal note..."
            className="w-full px-4 py-2 bg-theme-bg border border-theme-border focus:border-butter-400 rounded-xl text-xs font-medium text-theme-text outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold text-base rounded-2xl shadow-butter border border-butter-500 active:scale-95 transition-all flex items-center justify-center space-x-2 mt-4"
        >
          <Sparkles className="w-5 h-5" />
          <span>{editingExpense ? 'Update Expense' : 'Save Expense'}</span>
        </button>
      </form>
    </Modal>
  );
};
