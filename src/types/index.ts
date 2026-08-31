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

export type BillFrequency = 'one_time' | 'weekly' | 'monthly' | 'yearly';
export type BillStatus = 'pending' | 'paid';

export interface RecurringPayment {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  frequency: BillFrequency;
  nextDate: string; // YYYY-MM-DD
  reminder: boolean;
  status?: BillStatus;
  paidDate?: string;
  note?: string;
  createdAt: number;
}

export type GoalStatus = 'in_progress' | 'completed';

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string; // YYYY-MM-DD
  category?: string;
  note?: string;
  status?: GoalStatus;
  createdAt: number;
}

// Lend & Borrow Types
export interface Repayment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export type LendStatus = 'pending' | 'partially_returned' | 'fully_returned';

export interface LendRecord {
  id: string;
  personName: string;
  amount: number;
  returnedAmount: number;
  date: string;
  dueDate?: string;
  purpose?: string;
  status: LendStatus;
  repayments: Repayment[];
  createdAt: number;
}

export type BorrowStatus = 'pending' | 'partially_paid' | 'fully_paid';

export interface BorrowRecord {
  id: string;
  personName: string;
  amount: number;
  paidAmount: number;
  date: string;
  dueDate?: string;
  purpose?: string;
  status: BorrowStatus;
  repayments: Repayment[];
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

export type AppearanceMode = 'light' | 'dark';

export interface Settings {
  mode: AppearanceMode;
}

export interface BackupData {
  version: string;
  timestamp: string;
  profile: UserProfile;
  settings: Settings;
  expenses: Expense[];
  recurring: RecurringPayment[];
  goals: SavingsGoal[];
  lendRecords?: LendRecord[];
  borrowRecords?: BorrowRecord[];
}

export type TabType = 'home' | 'calendar' | 'activity' | 'insights' | 'settings' | 'recurring' | 'goals' | 'lend_borrow';
