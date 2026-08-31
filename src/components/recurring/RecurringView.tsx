import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BillFrequency, RecurringPayment } from '../../types';
import { formatCurrency, getTodayISO } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { Repeat, Plus, Edit2, Trash2, Calendar, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';
import { CategoryBadge } from '../expense/CategoryBadge';

export const RecurringView: React.FC = () => {
  const { profile, recurring, addRecurring, updateRecurring, deleteRecurring } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringPayment | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Subscription');
  const [frequency, setFrequency] = useState<BillFrequency>('monthly');
  const [nextDate, setNextDate] = useState(getTodayISO());
  const [reminder, setReminder] = useState(true);
  const [note, setNote] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setAmount('');
    setCategory('Subscription');
    setFrequency('monthly');
    setNextDate(getTodayISO());
    setReminder(true);
    setNote('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RecurringPayment) => {
    setEditingItem(item);
    setTitle(item.title);
    setAmount(String(item.amount));
    setCategory(item.category);
    setFrequency(item.frequency || 'monthly');
    setNextDate(item.nextDate);
    setReminder(item.reminder);
    setNote(item.note || '');
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
        note: note.trim(),
      });
    } else {
      await addRecurring({
        title: title.trim(),
        amount: numAmount,
        category,
        frequency,
        nextDate,
        reminder,
        status: 'pending',
        note: note.trim(),
      });
    }
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = async (item: RecurringPayment) => {
    await updateRecurring({
      ...item,
      status: 'paid',
      paidDate: getTodayISO(),
    });
  };

  const handleMarkAsPending = async (item: RecurringPayment) => {
    await updateRecurring({
      ...item,
      status: 'pending',
      paidDate: undefined,
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredBills = recurring.filter((r) => {
    const itemStatus = r.status || 'pending';
    if (statusFilter === 'pending') return itemStatus === 'pending';
    if (statusFilter === 'paid') return itemStatus === 'paid';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="stationery-card p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary/60 rounded-2xl text-theme-text border border-theme-border">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-theme-text">Upcoming Bills</h2>
            <p className="text-xs text-theme-muted font-serif italic">Subscriptions, rent, wifi & commitments</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-2xl border border-theme-border shadow-2xs active:scale-95 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1.5 bg-theme-card p-1 border border-theme-border rounded-xl">
          {[
            { id: 'all', label: 'All Bills' },
            { id: 'pending', label: 'Pending' },
            { id: 'paid', label: 'Paid History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                statusFilter === tab.id
                  ? 'bg-theme-primary text-theme-text shadow-2xs font-extrabold border border-theme-border'
                  : 'text-theme-muted hover:bg-theme-highlight'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-theme-muted font-serif italic">
          Total: <span className="font-bold text-theme-text font-sans">{filteredBills.length}</span>
        </span>
      </div>

      {/* List */}
      {filteredBills.length === 0 ? (
        <div className="stationery-card p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-theme-primary/50 border border-theme-border rounded-full flex items-center justify-center text-theme-muted">
            <Repeat className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-serif font-bold text-theme-text">No upcoming bills</h3>
          <p className="text-xs text-theme-muted font-serif italic max-w-xs mx-auto">
            Add a bill to keep it on your radar.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 px-4 py-2 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-xl border border-theme-border shadow-2xs"
          >
            + Add First Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBills.map((item) => {
            const daysLeft = getDaysUntil(item.nextDate);
            const isDueSoon = daysLeft >= 0 && daysLeft <= 5;
            const isPaid = item.status === 'paid';

            return (
              <div
                key={item.id}
                className={`stationery-card p-5 flex flex-col justify-between space-y-4 hover:shadow-paper-hover transition-shadow relative ${
                  isPaid ? 'opacity-75 bg-theme-bg/50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <CategoryBadge category={item.category} size="md" />
                    <div>
                      <h4 className="text-base font-bold text-theme-text">{item.title}</h4>
                      <p className="text-xs text-theme-muted font-medium capitalize">
                        {item.frequency ? item.frequency.replace('_', ' ') : 'Monthly'} bill
                      </p>
                      {item.note && <p className="text-[11px] text-theme-muted font-serif italic">{item.note}</p>}
                    </div>
                  </div>

                  <span className="text-lg font-serif font-bold text-theme-terracotta">
                    {formatCurrency(item.amount, profile.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-theme-border text-xs">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-theme-muted" />
                    <span className="text-theme-muted font-mono">
                      {isPaid ? `Paid: ${item.paidDate || item.nextDate}` : `Due: ${item.nextDate}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isPaid ? (
                      <button
                        onClick={() => handleMarkAsPending(item)}
                        className="px-2.5 py-1 bg-sage-100 text-sage-500 font-bold rounded-full text-[10px] flex items-center space-x-1 border border-sage-300 hover:bg-sage-200"
                        title="Click to mark pending"
                      >
                        <CheckCircle2 className="w-3 h-3 text-sage-400" />
                        <span>Paid</span>
                      </button>
                    ) : isDueSoon ? (
                      <span className="px-2 py-0.5 bg-terracotta-100 text-theme-terracotta font-bold rounded-full text-[10px] flex items-center space-x-1 border border-terracotta-200">
                        <AlertCircle className="w-3 h-3" />
                        <span>Due in {daysLeft} days</span>
                      </span>
                    ) : daysLeft < 0 ? (
                      <span className="px-2 py-0.5 bg-terracotta-200 text-theme-terracotta font-bold rounded-full text-[10px]">
                        Overdue ({Math.abs(daysLeft)} days)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-theme-primary/60 text-theme-text font-bold rounded-full text-[10px] border border-theme-border">
                        Due in {daysLeft} days
                      </span>
                    )}

                    {!isPaid && (
                      <button
                        onClick={() => handleMarkAsPaid(item)}
                        className="px-2.5 py-1 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-[10px] rounded-xl border border-theme-border shadow-2xs"
                      >
                        Mark Paid
                      </button>
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
                      className="p-1 text-theme-muted hover:text-theme-terracotta"
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
        title={editingItem ? 'Edit Bill' : 'Add Upcoming Bill'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Bill Name *
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
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
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
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
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
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as BillFrequency)}
                className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
              >
                <option value="one_time">One time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Due Date
            </label>
            <input
              type="date"
              required
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add payment reminder details..."
              className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-medium text-theme-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-2xl border border-theme-border shadow-2xs transition-all mt-4"
          >
            Save Bill
          </button>
        </form>
      </Modal>
    </div>
  );
};
