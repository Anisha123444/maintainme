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
} from 'lucide-react';
import { SealStamp } from './SealStamp';
import { MascotSticker } from './MascotSticker';
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
      <aside className="hidden lg:flex flex-col w-64 bg-white/95 backdrop-blur-md border-r border-warm-green-300 min-h-screen p-6 fixed left-0 top-0 z-30 shadow-stationery">
        {/* Unique MM Branding + Mascot */}
        <div className="flex items-center justify-between mb-8 cursor-pointer" onClick={() => setActiveTab('home')}>
          <MMLogo size="md" />
          <MascotSticker size="sm" />
        </div>

        {/* Floating Add Expense Button */}
        <button
          onClick={handleOpenAddExpense}
          className="w-full py-3.5 px-4 mb-6 bg-butter-400 hover:bg-butter-300 text-stone-900 font-extrabold rounded-2xl shadow-butter border-2 border-stone-900 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Expense</span>
        </button>

        {/* Primary Nav Links */}
        <nav className="space-y-1.5 flex-1">
          <div className="text-[11px] font-extrabold text-pop-pink uppercase tracking-wider px-3 mb-2">Main Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-warm-green-200 text-pop-pink shadow-xs border border-warm-green-300'
                    : 'text-stone-700 hover:bg-warm-green-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-pop-pink stroke-[2.5]' : 'text-stone-600'}`} />
                <span className={isActive ? 'font-black text-pop-pink' : ''}>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-warm-green-200 my-4" />
          <div className="text-[11px] font-extrabold text-pop-pink uppercase tracking-wider px-3 mb-2">Organize</div>

          <button
            onClick={() => setActiveTab('recurring')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'recurring'
                ? 'bg-warm-green-200 text-pop-pink shadow-xs'
                : 'text-stone-700 hover:bg-warm-green-100'
            }`}
          >
            <Repeat className="w-4 h-4 text-stone-600" />
            <span>Recurring</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'goals'
                ? 'bg-warm-green-200 text-pop-pink shadow-xs'
                : 'text-stone-700 hover:bg-warm-green-100'
            }`}
          >
            <Target className="w-4 h-4 text-stone-600" />
            <span>Savings Goals</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-warm-green-300 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
                  isActive ? 'text-pop-pink font-black' : 'text-stone-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* Central Floating Add Expense Button */}
          <div className="relative -top-5 px-2">
            <button
              onClick={handleOpenAddExpense}
              className="w-14 h-14 bg-butter-400 text-stone-900 rounded-full shadow-butter border-2 border-stone-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Add Expense"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          {navItems.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
                  isActive ? 'text-pop-pink font-black' : 'text-stone-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
