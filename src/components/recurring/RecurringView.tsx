import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Frequency, RecurringPayment } from '../../types';
import { formatCurrency, formatDateDisplay, getTodayISO } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { StickerOverlay } from '../common/StickerOverlay';
import { Repeat, Plus, Bell, BellOff, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { CategoryBadge } from '../expense/CategoryBadge';

export const RecurringView: React.FC = () => {
  const { profile, recurring, addRecurring, updateRecurring, deleteRecurring } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringPayment | null>(null);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Subscription');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [nextDate, setNextDate] = useState(getTodayISO());
  const [reminder, setReminder] = useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setAmount('');
    setCategory('Subscription');
    setFrequency('monthly');
    setNextDate(getTodayISO());
    setReminder(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RecurringPayment) => {
    setEditingItem(item);
    setTitle(item.title);
    setAmount(String(item.amount));
    setCategory(item.category);
    setFrequency(item.frequency);
    setNextDate(item.nextDate);
    setReminder(item.reminder);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    if (editingItem) {
      await updateRecurring({
        ...editingItem,
        title: title.trim(),
        amount: numAmount,
        category,
        frequency,
        nextDate,
        reminder,
      });
    } else {
      await addRecurring({
        title: title.trim(),
        amount: numAmount,
        category,
        frequency,
        nextDate,
        reminder,
      });
    }
    setIsModalOpen(false);
  };

  // Days until next due date calculation
  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="stationery-card p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <StickerOverlay position="top-right" sticker="calendar" size="md" />

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary rounded-2xl text-strawberry-600">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-sans text-theme-text">Recurring Payments</h2>
            <p className="text-xs text-theme-muted font-serif">Subscriptions, rent, wifi & monthly commitments</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-theme-accent text-white font-bold text-xs rounded-2xl shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Recurring Payment</span>
        </button>
      </div>

      {/* List */}
      {recurring.length === 0 ? (
        <div className="stationery-card p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-bold text-theme-text">No recurring payments yet</h3>
          <p className="text-xs text-theme-muted font-serif mt-1">
            Track Netflix, rent, wifi, or mobile recharges to never miss a due date.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-theme-accent text-white font-bold text-xs rounded-xl shadow-sm"
          >
            + Add First Recurring Payment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurring.map((item) => {
            const daysLeft = getDaysUntil(item.nextDate);
            const isDueSoon = daysLeft >= 0 && daysLeft <= 5;

            return (
              <div
                key={item.id}
                className="stationery-card p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={item.category} size="md" />
                    <div>
                      <h4 className="text-base font-bold text-theme-text">{item.title}</h4>
                      <p className="text-xs text-theme-muted font-medium capitalize">
                        {item.frequency} payment
                      </p>
                    </div>
                  </div>

                  <span className="text-lg font-black text-strawberry-600">
                    {formatCurrency(item.amount, profile.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-theme-border text-xs">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-theme-muted" />
                    <span className="text-theme-muted">Next date: {item.nextDate}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDueSoon ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold rounded-full text-[10px] flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Due in {daysLeft} days</span>
                      </span>
                    ) : daysLeft < 0 ? (
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-900 font-extrabold rounded-full text-[10px]">
                        Overdue ({Math.abs(daysLeft)} days)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[10px]">
                        Due in {daysLeft} days
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1 text-theme-muted hover:text-theme-text"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRecurring(item.id)}
                      className="p-1 text-theme-muted hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Recurring Payment' : 'Add Recurring Payment'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Title / Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Netflix, Rent, WiFi..."
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-medium text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Amount ({profile.currency}) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
              >
                <option value="Subscription">Subscription</option>
                <option value="Rent">Rent</option>
                <option value="Bills">Bills</option>
                <option value="Electricity">Electricity</option>
                <option value="Recharge">Recharge</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Next Due Date
            </label>
            <input
              type="date"
              required
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="reminderCheck"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="w-4 h-4 text-strawberry-600 rounded"
            />
            <label htmlFor="reminderCheck" className="text-xs font-semibold text-theme-text">
              Enable upcoming due date reminders
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-theme-accent text-white font-bold rounded-2xl shadow-float hover:opacity-90 transition-all mt-4"
          >
            Save Recurring Payment
          </button>
        </form>
      </Modal>
    </div>
  );
};
