import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BorrowRecord, LendRecord } from '../../types';
import { formatCurrency, formatDateDisplay, getTodayISO } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import {
  HandCoins,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Wallet,
  Sparkles,
} from 'lucide-react';

export const LendBorrowView: React.FC = () => {
  const {
    profile,
    lendRecords,
    borrowRecords,
    addLendRecord,
    updateLendRecord,
    deleteLendRecord,
    addLendRepayment,
    addBorrowRecord,
    updateBorrowRecord,
    deleteBorrowRecord,
    addBorrowRepayment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed'>('lent');

  // Lend Modal State
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [editingLend, setEditingLend] = useState<LendRecord | null>(null);

  // Borrow Modal State
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [editingBorrow, setEditingBorrow] = useState<BorrowRecord | null>(null);

  // Repayment Modal State
  const [repaymentModalInfo, setRepaymentModalInfo] = useState<{
    isOpen: boolean;
    type: 'lent' | 'borrowed';
    id: string;
    personName: string;
    remaining: number;
  }>({
    isOpen: false,
    type: 'lent',
    id: '',
    personName: '',
    remaining: 0,
  });

  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [dueDate, setDueDate] = useState('');
  const [purpose, setPurpose] = useState('');

  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(getTodayISO());
  const [repaymentNote, setRepaymentNote] = useState('');

  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});

  // Summary Metrics
  const totalLent = lendRecords.reduce((sum, l) => sum + l.amount, 0);
  const totalLentReturned = lendRecords.reduce((sum, l) => sum + (l.returnedAmount || 0), 0);
  const toReceive = Math.max(0, totalLent - totalLentReturned);

  const totalBorrowed = borrowRecords.reduce((sum, b) => sum + b.amount, 0);
  const totalBorrowedPaid = borrowRecords.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const toPay = Math.max(0, totalBorrowed - totalBorrowedPaid);

  const toggleHistory = (id: string) => {
    setExpandedHistory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Lend Handlers
  const handleOpenAddLend = () => {
    setEditingLend(null);
    setPersonName('');
    setAmount('');
    setDate(getTodayISO());
    setDueDate('');
    setPurpose('');
    setIsLendModalOpen(true);
  };

  const handleOpenEditLend = (l: LendRecord) => {
    setEditingLend(l);
    setPersonName(l.personName);
    setAmount(String(l.amount));
    setDate(l.date);
    setDueDate(l.dueDate || '');
    setPurpose(l.purpose || '');
    setIsLendModalOpen(true);
  };

  const handleSaveLend = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!personName.trim() || isNaN(numAmt) || numAmt <= 0) return;

    if (editingLend) {
      await updateLendRecord({
        ...editingLend,
        personName: personName.trim(),
        amount: numAmt,
        date,
        dueDate,
        purpose: purpose.trim(),
      });
    } else {
      await addLendRecord({
        personName: personName.trim(),
        amount: numAmt,
        date,
        dueDate,
        purpose: purpose.trim(),
      });
    }
    setIsLendModalOpen(false);
  };

  // Borrow Handlers
  const handleOpenAddBorrow = () => {
    setEditingBorrow(null);
    setPersonName('');
    setAmount('');
    setDate(getTodayISO());
    setDueDate('');
    setPurpose('');
    setIsBorrowModalOpen(true);
  };

  const handleOpenEditBorrow = (b: BorrowRecord) => {
    setEditingBorrow(b);
    setPersonName(b.personName);
    setAmount(String(b.amount));
    setDate(b.date);
    setDueDate(b.dueDate || '');
    setPurpose(b.purpose || '');
    setIsBorrowModalOpen(true);
  };

  const handleSaveBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!personName.trim() || isNaN(numAmt) || numAmt <= 0) return;

    if (editingBorrow) {
      await updateBorrowRecord({
        ...editingBorrow,
        personName: personName.trim(),
        amount: numAmt,
        date,
        dueDate,
        purpose: purpose.trim(),
      });
    } else {
      await addBorrowRecord({
        personName: personName.trim(),
        amount: numAmt,
        date,
        dueDate,
        purpose: purpose.trim(),
      });
    }
    setIsBorrowModalOpen(false);
  };

  // Repayment Handlers
  const handleOpenRepayment = (type: 'lent' | 'borrowed', id: string, personName: string, remaining: number) => {
    setRepaymentModalInfo({ isOpen: true, type, id, personName, remaining });
    setRepaymentAmount(String(remaining));
    setRepaymentDate(getTodayISO());
    setRepaymentNote('');
  };

  const handleSubmitRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(repaymentAmount);
    if (isNaN(numAmt) || numAmt <= 0) return;

    if (repaymentModalInfo.type === 'lent') {
      await addLendRepayment(repaymentModalInfo.id, numAmt, repaymentDate, repaymentNote.trim());
    } else {
      await addBorrowRepayment(repaymentModalInfo.id, numAmt, repaymentDate, repaymentNote.trim());
    }

    setRepaymentModalInfo((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Editorial Header */}
      <div className="stationery-card p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary/60 rounded-2xl text-theme-text border border-theme-border">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-theme-text">Lend & Borrow</h2>
            <p className="text-xs text-theme-muted font-serif italic">Keep track of money you give or receive</p>
          </div>
        </div>

        <button
          onClick={activeTab === 'lent' ? handleOpenAddLend : handleOpenAddBorrow}
          className="px-4 py-2.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-2xl border border-theme-border shadow-2xs active:scale-95 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{activeTab === 'lent' ? 'Add Lent Money' : 'Add Borrowed Money'}</span>
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Money Lent */}
        <div className="stationery-card p-4 flex flex-col">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans flex items-center justify-between">
            <span>Money Lent</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-theme-muted" />
          </span>
          <span className="text-xl font-serif font-bold text-theme-text mt-1">
            {formatCurrency(totalLent, profile.currency)}
          </span>
        </div>

        {/* To Receive */}
        <div className="stationery-card p-4 flex flex-col bg-theme-primary/20">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans">To Receive</span>
          <span className="text-xl font-serif font-bold text-theme-text mt-1">
            {formatCurrency(toReceive, profile.currency)}
          </span>
        </div>

        {/* Money Borrowed */}
        <div className="stationery-card p-4 flex flex-col">
          <span className="text-[10px] font-bold text-theme-terracotta uppercase tracking-widest font-sans flex items-center justify-between">
            <span>Money Borrowed</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-theme-terracotta" />
          </span>
          <span className="text-xl font-serif font-bold text-theme-terracotta mt-1">
            {formatCurrency(totalBorrowed, profile.currency)}
          </span>
        </div>

        {/* To Pay */}
        <div className="stationery-card p-4 flex flex-col bg-terracotta-100/40">
          <span className="text-[10px] font-bold text-theme-terracotta uppercase tracking-widest font-sans">To Pay</span>
          <span className="text-xl font-serif font-bold text-theme-terracotta mt-1">
            {formatCurrency(toPay, profile.currency)}
          </span>
        </div>
      </div>

      {/* Primary Sub-Tabs: Lent vs Borrowed */}
      <div className="stationery-card p-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('lent')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'lent'
              ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
              : 'text-theme-muted hover:bg-theme-highlight'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Lent (Money YOU gave)</span>
          <span className="ml-1 px-2 py-0.5 bg-theme-card rounded-full text-[10px] border border-theme-border">
            {lendRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('borrowed')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'borrowed'
              ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
              : 'text-theme-muted hover:bg-theme-highlight'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Borrowed (Money YOU received)</span>
          <span className="ml-1 px-2 py-0.5 bg-theme-card rounded-full text-[10px] border border-theme-border">
            {borrowRecords.length}
          </span>
        </button>
      </div>

      {/* LENT SECTION */}
      {activeTab === 'lent' && (
        <>
          {lendRecords.length === 0 ? (
            <div className="stationery-card p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-theme-primary/50 border border-theme-border rounded-full flex items-center justify-center text-theme-muted">
                <HandCoins className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-theme-text">Nothing to settle yet.</h3>
              <p className="text-xs text-theme-muted font-serif italic max-w-xs mx-auto">
                Keep track of money you give or receive.
              </p>
              <button
                onClick={handleOpenAddLend}
                className="mt-2 px-4 py-2 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-xl border border-theme-border shadow-2xs"
              >
                + Add Lent Money Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lendRecords.map((item) => {
                const returned = item.returnedAmount || 0;
                const remaining = Math.max(0, item.amount - returned);
                const pct = Math.min(100, Math.round((returned / (item.amount || 1)) * 100));
                const isFullyReturned = item.status === 'fully_returned' || remaining === 0;
                const isHistoryOpen = !!expandedHistory[item.id];

                return (
                  <div
                    key={item.id}
                    className="stationery-card p-5 flex flex-col justify-between space-y-4 hover:shadow-paper-hover transition-shadow relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-theme-primary/60 border border-theme-border rounded-xl flex items-center justify-center font-bold text-theme-text font-serif">
                          {item.personName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-theme-text leading-tight">{item.personName}</h4>
                          <p className="text-[11px] text-theme-muted font-medium mt-0.5">
                            Lent on {formatDateDisplay(item.date)} {item.purpose ? `• ${item.purpose}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-theme-muted block uppercase tracking-wider">Original</span>
                        <span className="text-lg font-serif font-bold text-theme-text">
                          {formatCurrency(item.amount, profile.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progress & Remaining */}
                    <div className="space-y-1.5 p-3 bg-theme-bg border border-theme-border rounded-xl">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-theme-muted font-serif">Returned: {formatCurrency(returned, profile.currency)}</span>
                        <span className="text-theme-text font-serif italic">
                          Remaining: <span className="font-sans font-bold text-theme-terracotta">{formatCurrency(remaining, profile.currency)}</span>
                        </span>
                      </div>

                      <div className="h-2 bg-theme-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-theme-accent transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-theme-muted font-medium pt-0.5">
                        {item.dueDate ? (
                          <span className="flex items-center space-x-1 font-mono">
                            <Clock className="w-3 h-3 text-theme-muted" />
                            <span>Expected back: {item.dueDate}</span>
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="capitalize font-bold text-theme-text">Status: {item.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-theme-border text-xs">
                      <div className="flex items-center space-x-2">
                        {!isFullyReturned && (
                          <button
                            onClick={() => handleOpenRepayment('lent', item.id, item.personName, remaining)}
                            className="px-3 py-1.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-xl border border-theme-border shadow-2xs transition-colors flex items-center space-x-1"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Mark Returned</span>
                          </button>
                        )}

                        {item.repayments && item.repayments.length > 0 && (
                          <button
                            onClick={() => toggleHistory(item.id)}
                            className="text-[11px] font-bold text-theme-muted hover:text-theme-text flex items-center space-x-1"
                          >
                            <span>History ({item.repayments.length})</span>
                            {isHistoryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditLend(item)}
                          className="p-1 text-theme-muted hover:text-theme-text"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLendRecord(item.id)}
                          className="p-1 text-theme-muted hover:text-theme-terracotta"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Repayment History Accordion */}
                    {isHistoryOpen && item.repayments && item.repayments.length > 0 && (
                      <div className="pt-2 border-t border-theme-border space-y-1.5 text-xs animate-fade-in">
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider font-sans">
                          Repayment History
                        </span>
                        {item.repayments.map((r) => (
                          <div key={r.id} className="p-2 bg-theme-card border border-theme-border rounded-lg flex items-center justify-between text-[11px]">
                            <div>
                              <span className="font-bold text-theme-text">{formatCurrency(r.amount, profile.currency)}</span>
                              {r.note && <span className="text-theme-muted font-serif italic ml-2">({r.note})</span>}
                            </div>
                            <span className="text-theme-muted font-mono">{r.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* BORROWED SECTION */}
      {activeTab === 'borrowed' && (
        <>
          {borrowRecords.length === 0 ? (
            <div className="stationery-card p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-theme-primary/50 border border-theme-border rounded-full flex items-center justify-center text-theme-muted">
                <HandCoins className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-theme-text">Nothing to settle yet.</h3>
              <p className="text-xs text-theme-muted font-serif italic max-w-xs mx-auto">
                Keep track of money you give or receive.
              </p>
              <button
                onClick={handleOpenAddBorrow}
                className="mt-2 px-4 py-2 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-xl border border-theme-border shadow-2xs"
              >
                + Add Borrowed Money Record
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {borrowRecords.map((item) => {
                const paid = item.paidAmount || 0;
                const remaining = Math.max(0, item.amount - paid);
                const pct = Math.min(100, Math.round((paid / (item.amount || 1)) * 100));
                const isFullyPaid = item.status === 'fully_paid' || remaining === 0;
                const isHistoryOpen = !!expandedHistory[item.id];

                return (
                  <div
                    key={item.id}
                    className="stationery-card p-5 flex flex-col justify-between space-y-4 hover:shadow-paper-hover transition-shadow relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-terracotta-100 border border-terracotta-200 rounded-xl flex items-center justify-center font-bold text-theme-terracotta font-serif">
                          {item.personName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-theme-text leading-tight">{item.personName}</h4>
                          <p className="text-[11px] text-theme-muted font-medium mt-0.5">
                            Borrowed on {formatDateDisplay(item.date)} {item.purpose ? `• ${item.purpose}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-theme-terracotta block uppercase tracking-wider">Borrowed</span>
                        <span className="text-lg font-serif font-bold text-theme-terracotta">
                          {formatCurrency(item.amount, profile.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Progress & Remaining */}
                    <div className="space-y-1.5 p-3 bg-theme-bg border border-theme-border rounded-xl">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-theme-muted font-serif">Paid: {formatCurrency(paid, profile.currency)}</span>
                        <span className="text-theme-text font-serif italic">
                          Remaining: <span className="font-sans font-bold text-theme-terracotta">{formatCurrency(remaining, profile.currency)}</span>
                        </span>
                      </div>

                      <div className="h-2 bg-theme-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-theme-terracotta transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-theme-muted font-medium pt-0.5">
                        {item.dueDate ? (
                          <span className="flex items-center space-x-1 font-mono">
                            <Clock className="w-3 h-3 text-theme-muted" />
                            <span>Repayment due: {item.dueDate}</span>
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="capitalize font-bold text-theme-text">Status: {item.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-theme-border text-xs">
                      <div className="flex items-center space-x-2">
                        {!isFullyPaid && (
                          <button
                            onClick={() => handleOpenRepayment('borrowed', item.id, item.personName, remaining)}
                            className="px-3 py-1.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-xl border border-theme-border shadow-2xs transition-colors flex items-center space-x-1"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Record Payment</span>
                          </button>
                        )}

                        {item.repayments && item.repayments.length > 0 && (
                          <button
                            onClick={() => toggleHistory(item.id)}
                            className="text-[11px] font-bold text-theme-muted hover:text-theme-text flex items-center space-x-1"
                          >
                            <span>History ({item.repayments.length})</span>
                            {isHistoryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditBorrow(item)}
                          className="p-1 text-theme-muted hover:text-theme-text"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBorrowRecord(item.id)}
                          className="p-1 text-theme-muted hover:text-theme-terracotta"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Repayment History Accordion */}
                    {isHistoryOpen && item.repayments && item.repayments.length > 0 && (
                      <div className="pt-2 border-t border-theme-border space-y-1.5 text-xs animate-fade-in">
                        <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider font-sans">
                          Payment History
                        </span>
                        {item.repayments.map((r) => (
                          <div key={r.id} className="p-2 bg-theme-card border border-theme-border rounded-lg flex items-center justify-between text-[11px]">
                            <div>
                              <span className="font-bold text-theme-text">{formatCurrency(r.amount, profile.currency)}</span>
                              {r.note && <span className="text-theme-muted font-serif italic ml-2">({r.note})</span>}
                            </div>
                            <span className="text-theme-muted font-mono">{r.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add / Edit Lend Modal */}
      <Modal
        isOpen={isLendModalOpen}
        onClose={() => setIsLendModalOpen(false)}
        title={editingLend ? 'Edit Lend Record' : 'Add Lent Money Record'}
      >
        <form onSubmit={handleSaveLend} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Person Name *
            </label>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Rahul, Priya..."
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Lent Amount ({profile.currency}) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2000"
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
                Date Given
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
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
                Expected Return Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Purpose / Note (Optional)
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Concert ticket, Dinner share..."
              className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-medium text-theme-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-2xl border border-theme-border shadow-2xs transition-all mt-4 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-theme-muted" />
            <span>Save Lend Record</span>
          </button>
        </form>
      </Modal>

      {/* Add / Edit Borrow Modal */}
      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        title={editingBorrow ? 'Edit Borrow Record' : 'Add Borrowed Money Record'}
      >
        <form onSubmit={handleSaveBorrow} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Person Name *
            </label>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Amit, Sanya..."
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Borrowed Amount ({profile.currency}) *
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
                Date Received
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
              <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
                Expected Repayment Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Purpose / Note (Optional)
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Emergency cash, Equipment purchase..."
              className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-medium text-theme-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-2xl border border-theme-border shadow-2xs transition-all mt-4 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-theme-muted" />
            <span>Save Borrow Record</span>
          </button>
        </form>
      </Modal>

      {/* Record Repayment Modal (Supports Partial & Full Payments) */}
      <Modal
        isOpen={repaymentModalInfo.isOpen}
        onClose={() => setRepaymentModalInfo((prev) => ({ ...prev, isOpen: false }))}
        title={repaymentModalInfo.type === 'lent' ? `Record Return from ${repaymentModalInfo.personName}` : `Record Repayment to ${repaymentModalInfo.personName}`}
      >
        <form onSubmit={handleSubmitRepayment} className="space-y-4">
          <div className="p-3 bg-theme-bg border border-theme-border rounded-xl text-xs font-medium text-theme-text flex justify-between">
            <span>Remaining Balance:</span>
            <span className="font-bold text-theme-terracotta">{formatCurrency(repaymentModalInfo.remaining, profile.currency)}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Repayment Amount ({profile.currency}) *
            </label>
            <input
              type="number"
              required
              autoFocus
              step="any"
              value={repaymentAmount}
              onChange={(e) => setRepaymentAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-theme-bg border-2 border-theme-border focus:border-theme-accent rounded-2xl text-2xl font-serif font-bold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Repayment Date
            </label>
            <input
              type="date"
              required
              value={repaymentDate}
              onChange={(e) => setRepaymentDate(e.target.value)}
              className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-semibold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 font-sans">
              Note (Optional)
            </label>
            <input
              type="text"
              value={repaymentNote}
              onChange={(e) => setRepaymentNote(e.target.value)}
              placeholder="e.g. UPI transfer, cash..."
              className="w-full px-4 py-2 bg-theme-bg border border-theme-border rounded-xl text-xs font-medium text-theme-text outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-2xl border border-theme-border shadow-2xs transition-all mt-4"
          >
            Record Repayment
          </button>
        </form>
      </Modal>
    </div>
  );
};
