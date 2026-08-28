export type ExpenseCategory =
  | 'Food'
  | 'Groceries'
  | 'Restaurant'
  | 'Shopping'
  | 'Transport'
  | 'Education'
  | 'Rent'
  | 'Bills'
  | 'Electricity'
  | 'Recharge'
  | 'Entertainment'
  | 'Health'
  | 'Personal'
  | 'Travel'
  | 'Family'
  | 'Subscription'
  | 'Investment'
  | 'Savings'
  | 'Other'
  | string;

export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'NetBanking' | 'Wallet' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  title: string;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: number;
}

export type Frequency = 'monthly' | 'weekly' | 'yearly';

export interface RecurringPayment {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  frequency: Frequency;
  nextDate: string; // YYYY-MM-DD
  reminder: boolean;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string; // YYYY-MM-DD
  category?: string;
  createdAt: number;
}

export interface SpendingLimits {
  safe: number;
  medium: number;
  max: number;
}

export interface UserProfile {
  name: string;
  income: number;
  currency: string; // '₹', '$', '€', etc.
  financialMonthStart: number; // 1 to 31
  spendingLimits: SpendingLimits;
  onboardingCompleted: boolean;
}

export type ThemeName = 'matcha' | 'strawberry' | 'butter' | 'blueberry' | 'peach';

export type StickerDensity = 'minimal' | 'normal' | 'decorated';

export type StickerType =
  | 'strawberry'
  | 'flower'
  | 'wallet'
  | 'coin'
  | 'calculator'
  | 'calendar'
  | 'money_plant'
  | 'coffee'
  | 'envelope'
  | 'star'
  | 'sparkle'
  | 'bow'
  | 'leaf'
  | 'notebook'
  | 'piggy_bank';

export interface Settings {
  theme: ThemeName;
  stickerEnabled: boolean;
  stickerDensity: StickerDensity;
  selectedStickers: StickerType[];
}

export interface BackupData {
  version: string;
  timestamp: string;
  profile: UserProfile;
  settings: Settings;
  expenses: Expense[];
  recurring: RecurringPayment[];
  goals: SavingsGoal[];
}

export type TabType = 'home' | 'calendar' | 'activity' | 'insights' | 'settings' | 'recurring' | 'goals';
