import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { getFinancialMonthRange } from '../../utils/dateUtils';
import { SealStamp } from '../common/SealStamp';

export const OnboardingWizard: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [step, setStep] = useState(1);

  const [monthStart, setMonthStart] = useState(profile.financialMonthStart || 15);
  const [income, setIncome] = useState(profile.income ? String(profile.income) : '25000');
  const [safeLimit, setSafeLimit] = useState(profile.spendingLimits?.safe ? String(profile.spendingLimits.safe) : '15000');
  const [mediumLimit, setMediumLimit] = useState(profile.spendingLimits?.medium ? String(profile.spendingLimits.medium) : '20000');
  const [maxLimit, setMaxLimit] = useState(profile.spendingLimits?.max ? String(profile.spendingLimits.max) : '25000');

  const rangePreview = getFinancialMonthRange(new Date(), monthStart);

  const handleFinish = () => {
    updateProfile({
      financialMonthStart: monthStart,
      income: income ? parseFloat(income) : 0,
      spendingLimits: {
        safe: safeLimit ? parseFloat(safeLimit) : 15000,
        medium: mediumLimit ? parseFloat(mediumLimit) : 20000,
        max: maxLimit ? parseFloat(maxLimit) : 25000,
      },
      onboardingCompleted: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-theme-bg paper-texture flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-theme-card border border-theme-border rounded-3xl p-6 sm:p-8 shadow-stationery relative overflow-hidden">
        {/* Decorative Stamp */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <SealStamp text="MM" subtext="Start" size="md" />
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-theme-accent' : 'bg-theme-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* SCREEN 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-4"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-strawberry-100 border-2 border-strawberry-200 rounded-3xl flex items-center justify-center shadow-sm">
                <span className="text-4xl">🍓</span>
              </div>

              <h1 className="text-3xl font-extrabold text-theme-text font-sans tracking-tight mb-3">
                Hi, I'm <span className="text-strawberry-600">MM</span>.
              </h1>
              <p className="text-lg font-medium text-theme-muted font-sans max-w-xs mx-auto mb-2">
                Let's get your money organized.
              </p>
              <p className="text-xs text-theme-muted italic font-serif mb-8">
                Maintain your money. Maintain your month. Maintain yourself.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-theme-accent text-white font-bold text-lg rounded-2xl shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>Let's start</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* SCREEN 2 */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-theme-primary rounded-2xl text-strawberry-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-text">When does your financial month begin?</h3>
                  <span className="text-xs text-theme-muted">Step 2 of 4</span>
                </div>
              </div>

              <div className="bg-theme-highlight border border-theme-border rounded-2xl p-4 text-sm text-theme-muted leading-relaxed">
                “Not everyone manages money from the 1st to the 30th. Pick the date that feels like the start of your month.”
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-2">
                  Select Date (1st — 31st)
                </label>
                <div className="grid grid-cols-7 gap-2 max-h-44 overflow-y-auto p-1 bg-theme-bg rounded-2xl border border-theme-border">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setMonthStart(d)}
                      className={`py-2 rounded-xl text-sm font-bold transition-all ${
                        monthStart === d
                          ? 'bg-theme-accent text-white shadow-sm scale-105'
                          : 'bg-theme-card text-theme-text hover:bg-theme-primary'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Range Output */}
              <div className="bg-strawberry-50 border border-strawberry-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-strawberry-700 uppercase tracking-wider mb-1">Your Monthly Cycle</p>
                <p className="text-base font-extrabold text-strawberry-800">
                  Your financial month will run from the {rangePreview.label}.
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 bg-theme-bg border border-theme-border text-theme-muted font-bold rounded-2xl hover:text-theme-text"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-theme-accent text-white font-bold rounded-2xl shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3 */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-theme-primary rounded-2xl text-strawberry-600">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-text">What's your monthly income?</h3>
                  <span className="text-xs text-theme-muted">Step 3 of 4</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider">
                  Monthly Income ({profile.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-theme-muted">
                    {profile.currency}
                  </span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="25000"
                    className="w-full pl-12 pr-4 py-4 bg-theme-bg border-2 border-theme-border focus:border-theme-accent rounded-2xl text-2xl font-extrabold text-theme-text outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIncome('0');
                  setStep(4);
                }}
                className="text-xs font-bold text-theme-muted hover:text-strawberry-600 underline block text-center mx-auto"
              >
                I'll add it later
              </button>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3.5 bg-theme-bg border border-theme-border text-theme-muted font-bold rounded-2xl hover:text-theme-text"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 bg-theme-accent text-white font-bold rounded-2xl shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4 */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-theme-primary rounded-2xl text-strawberry-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-theme-text">What's your spending comfort zone?</h3>
                  <span className="text-xs text-theme-muted">Step 4 of 4</span>
                </div>
              </div>

              <p className="text-xs text-theme-muted italic">
                “MM will use this only to help you understand your spending.”
              </p>

              <div className="space-y-3">
                {/* Safe */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Safe Zone</span>
                    <p className="text-[11px] text-emerald-700">Comfortable limit</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-emerald-900">{profile.currency}</span>
                    <input
                      type="number"
                      value={safeLimit}
                      onChange={(e) => setSafeLimit(e.target.value)}
                      className="w-24 p-1.5 bg-white border border-emerald-300 rounded-xl text-right font-bold text-sm text-emerald-900 outline-none"
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Medium Zone</span>
                    <p className="text-[11px] text-amber-700">Spending faster</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-amber-900">{profile.currency}</span>
                    <input
                      type="number"
                      value={mediumLimit}
                      onChange={(e) => setMediumLimit(e.target.value)}
                      className="w-24 p-1.5 bg-white border border-amber-300 rounded-xl text-right font-bold text-sm text-amber-900 outline-none"
                    />
                  </div>
                </div>

                {/* Maximum */}
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Maximum Budget</span>
                    <p className="text-[11px] text-rose-700">Upper monthly ceiling</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-rose-900">{profile.currency}</span>
                    <input
                      type="number"
                      value={maxLimit}
                      onChange={(e) => setMaxLimit(e.target.value)}
                      className="w-24 p-1.5 bg-white border border-rose-300 rounded-xl text-right font-bold text-sm text-rose-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-3.5 bg-theme-bg border border-theme-border text-theme-muted font-bold rounded-2xl hover:text-theme-text"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3.5 bg-theme-accent text-white font-bold rounded-2xl shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Open MM</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
