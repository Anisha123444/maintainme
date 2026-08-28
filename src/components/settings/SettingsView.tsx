import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppearanceMode } from '../../types';
import { getFinancialMonthRange } from '../../utils/dateUtils';
import { Modal } from '../common/Modal';
import { SealStamp } from '../common/SealStamp';
import {
  Settings as SettingsIcon,
  User,
  Sun,
  Moon,
  Download,
  Upload,
  Trash2,
  ShieldAlert,
  Check,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    settings,
    updateSettings,
    saveDataToJson,
    restoreDataFromJson,
    clearAllData,
  } = useApp();

  // Profile Form state
  const [name, setName] = useState(profile.name || 'Friend');
  const [currency, setCurrency] = useState(profile.currency || '₹');
  const [income, setIncome] = useState(String(profile.income || 0));
  const [monthStart, setMonthStart] = useState(profile.financialMonthStart || 15);
  const [safeLimit, setSafeLimit] = useState(String(profile.spendingLimits?.safe || 15000));
  const [mediumLimit, setMediumLimit] = useState(String(profile.spendingLimits?.medium || 20000));
  const [maxLimit, setMaxLimit] = useState(String(profile.spendingLimits?.max || 25000));

  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Restore Modal State
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreJsonContent, setRestoreJsonContent] = useState('');
  const [restoreFeedback, setRestoreFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Clear Data Modal State
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearStep, setClearStep] = useState(1);

  const rangePreview = getFinancialMonthRange(new Date(), monthStart);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Friend',
      currency: currency.trim() || '₹',
      income: parseFloat(income) || 0,
      financialMonthStart: monthStart,
      spendingLimits: {
        safe: parseFloat(safeLimit) || 15000,
        medium: parseFloat(mediumLimit) || 20000,
        max: parseFloat(maxLimit) || 25000,
      },
    });

    setSavedSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  // Download Save My Data JSON Backup
  const handleSaveData = () => {
    const jsonStr = saveDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const todayStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `MM-backup-${todayStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Restore File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRestoreJsonContent(content);
      setRestoreFeedback({
        success: true,
        message: 'Your MM data is ready to restore.',
      });
      setIsRestoreModalOpen(true);
    };
    reader.readAsText(file);
  };

  // Perform Final Restore
  const handleConfirmRestore = async () => {
    if (!restoreJsonContent) return;
    const result = await restoreDataFromJson(restoreJsonContent);
    setRestoreFeedback(result);
    if (result.success) {
      setTimeout(() => {
        setIsRestoreModalOpen(false);
        setRestoreJsonContent('');
        setRestoreFeedback(null);
      }, 1500);
    }
  };

  // Handle Confirm Clear All Data
  const handleConfirmClear = async () => {
    await clearAllData();
    setIsClearModalOpen(false);
    setClearStep(1);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="stationery-card p-6 relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary rounded-2xl text-theme-text">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-theme-text">Settings</h2>
            <p className="text-xs text-theme-muted font-serif">Preferences, appearance & data backups</p>
          </div>
        </div>

        <SealStamp size="md" text="MM" subtext="2026" />
      </div>

      {savedSuccessMsg && (
        <div className="p-4 bg-sage-100 border border-sage-300 rounded-2xl text-sage-500 font-bold text-xs flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-sage-400" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* SECTION 1: APPEARANCE MODE (LIGHT / DARK) */}
      <div className="stationery-card p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-theme-border">
          <Sun className="w-5 h-5 text-theme-muted" />
          <h3 className="text-lg font-serif font-bold text-theme-text">Appearance</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateSettings({ mode: 'light' })}
            className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
              settings.mode === 'light'
                ? 'border-theme-accent bg-theme-primary shadow-xs'
                : 'border-theme-border bg-theme-card hover:bg-theme-highlight'
            }`}
          >
            <div className="p-2.5 bg-ivory rounded-xl border border-beige-200 text-charcoal-300">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-text">Light Mode</h4>
              <p className="text-xs text-theme-muted">Warm ivory paper</p>
            </div>
          </button>

          <button
            onClick={() => updateSettings({ mode: 'dark' })}
            className={`p-4 rounded-2xl border text-left flex items-center space-x-3 transition-all ${
              settings.mode === 'dark'
                ? 'border-theme-accent bg-theme-primary shadow-xs'
                : 'border-theme-border bg-theme-card hover:bg-theme-highlight'
            }`}
          >
            <div className="p-2.5 bg-charcoal-400 rounded-xl border border-charcoal-200 text-ivory">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-text">Dark Mode</h4>
              <p className="text-xs text-theme-muted">Warm charcoal paper</p>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 2: PROFILE & FINANCIAL MONTH SETTINGS */}
      <form onSubmit={handleSaveProfile} className="stationery-card p-6 space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-theme-border">
          <User className="w-5 h-5 text-theme-muted" />
          <h3 className="text-lg font-serif font-bold text-theme-text">Profile & Financial Month</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Currency Symbol
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">
              Monthly Income ({currency})
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full px-4 py-2.5 bg-theme-bg border border-theme-border rounded-xl text-sm font-bold text-theme-text outline-none"
            />
          </div>
        </div>

        {/* Financial Month Start Selector */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider">
            Financial Month Start Day (1st — 31st)
          </label>
          <div className="grid grid-cols-7 gap-1.5 max-h-36 overflow-y-auto p-2 bg-theme-bg rounded-2xl border border-theme-border">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setMonthStart(d)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                  monthStart === d
                    ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border'
                    : 'bg-theme-card text-theme-text hover:bg-theme-highlight'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="p-3 bg-theme-primary border border-theme-border rounded-xl text-xs font-bold text-theme-text text-center">
            Your financial month runs from the {rangePreview.label}.
          </div>
        </div>

        {/* Spending Comfort Limits */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-theme-muted uppercase tracking-wider">
            Spending Comfort Limits
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-theme-bg border border-theme-border rounded-xl space-y-1">
              <span className="font-bold text-theme-text uppercase">Safe Zone Limit</span>
              <input
                type="number"
                value={safeLimit}
                onChange={(e) => setSafeLimit(e.target.value)}
                className="w-full p-1.5 bg-theme-card border border-theme-border rounded-lg font-bold text-theme-text outline-none"
              />
            </div>

            <div className="p-3 bg-theme-bg border border-theme-border rounded-xl space-y-1">
              <span className="font-bold text-theme-text uppercase">Medium Zone Limit</span>
              <input
                type="number"
                value={mediumLimit}
                onChange={(e) => setMediumLimit(e.target.value)}
                className="w-full p-1.5 bg-theme-card border border-theme-border rounded-lg font-bold text-theme-text outline-none"
              />
            </div>

            <div className="p-3 bg-theme-bg border border-theme-border rounded-xl space-y-1">
              <span className="font-bold text-theme-terracotta uppercase">Max Zone Ceiling</span>
              <input
                type="number"
                value={maxLimit}
                onChange={(e) => setMaxLimit(e.target.value)}
                className="w-full p-1.5 bg-theme-card border border-theme-border rounded-lg font-bold text-theme-text outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-sm rounded-2xl border border-theme-border shadow-2xs transition-all"
        >
          Save Profile & Month Settings
        </button>
      </form>

      {/* SECTION 3: DATA SAFETY & BACKUP */}
      <div className="stationery-card p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-theme-border">
          <ShieldAlert className="w-5 h-5 text-theme-muted" />
          <h3 className="text-lg font-serif font-bold text-theme-text">Data Safety & Backup</h3>
        </div>

        <div className="p-4 bg-theme-bg border border-theme-border rounded-2xl text-xs text-theme-muted leading-relaxed flex items-start space-x-3">
          <Info className="w-5 h-5 text-theme-muted flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-theme-text">Single-Device Local Storage</p>
            <p className="mt-0.5">
              “Your data is saved on this device/browser. Clearing browser data may remove it. Use Save My Data regularly to create a backup.”
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleSaveData}
            className="p-4 bg-theme-card hover:bg-theme-highlight border border-theme-border rounded-2xl flex items-center space-x-3 shadow-2xs transition-all text-left"
          >
            <div className="p-3 bg-theme-primary text-theme-text rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-text">Save My Data</h4>
              <p className="text-[11px] text-theme-muted">Download timestamped `.json` backup file</p>
            </div>
          </button>

          <label className="p-4 bg-theme-card hover:bg-theme-highlight border border-theme-border rounded-2xl flex items-center space-x-3 shadow-2xs transition-all cursor-pointer">
            <div className="p-3 bg-theme-primary text-theme-text rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-text">Restore My Data</h4>
              <p className="text-[11px] text-theme-muted">Upload previously saved MM backup file</p>
            </div>
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <div className="pt-3 border-t border-theme-border flex justify-end">
          <button
            onClick={() => {
              setClearStep(1);
              setIsClearModalOpen(true);
            }}
            className="text-xs font-bold text-theme-terracotta hover:underline flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restore My Data"
      >
        <div className="space-y-4">
          <div className="p-4 bg-theme-bg border border-theme-border rounded-2xl text-xs text-theme-text space-y-2">
            <p className="font-extrabold flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-theme-terracotta" />
              <span>Your MM data is ready to restore.</span>
            </p>
            <p className="font-bold">
              “This will replace the current data on this device. Continue?”
            </p>
          </div>

          {restoreFeedback && (
            <p className={`text-xs font-bold ${restoreFeedback.success ? 'text-sage-400' : 'text-theme-terracotta'}`}>
              {restoreFeedback.message}
            </p>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setIsRestoreModalOpen(false)}
              className="flex-1 py-3 bg-theme-bg border border-theme-border font-bold text-xs text-theme-muted rounded-xl hover:text-theme-text"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRestore}
              className="flex-1 py-3 bg-theme-primary text-theme-text font-extrabold text-xs rounded-xl border border-theme-border shadow-2xs"
            >
              Restore Data
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear All Data Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Data"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 bg-terracotta-100 text-theme-terracotta rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-7 h-7" />
          </div>

          {clearStep === 1 ? (
            <>
              <h4 className="text-lg font-bold text-theme-text font-serif">Are you sure?</h4>
              <p className="text-xs text-theme-muted">
                This will remove your expenses, income, goals, and settings from this browser.
              </p>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 py-3 bg-theme-bg border border-theme-border font-bold text-xs text-theme-muted rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setClearStep(2)}
                  className="flex-1 py-3 bg-theme-terracotta text-white font-bold text-xs rounded-xl shadow-2xs hover:opacity-90"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-extrabold text-theme-terracotta font-serif">Permanent Warning</h4>
              <p className="text-xs text-theme-terracotta font-bold bg-terracotta-100 p-3 rounded-xl border border-terracotta-200">
                This will permanently remove your MM data from this device.
              </p>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="flex-1 py-3 bg-theme-bg border border-theme-border font-bold text-xs text-theme-muted rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClear}
                  className="flex-1 py-3 bg-theme-terracotta text-white font-extrabold text-xs rounded-xl shadow-2xs hover:opacity-90"
                >
                  Delete Everything
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
