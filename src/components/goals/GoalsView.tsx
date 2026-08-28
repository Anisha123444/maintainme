import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavingsGoal } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { StickerOverlay } from '../common/StickerOverlay';
import { Target, Plus, Sparkles, Edit2, Trash2, Calendar, Coins, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GoalsView: React.FC = () => {
  const { profile, goals, addGoal, updateGoal, deleteGoal, addGoalFunds } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundingGoal, setFundingGoal] = useState<SavingsGoal | null>(null);
  const [fundAmount, setFundAmount] = useState('');

  const [celebrationGoal, setCelebrationGoal] = useState<SavingsGoal | null>(null);

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setName('');
    setTarget('');
    setCurrent('0');
    setDeadline('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: SavingsGoal) => {
    setEditingGoal(g);
    setName(g.name);
    setTarget(String(g.target));
    setCurrent(String(g.current));
    setDeadline(g.deadline || '');
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = parseFloat(target);
    const numCurrent = parseFloat(current) || 0;

    if (!name.trim() || isNaN(numTarget) || numTarget <= 0) return;

    if (editingGoal) {
      await updateGoal({
        ...editingGoal,
        name: name.trim(),
        target: numTarget,
        current: numCurrent,
        deadline,
      });
    } else {
      await addGoal({
        name: name.trim(),
        target: numTarget,
        current: numCurrent,
        deadline,
      });
    }
    setIsModalOpen(false);
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundingGoal) return;
    const addAmt = parseFloat(fundAmount);
    if (isNaN(addAmt) || addAmt <= 0) return;

    const newCurrent = Math.min(fundingGoal.target, fundingGoal.current + addAmt);
    await addGoalFunds(fundingGoal.id, addAmt);

    // Check if goal reached 100%
    if (newCurrent >= fundingGoal.target && fundingGoal.current < fundingGoal.target) {
      setCelebrationGoal(fundingGoal);
    }

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFE866', '#8DC9B3', '#FFD6E0'],
      });
    } catch (e) {}

    setIsAddFundsOpen(false);
    setFundingGoal(null);
    setFundAmount('');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="stationery-card p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <StickerOverlay position="top-right" sticker="piggy_bank" size="md" />

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary rounded-2xl text-stone-900">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-sans text-theme-text">Savings Goals</h2>
            <p className="text-xs text-theme-muted font-serif">Give your money something to look forward to</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold text-xs rounded-2xl shadow-butter border border-butter-500 active:scale-95 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="stationery-card p-12 text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-pastel-mint border border-theme-border rounded-full flex items-center justify-center text-3xl shadow-xs">
            🐖
          </div>
          <h3 className="text-lg font-extrabold text-theme-text font-sans">
            Give your money something to look forward to.
          </h3>
          <p className="text-xs text-theme-muted font-serif max-w-xs mx-auto">
            Create savings goals for Emergency Fund, New Laptop, Trip, or Savings.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 px-5 py-2.5 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold text-xs rounded-2xl shadow-butter border border-butter-500 active:scale-95 transition-all inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create Savings Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / (g.target || 1)) * 100));

            return (
              <div
                key={g.id}
                className="stationery-card p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-theme-text font-sans">{g.name}</h3>
                    {g.deadline && (
                      <p className="text-xs text-theme-muted font-medium flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-800" />
                        <span>Deadline: {g.deadline}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-1.5 text-theme-muted hover:text-theme-text rounded-lg"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1.5 text-theme-muted hover:text-rose-600 rounded-lg"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-stone-800">
                      {formatCurrency(g.current, profile.currency)} / {formatCurrency(g.target, profile.currency)}
                    </span>
                    <span className="text-lg font-black text-theme-text">{pct}%</span>
                  </div>

                  <div className="h-3 bg-theme-border rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-butter-400 rounded-full transition-all duration-700 shadow-2xs"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-theme-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-theme-muted">
                    {pct >= 100 ? '🎉 Goal Achieved!' : `${formatCurrency(g.target - g.current, profile.currency)} remaining`}
                  </span>

                  <button
                    onClick={() => {
                      setFundingGoal(g);
                      setFundAmount('');
                      setIsAddFundsOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-butter-200 text-stone-900 border border-butter-400 font-bold text-xs rounded-xl hover:bg-butter-300 flex items-center space-x-1.5 transition-colors"
                  >
                    <Coins className="w-3.5 h-3.5 text-stone-800" />
                    <span>+ Add Savings</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create Savings Goal'}
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Laptop, Emergency Fund, Trip..."
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
                Target Amount ({profile.currency}) *
              </label>
              <input
                type="number"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="70000"
                className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
                Current Saved ({profile.currency})
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold rounded-2xl shadow-butter border border-butter-500 transition-all mt-4 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Save Goal</span>
          </button>
        </form>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        title={`Add Savings to ${fundingGoal?.name}`}
      >
        <form onSubmit={handleContribute} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Contribution Amount ({profile.currency})
            </label>
            <input
              type="number"
              required
              autoFocus
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 bg-theme-bg border-2 border-theme-border focus:border-butter-400 rounded-2xl text-2xl font-extrabold text-theme-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold rounded-2xl shadow-butter border border-butter-500 transition-all"
          >
            Add to Goal
          </button>
        </form>
      </Modal>

      {/* Goal Reached Celebration Modal */}
      <Modal
        isOpen={!!celebrationGoal}
        onClose={() => setCelebrationGoal(null)}
        title="Goal Reached!"
      >
        <div className="text-center py-4 space-y-3">
          <div className="text-5xl animate-bounce">🥳 🪙 ✨</div>
          <h3 className="text-2xl font-extrabold text-theme-text font-sans">You did it!</h3>
          <p className="text-sm font-semibold text-theme-muted font-serif">
            You reached 100% of your target for <span className="font-bold text-stone-900">{celebrationGoal?.name}</span>!
          </p>
          <button
            onClick={() => setCelebrationGoal(null)}
            className="mt-4 px-6 py-3 bg-butter-400 text-stone-900 font-extrabold text-xs rounded-2xl shadow-butter border border-butter-500"
          >
            Awesome!
          </button>
        </div>
      </Modal>
    </div>
  );
};
