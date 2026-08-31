import React from 'react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import {
  Home,
  Calendar as CalendarIcon,
  Activity,
  PieChart,
  Settings,
  Plus,
  Repeat,
  Target,
  HandCoins,
} from 'lucide-react';
import { MMLogo } from './MMLogo';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddExpenseOpen, setEditingExpense } = useApp();

  const handleOpenAddExpense = () => {
    setEditingExpense(null);
    setIsAddExpenseOpen(true);
  };

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-theme-card border-r border-theme-border min-h-screen p-6 fixed left-0 top-0 z-30 shadow-paper">
        {/* Editorial Logo Branding */}
        <div className="flex items-center justify-between mb-8 cursor-pointer" onClick={() => setActiveTab('home')}>
          <MMLogo size="md" showTagline={false} />
        </div>

        {/* Add Expense CTA */}
        <button
          onClick={handleOpenAddExpense}
          className="w-full py-3 px-4 mb-6 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold rounded-2xl border border-theme-border shadow-2xs active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Expense</span>
        </button>

        {/* Primary Nav Links */}
        <nav className="space-y-1 flex-1">
          <div className="text-[10px] font-bold text-theme-muted uppercase tracking-widest px-3 mb-2 font-sans">
            Journal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
                    : 'text-theme-muted hover:bg-theme-highlight hover:text-theme-text'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-theme-text stroke-[2.5]' : 'text-theme-muted'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-theme-border my-4" />
          <div className="text-[10px] font-bold text-theme-muted uppercase tracking-widest px-3 mb-2 font-sans">
            Organize
          </div>

          <button
            onClick={() => setActiveTab('lend_borrow')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'lend_borrow'
                ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
                : 'text-theme-muted hover:bg-theme-highlight hover:text-theme-text'
            }`}
          >
            <HandCoins className="w-4 h-4 text-theme-muted" />
            <span>Lend & Borrow</span>
          </button>

          <button
            onClick={() => setActiveTab('recurring')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recurring'
                ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
                : 'text-theme-muted hover:bg-theme-highlight hover:text-theme-text'
            }`}
          >
            <Repeat className="w-4 h-4 text-theme-muted" />
            <span>Upcoming Bills</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'goals'
                ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
                : 'text-theme-muted hover:bg-theme-highlight hover:text-theme-text'
            }`}
          >
            <Target className="w-4 h-4 text-theme-muted" />
            <span>Savings Goals</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-theme-card/95 backdrop-blur-md border-t border-theme-border px-3 py-2 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive ? 'text-theme-text font-bold' : 'text-theme-muted'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5 font-sans">{item.label}</span>
              </button>
            );
          })}

          {/* Central Floating Add Expense Button */}
          <div className="relative -top-4 px-2">
            <button
              onClick={handleOpenAddExpense}
              className="w-12 h-12 bg-theme-primary text-theme-text rounded-full shadow-paper border border-theme-border flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Add Expense"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('lend_borrow')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'lend_borrow' ? 'text-theme-text font-bold' : 'text-theme-muted'
            }`}
          >
            <HandCoins className={`w-5 h-5 ${activeTab === 'lend_borrow' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5 font-sans">Settle</span>
          </button>

          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive ? 'text-theme-text font-bold' : 'text-theme-muted'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5 font-sans">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
