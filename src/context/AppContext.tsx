import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppearanceMode,
  BackupData,
  Expense,
  Frequency,
  PaymentMethod,
  RecurringPayment,
  SavingsGoal,
  Settings,
  TabType,
  UserProfile,
} from '../types';
import {
  dbAddExpense,
  dbAddGoal,
  dbAddRecurring,
  dbClearAllData,
  dbDeleteExpense,
  dbDeleteGoal,
  dbDeleteRecurring,
  dbGetExpenses,
  dbGetGoals,
  dbGetRecurring,
  dbRestoreAllData,
  dbUpdateExpense,
  dbUpdateGoal,
  dbUpdateRecurring,
} from '../db/indexedDB';

interface AppContextType {
  // Landing state
  hasEnteredLanding: boolean;
  setHasEnteredLanding: (entered: boolean) => void;

  // Navigation & UI state
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Profile & Settings
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;

  // Data collections (100% clean, ZERO bot/sample data!)
  expenses: Expense[];
  recurring: RecurringPayment[];
  goals: SavingsGoal[];

  // CRUD Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addRecurring: (item: Omit<RecurringPayment, 'id' | 'createdAt'>) => Promise<void>;
  updateRecurring: (item: RecurringPayment) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;

  addGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (goal: SavingsGoal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addGoalFunds: (id: string, amount: number) => Promise<void>;

  // Data Save / Restore / Clear
  saveDataToJson: () => string;
  restoreDataFromJson: (jsonString: string) => Promise<{ success: boolean; message: string }>;
  clearAllData: () => Promise<void>;

  // Helpers
  isLoading: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Friend',
  income: 0,
  currency: '₹',
  financialMonthStart: 15,
  spendingLimits: {
    safe: 15000,
    medium: 20000,
    max: 25000,
  },
  onboardingCompleted: false,
};

const DEFAULT_SETTINGS: Settings = {
  mode: 'light',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasEnteredLanding, setHasEnteredLanding] = useState<boolean>(() => {
    return sessionStorage.getItem('mm_entered_landing') === 'true';
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mm_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Settings from localStorage
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('mm_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { mode: parsed.mode || 'light' };
    }
    return DEFAULT_SETTINGS;
  });

  // IndexedDB States (Clean 100% empty!)
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurring, setRecurring] = useState<RecurringPayment[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  // Apply Light / Dark class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.mode]);

  // Load user data from IndexedDB and PURGE any sample/bot data left in IndexedDB
  useEffect(() => {
    const loadDBData = async () => {
      try {
        let loadedExpenses = await dbGetExpenses();
        let loadedRecurring = await dbGetRecurring();
        let loadedGoals = await dbGetGoals();

        // Check if any old sample/bot items exist and purge them from IndexedDB!
        const hasSampleExpenses = loadedExpenses.some((e) => e.id.startsWith('sample-'));
        const hasSampleRecurring = loadedRecurring.some((r) => r.id.startsWith('rec-'));
        const hasSampleGoals = loadedGoals.some((g) => g.id.startsWith('goal-'));

        if (hasSampleExpenses || hasSampleRecurring || hasSampleGoals) {
          loadedExpenses = loadedExpenses.filter((e) => !e.id.startsWith('sample-'));
          loadedRecurring = loadedRecurring.filter((r) => !r.id.startsWith('rec-'));
          loadedGoals = loadedGoals.filter((g) => !g.id.startsWith('goal-'));
          await dbRestoreAllData(loadedExpenses, loadedRecurring, loadedGoals);
        }

        setExpenses(loadedExpenses);
        setRecurring(loadedRecurring);
        setGoals(loadedGoals);
      } catch (err) {
        console.error('Error loading IndexedDB data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDBData();
  }, []);

  const handleSetHasEnteredLanding = (entered: boolean) => {
    setHasEnteredLanding(entered);
    sessionStorage.setItem('mm_entered_landing', String(entered));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('mm_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('mm_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Expense CRUD
  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: Date.now(),
    };
    await dbAddExpense(newExpense);
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpenseAction = async (expense: Expense) => {
    await dbUpdateExpense(expense);
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
  };

  const deleteExpenseAction = async (id: string) => {
    await dbDeleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Recurring CRUD
  const addRecurringAction = async (item: Omit<RecurringPayment, 'id' | 'createdAt'>) => {
    const newItem: RecurringPayment = {
      ...item,
      id: 'rec-' + Date.now(),
      createdAt: Date.now(),
    };
    await dbAddRecurring(newItem);
    setRecurring((prev) => [...prev, newItem]);
  };

  const updateRecurringAction = async (item: RecurringPayment) => {
    await dbUpdateRecurring(item);
    setRecurring((prev) => prev.map((r) => (r.id === item.id ? item : r)));
  };

  const deleteRecurringAction = async (id: string) => {
    await dbDeleteRecurring(id);
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  };

  // Goal CRUD
  const addGoalAction = async (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'goal-' + Date.now(),
      createdAt: Date.now(),
    };
    await dbAddGoal(newGoal);
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoalAction = async (goal: SavingsGoal) => {
    await dbUpdateGoal(goal);
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  };

  const deleteGoalAction = async (id: string) => {
    await dbDeleteGoal(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addGoalFunds = async (id: string, amount: number) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const updated = { ...goal, current: Math.min(goal.target, goal.current + amount) };
    await dbUpdateGoal(updated);
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };

  // Save My Data (Export Backup JSON)
  const saveDataToJson = (): string => {
    const backup: BackupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      profile,
      settings,
      expenses,
      recurring,
      goals,
    };
    return JSON.stringify(backup, null, 2);
  };

  // Restore My Data (Import JSON)
  const restoreDataFromJson = async (jsonString: string): Promise<{ success: boolean; message: string }> => {
    try {
      const data: BackupData = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Invalid file format. Please upload a valid MM backup JSON file.' };
      }

      if (!Array.isArray(data.expenses) || !data.profile) {
        return { success: false, message: 'Missing required MM data structures in backup file.' };
      }

      await dbRestoreAllData(data.expenses || [], data.recurring || [], data.goals || []);

      if (data.profile) {
        setProfile(data.profile);
        localStorage.setItem('mm_profile', JSON.stringify(data.profile));
      }
      if (data.settings) {
        setSettings({ mode: data.settings.mode || 'light' });
        localStorage.setItem('mm_settings', JSON.stringify(data.settings));
      }

      setExpenses(data.expenses || []);
      setRecurring(data.recurring || []);
      setGoals(data.goals || []);

      return { success: true, message: 'Your MM data has been restored successfully!' };
    } catch (err) {
      return { success: false, message: 'Error reading JSON backup file. Please ensure it is intact.' };
    }
  };

  // Clear All Data
  const clearAllData = async () => {
    await dbClearAllData();
    localStorage.removeItem('mm_profile');
    localStorage.removeItem('mm_settings');
    sessionStorage.removeItem('mm_entered_landing');
    setHasEnteredLanding(false);
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
    setExpenses([]);
    setRecurring([]);
    setGoals([]);
  };

  return (
    <AppContext.Provider
      value={{
        hasEnteredLanding,
        setHasEnteredLanding: handleSetHasEnteredLanding,
        activeTab,
        setActiveTab,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        editingExpense,
        setEditingExpense,
        searchQuery,
        setSearchQuery,
        profile,
        updateProfile,
        settings,
        updateSettings,
        expenses,
        recurring,
        goals,
        addExpense,
        updateExpense: updateExpenseAction,
        deleteExpense: deleteExpenseAction,
        addRecurring: addRecurringAction,
        updateRecurring: updateRecurringAction,
        deleteRecurring: deleteRecurringAction,
        addGoal: addGoalAction,
        updateGoal: updateGoalAction,
        deleteGoal: deleteGoalAction,
        addGoalFunds,
        saveDataToJson,
        restoreDataFromJson,
        clearAllData,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
